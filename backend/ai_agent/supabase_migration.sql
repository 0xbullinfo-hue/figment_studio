-- ====================================================================
-- Step 1: Database Migration Schema & Anti-Cheat Limits RPC Lock
-- Location: public schema in Supabase PostgreSQL
-- ====================================================================

-- 1. Setup User Tier and Job Status Enums
CREATE TYPE public.user_tier AS ENUM ('GUEST_TOM', 'AGENT_IKE');
CREATE TYPE public.job_status AS ENUM ('pending', 'completed', 'failed');

-- 2. Setup Profiles Table (Linked to Supabase Auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tier public.user_tier NOT NULL DEFAULT 'GUEST_TOM',
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Setup Usage Logs Table (Tracks Authenticated UUIDs and Anonymous IPs)
CREATE TABLE public.usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Nullable for visitors/guests
    ip_address TEXT NOT NULL,                                     -- Required to lock guest limit hacks
    job_id TEXT NOT NULL UNIQUE,
    status public.job_status NOT NULL DEFAULT 'pending',
    output_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Indexes for Rapid Daily Quota Inquiries
CREATE INDEX idx_usage_logs_user_date ON public.usage_logs(user_id, created_at DESC);
CREATE INDEX idx_usage_logs_ip_date ON public.usage_logs(ip_address, created_at DESC);
CREATE INDEX idx_usage_logs_job_id ON public.usage_logs(job_id);

-- 5. Trigger Function: Automatically Create Profile Row on auth.users Sign-Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, tier)
    VALUES (new.id, 'GUEST_TOM');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Configure Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile row"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Paid users read their UUID logs, guest visitors read logs matching their client IP
CREATE POLICY "Users can read their own logs"
    ON public.usage_logs FOR SELECT
    USING (
        (auth.uid() = user_id) OR 
        (user_id IS NULL AND ip_address = (NULLIF(CURRENT_SETTING('request.headers', true), '')::jsonb ->> 'x-forwarded-for'))
    );

-- 7. Core Transaction Function: Check Usage and Allocate Pending Status Atomically
CREATE OR REPLACE FUNCTION public.check_and_increment_usage_v2(
    p_user_id UUID,        -- NULL for visitor guests
    p_ip_address TEXT,     -- Client IP address
    p_job_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_tier public.user_tier;
    v_usage_count INTEGER;
    v_limit INTEGER;
    v_today_start TIMESTAMPTZ;
BEGIN
    -- Define UTC-based daily reset window (00:00 UTC)
    v_today_start := DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC');

    -- 1. Lock user profile row if authenticated, else default to guest
    IF p_user_id IS NOT NULL THEN
        SELECT tier INTO v_tier
        FROM public.profiles
        WHERE id = p_user_id
        FOR UPDATE; -- Row-level lock blocks concurrent API hits
        
        IF NOT FOUND THEN
            v_tier := 'GUEST_TOM';
        END IF;
    ELSE
        v_tier := 'GUEST_TOM';
    END IF;

    -- 2. Determine daily quota threshold limits
    IF v_tier = 'AGENT_IKE' THEN
        -- Paid Tier (Agent Ike): 20 renders daily
        v_limit := 20;
        SELECT COUNT(*)::INTEGER INTO v_usage_count
        FROM public.usage_logs
        WHERE user_id = p_user_id AND created_at >= v_today_start;
    ELSE
        -- Free Visitor Tier (Agent Tom): 5 renders daily tracked by client IP
        v_limit := 5;
        SELECT COUNT(*)::INTEGER INTO v_usage_count
        FROM public.usage_logs
        WHERE ip_address = p_ip_address AND user_id IS NULL AND created_at >= v_today_start;
    END IF;

    -- 3. Block transaction if limit exceeded
    IF v_usage_count >= v_limit THEN
        RAISE EXCEPTION 'Daily limit exceeded. User tier limit: %/% renders used.', v_usage_count, v_limit;
    END IF;

    -- 4. Insert pending placeholder log row
    INSERT INTO public.usage_logs (user_id, ip_address, job_id, status)
    VALUES (p_user_id, p_ip_address, p_job_id, 'pending');

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
