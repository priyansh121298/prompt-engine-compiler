import os
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

# Gemini configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Fallback to standard GEMINI_API_KEY or other common names if needed
if not GEMINI_API_KEY:
    GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

# Default model selection
# gemini-2.0-flash is highly recommended for speed and multimodal tasks.
MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-2.0-flash")

# Server settings
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
