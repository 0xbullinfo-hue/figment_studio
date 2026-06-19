# ====================================================================
# Step 2: FastAPI AI Backend Orchestrator
# Location: backend/ai_agent/main.py
# ====================================================================

import os
import httpx
import hmac
import hashlib
import uuid
from typing import Optional
from fastapi import FastAPI, Request, Header, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

# Initialize Environment Configuration Variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")
RUNPOD_API_KEY = os.getenv("RUNPOD_API_KEY", "your-runpod-api-key")
RUNPOD_ENDPOINT_ID = os.getenv("RUNPOD_ENDPOINT_ID", "your-endpoint-id")
RUNPOD_WEBHOOK_SECRET = os.getenv("RUNPOD_WEBHOOK_SECRET", "your-runpod-webhook-secret")
APP_BACKEND_URL = os.getenv("APP_BACKEND_URL", "https://your-backend-api.com")
IS_PRODUCTION = os.getenv("ENVIRONMENT") == "PRODUCTION"

# Initialize Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
app = FastAPI(title="Figment Studio ArcViz AI Agent Backend")

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Input Parameters Schema
class RenderPayload(BaseModel):
    image_base64: str          # Raw image asset base64 string
    lighting_scenario: str     # Options: Natural: Golden Hour (Warm Sunrise/Sunset), etc.
    camera_perspective: str    # Options: Wide Shot (Expansive, Environmental), etc.
    architectural_style: str   # Options: Style: Japandi Zen, etc.
    material_override: str     # Options: Material: Exposed Concrete, etc.
    lock_geometry: bool        # Constraint toggle 1
    lock_lighting: bool        # Constraint toggle 2
    creative_direction: Optional[str] = "" # User custom text prompt overrides

# Prompt Stitching Engine
def stitch_comfyui_prompt(payload: RenderPayload) -> str:
    # 1. Map dropdown selectors to dense, high-fidelity prompt strings
    lighting_scenarios = {
        "Natural: Golden Hour (Warm Sunrise/Sunset)": "low angle warm sunset lighting, soft long golden shadows, warm volumetric rays, 3200K, atmospheric sunbeams",
        "Natural: Noon Sunlight (High Contrast, 5500K)": "overhead solar illumination, high noon bright daylight, sharp structural contrast shadows, clear blue sky",
        "Artificial: Studio Softbox (Bright, Airy)": "diffused studio light, soft box key lights, high-key bright and airy architectural photography studio lighting",
        "Mixed: Dusk (Cool Exterior + Warm Interior)": "twilight dusk blue hour sky, cool blue ambient light, warm interior tungsten lighting glow, high luxury contrast reflections"
    }

    camera_perspectives = {
        "Wide Shot (Expansive, Environmental)": "wide-angle lens architectural shot, expansive environment backdrop, landscape integration, spatial scale focus",
        "Close-up (Macro, Detail-Oriented)": "macro close-up architectural detail shot, shallow depth of field, material focus, tactile texture rendering",
        "Aerial View (Birds-Eye, Drone)": "aerial drone architectural photography, high-altitude birds-eye overview, urban planning context layout",
        "Dutch Angle (Tilted, Dynamic)": "tilted horizon Dutch angle shot, dynamic architectural lines, dramatic composition focus"
    }

    architectural_styles = {
        "Style: Japandi Zen": "Japandi zen interior architecture, minimalist warm light wood slats, low furniture, washitsu tatami mats, clean structure lines",
        "Style: brutalist concrete": "raw brutalist monolithic concrete structures, monumental volume forms, heavy solid massings, clean horizontal lines",
        "Style: Tropical Modernist": "tropical modernist villa facade, deep teak wood screens, expansive glass window walls, dense green palm foliage shadows",
        "Style: High-Tech Glass": "high-tech steel and glass office structure, curved glazed facade profiles, structural steel mullions, modern urban grid"
    }

    material_overrides = {
        "Material: Exposed Concrete": "raw exposed industrial concrete panels, concrete formwork seam lines, round tie holes, weathered brutalist concrete texture",
        "Material: 8K Marble Displacement": "polished bookmatched white Calacatta marble panels, high glossy mirror reflection, detailed grey displacement veins",
        "Material: Tyrolean PBR": "rough Tyrolean textured facade plaster, scratch plaster finish, high bump mapping relief facade",
        "Material: Brushed Aluminum": "anodized brushed aluminum metal cladding, metallic satin finish reflection, silver structural panels"
    }

    prompt_parts = [
        "Architectural visualization:",
        lighting_scenarios.get(payload.lighting_scenario, ""),
        camera_perspectives.get(payload.camera_perspective, ""),
        architectural_styles.get(payload.architectural_style, ""),
        material_overrides.get(payload.material_override, "")
    ]

    # 2. Append constraints and toggles
    if payload.lock_geometry:
        prompt_parts.append("preserve original blueprint line-work geometry, lock straight structural vectors, zero facade shape deformation, highly precise dimensions alignment")
    if payload.lock_lighting:
        prompt_parts.append("match lighting source coordinates and shadow patterns from the reference sketch")
    
    # 3. Append manual text overrides
    if payload.creative_direction and payload.creative_direction.strip():
        prompt_parts.append(payload.creative_direction.strip())

    return ", ".join(filter(None, prompt_parts))

# Async Worker to call GPU Serverless Endpoint
async def dispatch_render_job(job_id: str, prompt: str, image_base64: str, lock_geometry: bool):
    # Set model control parameters based on geometry lock toggle
    production_payload = {
        "input": {
            "workflow_params": {
                "prompt": prompt,
                "negative_prompt": "mutated structures, warped boundaries, text, low quality, warped facades, drawings, cartoon",
                "image": image_base64,
                "controlnet_weight": 0.85 if lock_geometry else 0.0,
                "denoise_strength": 0.40 if lock_geometry else 0.75
            }
        },
        "webhook": f"{APP_BACKEND_URL}/api/webhooks/runpod?job_id={job_id}"
    }

    local_payload = {
        "client_id": job_id,
        "prompt": {
            "6": {
                "inputs": {
                    "text": prompt,
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "7": {
                "inputs": {
                    "text": "mutated structures, warped boundaries, text, low quality, warped facades, drawings, cartoon",
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "3": {
                "inputs": {
                    "seed": 42,
                    "steps": 25,
                    "cfg": 7.0,
                    "sampler_name": "euler",
                    "scheduler": "normal",
                    "denoise": 0.40 if lock_geometry else 0.75,
                    "model": ["4", 0],
                    "positive": ["6", 0],
                    "negative": ["7", 0],
                    "latent_image": ["5", 0]
                },
                "class_type": "KSampler"
            },
            "4": {
                "inputs": {
                    "ckpt_name": "sd_xl_base_1.0.safetensors"
                },
                "class_type": "CheckpointLoaderSimple"
            },
            "5": {
                "inputs": {
                    "width": 1024,
                    "height": 1024,
                    "batch_size": 1
                },
                "class_type": "EmptyLatentImage"
            }
        }
    }

    if IS_PRODUCTION:
        # 1. Dispatch to RunPod Cloud Serverless Architecture
        runpod_key = os.getenv("RUNPOD_KEY") or RUNPOD_API_KEY
        runpod_endpoint = os.getenv("RUNPOD_ENDPOINT") or RUNPOD_ENDPOINT_ID
        
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {runpod_key}",
                "Content-Type": "application/json"
            }
            runpod_url = f"https://api.runpod.ai/v1/{runpod_endpoint}/run"
            try:
                res = await client.post(runpod_url, json=production_payload, headers=headers, timeout=12.0)
                res.raise_for_status()
            except Exception as e:
                # Set job status to failed if dispatch crashes
                try:
                    supabase.table("usage_logs").update({"status": "failed"}).eq("job_id", job_id).execute()
                except Exception:
                    pass
                print(f"[Error] RunPod dispatch failure: {str(e)}")
    else:
        # 2. Dispatch to your local ComfyUI instance
        try:
            async with httpx.AsyncClient() as client:
                await client.post("http://127.0.0.1:8188/prompt", json=local_payload, timeout=2.0)
        except Exception as e:
            print(f"[Local ComfyUI] Connection failed, using simulated fallback: {str(e)}")
        
        # Auto-complete local runs to keep UI active without needing custom ws listener
        import asyncio
        await asyncio.sleep(2.0)
        
        mock_images = [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070"
        ]
        import random
        mock_url = random.choice(mock_images)
        try:
            supabase.table("usage_logs").update({
                "status": "completed",
                "output_url": mock_url
            }).eq("job_id", job_id).execute()
        except Exception as db_err:
            print(f"[Error] Failed to update local usage log: {str(db_err)}")

# Client submit endpoint
@app.post("/api/render")
async def start_render(payload: RenderPayload, request: Request, background_tasks: BackgroundTasks):
    # 1. Extract and sanitize client IP address
    client_ip = request.headers.get("x-forwarded-for") or request.client.host
    if client_ip and "," in client_ip:
        client_ip = client_ip.split(",")[0].strip()

    # 2. Validate user identity token (Treat as Guest Tom if missing/expired)
    user_id = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            user_response = supabase.auth.get_user(token)
            if user_response.user:
                user_id = user_response.user.id
        except Exception:
            pass # Fall back to Guest Tom visitor rules

    job_id = str(uuid.uuid4())

    # 3. Fire Atomic limits check (verifies 5/day IP limits or 20/day paid subscriber limits)
    try:
        rpc_res = supabase.rpc(
            "check_and_increment_usage_v2",
            {"p_user_id": user_id, "p_ip_address": client_ip, "p_job_id": job_id}
        ).execute()

        if not rpc_res.data:
            raise HTTPException(status_code=429, detail="Daily quota exceeded.")
    except Exception as e:
        raise HTTPException(status_code=429, detail=f"Usage check rejected: {str(e)}")

    # 4. Compile parameters and dispatch async task to background workers
    prompt = stitch_comfyui_prompt(payload)
    background_tasks.add_task(dispatch_render_job, job_id, prompt, payload.image_base64, payload.lock_geometry)

    return {"status": "queued", "job_id": job_id}

# RunPod Webhook callback listener
@app.post("/api/webhooks/runpod")
async def runpod_webhook(request: Request, job_id: str, x_runpod_signature: str = Header(None)):
    # Security check: verify signature hashes to block webhook attacks
    body = await request.body()
    expected_signature = hmac.new(
        RUNPOD_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, x_runpod_signature):
        raise HTTPException(status_code=403, detail="Webhook signature mismatch.")

    data = await request.json()
    status = data.get("status")
    output_url = data.get("output", {}).get("image_url")
    
    # Update Supabase database status to release client pollers
    if status == "COMPLETED" and output_url:
        supabase.table("usage_logs").update({
            "status": "completed", 
            "output_url": output_url
        }).eq("job_id", job_id).execute()
    else:
        supabase.table("usage_logs").update({
            "status": "failed"
        }).eq("job_id", job_id).execute()

    return {"status": "success"}

# Client polling endpoint
@app.get("/api/status")
async def get_job_status(job_id: str):
    res = supabase.table("usage_logs").select("status", "output_url").eq("job_id", job_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Job not found.")
    
    return res.data[0]
