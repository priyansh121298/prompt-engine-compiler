import os
import random
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

# Load all potential Gemini API keys for rotation/fallback
API_KEYS = []

# 1. Check GEMINI_API_KEY (singular)
sing_key = os.getenv("GEMINI_API_KEY")
if sing_key:
    API_KEYS.append(sing_key)

# 2. Check GOOGLE_API_KEY (singular)
goog_key = os.getenv("GOOGLE_API_KEY")
if goog_key:
    API_KEYS.append(goog_key)

# 3. Check GEMINI_API_KEYS (comma-separated list)
plural_keys = os.getenv("GEMINI_API_KEYS")
if plural_keys:
    for k in plural_keys.split(","):
        k_clean = k.strip()
        if k_clean and k_clean not in API_KEYS:
            API_KEYS.append(k_clean)

# 4. Check indexed variables: GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
idx = 1
while True:
    k_indexed = os.getenv(f"GEMINI_API_KEY_{idx}")
    if not k_indexed:
        # Check up to 10 just in case there is a gap
        if idx > 10:
            break
        idx += 1
        continue
    if k_indexed not in API_KEYS:
        API_KEYS.append(k_indexed)
    idx += 1

# Expose primary key for backwards compatibility
GEMINI_API_KEY = API_KEYS[0] if API_KEYS else None

def get_gemini_api_key() -> str:
    """Returns a random or primary API key from the pool, if available."""
    if not API_KEYS:
        return None
    return random.choice(API_KEYS)

# Default model selection
MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-2.0-flash")

# Server settings
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
