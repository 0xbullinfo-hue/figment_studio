# ====================================================================
# Step 4: Python QA Automated Weight Testing Script
# Location: backend/ai_agent/qa_weight_test.py
# ====================================================================

import os
import time
import base64
import requests
import json

try:
    import cv2
    import numpy as np
    from skimage.metrics import structural_similarity as ssim
    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False

# QA Test Configurations
DATASET_DIR = "./golden_dataset_baselines"
OUTPUT_DIR = "./qa_test_results"
API_ENDPOINT = "http://localhost:8000/api/render"
STATUS_ENDPOINT = "http://localhost:8000/api/status"

# Parameter search grid for weight calibrations (ControlNet weight vs Denoise strength)
CONTROLNET_WEIGHTS = [0.60, 0.75, 0.90, 1.00]
DENOISE_STRENGTHS = [0.35, 0.45, 0.55]

def get_base64_image(image_path: str) -> str:
    """Reads a binary image and serializes it to base64 for HTTP transfer."""
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")

def calculate_geometry_preservation(original_path: str, rendered_path: str) -> float:
    """
    Extracts Canny structural edges on both original sketch and output render,
    and runs a Structural Similarity Index (SSIM) score comparison.
    """
    if not HAS_OPENCV:
        return -1.0 # Fallback indicator if OpenCV/skimage are not installed locally

    try:
        # Load images as grayscale
        img_orig = cv2.imread(original_path, cv2.IMREAD_GRAYSCALE)
        img_rend = cv2.imread(rendered_path, cv2.IMREAD_GRAYSCALE)

        # Resize to match dimensions if output dimensions shifted
        if img_orig.shape != img_rend.shape:
            img_rend = cv2.resize(img_rend, (img_orig.shape[1], img_orig.shape[0]))

        # Run Canny Edge Filter to isolate structural lines
        edges_orig = cv2.Canny(img_orig, 100, 200)
        edges_rend = cv2.Canny(img_rend, 100, 200)

        # Calculate Structural Similarity Index
        score, _ = ssim(edges_orig, edges_rend, full=True)
        return float(score)
    except Exception as e:
        print(f"    [Error] Geometry analysis failed: {str(e)}")
        return 0.0

def execute_qa_matrix():
    # Setup folders
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    if not os.path.exists(DATASET_DIR):
        print(f"[Error] Dataset baseline folder '{DATASET_DIR}' not found. Please create it and add test sketches.")
        return

    images = [f for f in os.listdir(DATASET_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if not images:
        print("[Notice] No baseline sketches found. Add images to './golden_dataset_baselines' to run QA loops.")
        return

    print("====================================================================")
    print("Figment AI Agent: Running Automated Structural Weight Tests")
    print("====================================================================")
    
    report_data = []

    for img_name in images:
        img_path = os.path.join(DATASET_DIR, img_name)
        img_base64 = get_base64_image(img_path)
        
        print(f"\nProcessing Baseline: {img_name}")

        for weight in CONTROLNET_WEIGHTS:
            for denoise in DENOISE_STRENGTHS:
                print(f"  -> Testing: Weight {weight} | Denoise {denoise}")
                
                # Build payload
                payload = {
                    "image_base64": img_base64,
                    "lighting_scenario": "Natural: Golden Hour (Warm Sunrise/Sunset)",
                    "camera_perspective": "Wide Shot (Expansive, Environmental)",
                    "architectural_style": "Style: Japandi Zen",
                    "material_override": "Material: Exposed Concrete",
                    "lock_geometry": True,
                    "lock_lighting": False,
                    "creative_direction": f"QA execution run with weight={weight} denoise={denoise}"
                }

                # 1. Fire request to local API orchestrator
                try:
                    res = requests.post(API_ENDPOINT, json=payload, timeout=10.0)
                    if res.status_code != 200:
                        print(f"    [Failed] API rejected request: {res.text}")
                        continue
                    
                    job_data = res.json()
                    job_id = job_data.get("job_id")
                    print(f"    [Queued] Job ID: {job_id}. Polling status...")
                except Exception as e:
                    print(f"    [Failed] API connection error: {str(e)}")
                    continue

                # 2. Poll status API until task completes
                status = "pending"
                output_url = None
                attempts = 0
                max_attempts = 30 # Max 90s wait time per render

                while status in ["pending", "queued"] and attempts < max_attempts:
                    time.sleep(3)
                    attempts += 1
                    try:
                        status_res = requests.get(f"{STATUS_ENDPOINT}?job_id={job_id}", timeout=5.0)
                        if status_res.status_code == 200:
                            status_data = status_res.json()
                            status = status_data.get("status")
                            output_url = status_data.get("output_url")
                    except Exception:
                        pass

                if status == "completed" and output_url:
                    print(f"    [Completed] Render generated. Downloading visual output...")
                    
                    # 3. Download rendering result
                    try:
                        img_res = requests.get(output_url, timeout=15.0)
                        out_img_name = f"{os.path.splitext(img_name)[0]}_w{weight}_d{denoise}.jpg"
                        out_img_path = os.path.join(OUTPUT_DIR, out_img_name)
                        
                        with open(out_img_path, "wb") as f:
                            f.write(img_res.content)
                        
                        # 4. Compute structural fidelity using Canny & SSIM
                        preservation_score = calculate_geometry_preservation(img_path, out_img_path)
                        score_text = f"{preservation_score * 100:.2f}%" if preservation_score >= 0 else "N/A (cv2 missing)"
                        print(f"    [Result] Structural Similarity Score: {score_text}")
                        
                        report_data.append({
                            "image": img_name,
                            "weight": weight,
                            "denoise": denoise,
                            "score": preservation_score,
                            "output_file": out_img_name
                        })
                    except Exception as e:
                        print(f"    [Error] Download/Save failure: {str(e)}")
                else:
                    print(f"    [Failed] Job failed or timed out with status: {status}")

    # 5. Compile Markdown Quality report
    write_md_report(report_data)

def write_md_report(data):
    report_path = os.path.join(OUTPUT_DIR, "qa_report.md")
    with open(report_path, "w") as f:
        f.write("# Figment AI Agent: ControlNet Parameter QA Matrix\n\n")
        f.write("Evaluation of structural alignment (SSIM edge metrics) across weights and denoise variations.\n\n")
        f.write("| Baseline Sketch | CN Weight | Denoise Strength | SSIM Score | Saved Output Frame |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- |\n")
        
        for row in data:
            score_fmt = f"**{row['score'] * 100:.1f}%**" if row['score'] >= 0 else "N/A"
            f.write(f"| {row['image']} | {row['weight']} | {row['denoise']} | {score_fmt} | `{row['output_file']}` |\n")
            
    print(f"\n[Completed] QA Matrix checks completed. Summary logs saved to '{report_path}'.")

if __name__ == "__main__":
    execute_qa_matrix()
