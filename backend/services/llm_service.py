import io
from PIL import Image
from google import genai
from google.genai import types
from backend.services.meta_prompt import get_decompile_system_prompt, get_optimize_system_prompt, get_evolve_system_prompt
from typing import Optional

def get_client(api_key: str) -> genai.Client:
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured. Please set the API key in your environment.")
    return genai.Client(api_key=api_key)

async def generate_content_with_fallback(client, model_name, contents, system_instruction, temperature):
    MODEL_FALLBACK_LIST = [
        "gemini-2.5-flash", 
        "gemini-2.5-flash-lite", 
        "gemini-3.1-flash-lite", 
        "gemini-3-flash-preview",
        "gemini-3.5-flash", 
        "gemini-2.0-flash"
    ]
    
    # Strip 'models/' prefix if present for clean comparison
    def clean_name(name):
        return name.replace("models/", "") if name else ""

    primary_clean = clean_name(model_name)
    
    # Build list of models to try, starting with the primary model
    models_to_try = [model_name]
    for model in MODEL_FALLBACK_LIST:
        if clean_name(model) != primary_clean:
            models_to_try.append(model)
            
    last_error = None
    for model in models_to_try:
        try:
            print(f"Attempting content generation using model: {model}...")
            response = client.models.generate_content(
                model=model,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=temperature
                )
            )
            return response.text
        except Exception as e:
            last_error = e
            print(f"Model {model} failed. Error: {e}")
            continue
            
    # If all models failed, raise the final error
    raise last_error

async def decompile_text(text_content: str, mode: str, api_key: str, model_name: str, system_profile: Optional[str] = None) -> str:
    client = get_client(api_key)
    system_instruction = get_decompile_system_prompt(mode)
    if system_profile:
        system_instruction += f"\n\nUSER SYSTEM PREFERENCES PROFILE:\n{system_profile}"
    contents = [f"Here is the text sample to reverse-engineer:\n\n{text_content}"]
    return await generate_content_with_fallback(client, model_name, contents, system_instruction, 0.2)

async def decompile_image(image_bytes: bytes, mode: str, api_key: str, model_name: str, system_profile: Optional[str] = None) -> str:
    client = get_client(api_key)
    system_instruction = get_decompile_system_prompt(mode)
    if system_profile:
        system_instruction += f"\n\nUSER SYSTEM PREFERENCES PROFILE:\n{system_profile}"
    image = Image.open(io.BytesIO(image_bytes))
    contents = [
        image,
        "Reverse-engineer the visual design, style, composition, typography, and aesthetic elements of this image into a System Prompt according to your system instructions."
    ]
    return await generate_content_with_fallback(client, model_name, contents, system_instruction, 0.2)

async def optimize_prompt(existing_prompt: str, api_key: str, model_name: str, system_profile: Optional[str] = None) -> str:
    client = get_client(api_key)
    system_instruction = get_optimize_system_prompt()
    if system_profile:
        system_instruction += f"\n\nUSER SYSTEM PREFERENCES PROFILE:\n{system_profile}"
    contents = [f"Here is the system prompt to optimize:\n\n{existing_prompt}"]
    return await generate_content_with_fallback(client, model_name, contents, system_instruction, 0.3)

async def test_system_prompt(system_prompt: str, test_input: str, api_key: str, model_name: str) -> str:
    client = get_client(api_key)
    # We use the system_prompt as the system instruction parameter
    contents = [f"Please run execution test with input parameters:\n\n{test_input}"]
    return await generate_content_with_fallback(client, model_name, contents, system_prompt, 0.5)

async def evolve_system_prompt(
    original_prompt: str,
    test_input: str,
    generated_output: str,
    user_feedback: str,
    feedback_weight: str,
    api_key: str,
    model_name: str,
    system_profile: Optional[str] = None
) -> str:
    client = get_client(api_key)
    system_instruction = get_evolve_system_prompt()
    if system_profile:
        system_instruction += f"\n\nUSER SYSTEM PREFERENCES PROFILE:\n{system_profile}"
        
    contents = [
        f"Original Prompt:\n{original_prompt}\n\n"
        f"Test Input Parameter:\n{test_input}\n\n"
        f"Generated Test Output:\n{generated_output}\n\n"
        f"User Rating Critique:\n{user_feedback}\n\n"
        f"Feedback Importance Weight:\n{feedback_weight}"
    ]
    return await generate_content_with_fallback(client, model_name, contents, system_instruction, 0.25)
