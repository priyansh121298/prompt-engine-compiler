from fastapi import FastAPI, UploadFile, Form, File, HTTPException, Header
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

from backend import config
from backend.services import llm_service

app = FastAPI(
    title="Prompt Engine API",
    description="Stateless backend API for reverse-engineering system prompts from copy or images.",
    version="1.0.0"
)

# Enable CORS for development flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OptimizeRequest(BaseModel):
    existing_prompt: str
    system_profile: Optional[str] = None

class TestSystemRequest(BaseModel):
    system_prompt: str
    test_input: str

class EvolveRequest(BaseModel):
    original_prompt: str
    test_input: str
    generated_output: str
    user_feedback: str
    feedback_weight: str
    system_profile: Optional[str] = None

@app.post("/api/decompile")
async def decompile(
    input_type: str = Form(...),
    interaction_mode: str = Form(...),
    text_content: Optional[str] = Form(None),
    image_file: Optional[UploadFile] = File(None),
    system_profile: Optional[str] = Form(None),
    x_gemini_api_key: Optional[str] = Header(None)
):
    # Verify API key (prefer client provided, fallback to server)
    api_key = x_gemini_api_key or config.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured. Please configure your client key in the settings modal or set it in the server environment."
        )

    if input_type not in ["text", "image"]:
        raise HTTPException(status_code=400, detail="Invalid input_type. Must be 'text' or 'image'.")
    
    if interaction_mode not in ["automation", "augmentation"]:
        raise HTTPException(status_code=400, detail="Invalid interaction_mode. Must be 'automation' or 'augmentation'.")

    try:
        if input_type == "text":
            if not text_content or not text_content.strip():
                raise HTTPException(status_code=400, detail="text_content is required for 'text' input type.")
            
            result = await llm_service.decompile_text(
                text_content=text_content,
                mode=interaction_mode,
                api_key=api_key,
                model_name=config.MODEL_NAME,
                system_profile=system_profile
            )
        else:  # image
            if not image_file:
                raise HTTPException(status_code=400, detail="image_file is required for 'image' input type.")
            
            # Read image data
            image_bytes = await image_file.read()
            if not image_bytes:
                raise HTTPException(status_code=400, detail="Uploaded image file is empty.")
            
            result = await llm_service.decompile_image(
                image_bytes=image_bytes,
                mode=interaction_mode,
                api_key=api_key,
                model_name=config.MODEL_NAME,
                system_profile=system_profile
            )
        
        return {
            "success": True,
            "decompiled_prompt": result,
            "error": None
        }

    except Exception as e:
        # Catch errors from the SDK or PIL processing
        error_msg = str(e)
        return {
            "success": False,
            "decompiled_prompt": None,
            "error": f"Failed to decompile input: {error_msg}"
        }

@app.post("/api/optimize")
async def optimize(
    request: OptimizeRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    # Verify API key (prefer client provided, fallback to server)
    api_key = x_gemini_api_key or config.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured. Please configure your client key in the settings modal or set it in the server environment."
        )

    if not request.existing_prompt or not request.existing_prompt.strip():
        raise HTTPException(status_code=400, detail="existing_prompt is required and cannot be empty.")

    try:
        result = await llm_service.optimize_prompt(
            existing_prompt=request.existing_prompt,
            api_key=api_key,
            model_name=config.MODEL_NAME,
            system_profile=request.system_profile
        )
        return {
            "success": True,
            "optimized_prompt": result,
            "error": None
        }
    except Exception as e:
        error_msg = str(e)
        return {
            "success": False,
            "optimized_prompt": None,
            "error": f"Failed to optimize prompt: {error_msg}"
        }

@app.post("/api/test_system")
async def test_system(
    request: TestSystemRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    api_key = x_gemini_api_key or config.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured. Please configure your client key in settings."
        )

    if not request.system_prompt or not request.system_prompt.strip():
        raise HTTPException(status_code=400, detail="system_prompt is required.")

    try:
        result = await llm_service.test_system_prompt(
            system_prompt=request.system_prompt,
            test_input=request.test_input,
            api_key=api_key,
            model_name=config.MODEL_NAME
        )
        return {
            "success": True,
            "test_output": result,
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "test_output": None,
            "error": f"Failed to test system: {str(e)}"
        }

@app.post("/api/evolve")
async def evolve(
    request: EvolveRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    api_key = x_gemini_api_key or config.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured. Please configure your client key in settings."
        )

    try:
        result = await llm_service.evolve_system_prompt(
            original_prompt=request.original_prompt,
            test_input=request.test_input,
            generated_output=request.generated_output,
            user_feedback=request.user_feedback,
            feedback_weight=request.feedback_weight,
            api_key=api_key,
            model_name=config.MODEL_NAME,
            system_profile=request.system_profile
        )
        return {
            "success": True,
            "evolved_system": result,
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "evolved_system": None,
            "error": f"Failed to evolve system: {str(e)}"
        }

# Mount static files. Must be defined LAST to prevent route shadowing.
# Ensure 'frontend' folder exists
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
else:
    # Fail gracefully if folder is not created yet
    pass
