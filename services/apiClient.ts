type UserRole = 'client' | 'admin';
type SubscriptionPlan = 'trial' | 'pro';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: SubscriptionPlan;
}

export interface LoginResponse {
  ok: boolean;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export type GoogleLoginResponse = LoginResponse;

export interface ArcVizQuotaResponse {
  ok: boolean;
  plan: SubscriptionPlan;
  trialLimit: number;
  trialUsed: number;
  trialRemaining: number;
  allowed: boolean;
}

const backendBaseUrl = ((import.meta as any).env.VITE_BACKEND_URL as string | undefined) || 'http://localhost:8787';

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return data as T;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${backendBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return parseJsonResponse<LoginResponse>(response);
}

export async function meRequest(accessToken: string): Promise<{ ok: boolean; user: AuthUser }> {
  const response = await fetch(`${backendBaseUrl}/api/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJsonResponse<{ ok: boolean; user: AuthUser }>(response);
}

export async function googleLoginRequest(idToken: string): Promise<GoogleLoginResponse> {
  const response = await fetch(`${backendBaseUrl}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  return parseJsonResponse<GoogleLoginResponse>(response);
}

export async function logoutRequest(refreshToken?: string, accessToken?: string): Promise<void> {
  await fetch(`${backendBaseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ refreshToken }),
  }).catch(() => undefined);
}

export async function authorizeArcvizRender(accessToken: string): Promise<ArcVizQuotaResponse> {
  const response = await fetch(`${backendBaseUrl}/api/arcviz/render`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({}),
  });

  return parseJsonResponse<ArcVizQuotaResponse>(response);
}

export async function getArcvizQuota(accessToken: string): Promise<ArcVizQuotaResponse> {
  const response = await fetch(`${backendBaseUrl}/api/arcviz/quota`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJsonResponse<ArcVizQuotaResponse>(response);
}
