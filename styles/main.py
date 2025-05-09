from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load API credentials
load_dotenv()
API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")

if not API_URL or not API_KEY:
    raise ValueError("❌ Missing API_URL or API_KEY in .env file!")

# Initialize FastAPI app
app = FastAPI()

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for CSS & JS files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Define request model
class ChatRequest(BaseModel):
    message: str

# Function to add emotional intelligence
def make_response_empathic(user_message, ai_response):
    support_responses = [
        "I hear you, and I understand how tough this must be for you. ",
        "That sounds really difficult. You're not alone in this. ",
        "It's okay to feel this way. I'm here for you. ",
        "Thank you for sharing that with me. You are strong. "
    ]
    if "sad" in user_message or "upset" in user_message:
        return support_responses[0] + ai_response
    elif "anxious" in user_message or "stressed" in user_message:
        return support_responses[1] + ai_response
    elif "happy" in user_message or "excited" in user_message:
        return "That's amazing to hear! 😊 " + ai_response
    else:
        return ai_response

# Serve index.html (Main page)
@app.get("/", response_class=HTMLResponse)
async def serve_home():
    try:
        with open("templates/index.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="index.html not found")

# Serve chat.html (Chat page)
@app.get("/chat", response_class=HTMLResponse)
async def serve_chat():
    try:
        with open("templates/chat.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="chat.html not found")

# Serve description.html
@app.get("/description", response_class=HTMLResponse)
async def serve_description():
    try:
        with open("templates/description.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="description.html not found")

# Chatbot Route - AI-Powered Emotional Support
@app.post("/chat")
def chat_with_bot(request: ChatRequest):
    try:
        headers = {"Content-Type": "application/json"}
        params = {"key": API_KEY}
        data = {"contents": [{"parts": [{"text": request.message}]}]}

        # Send request to AI API
        response = requests.post(API_URL, headers=headers, params=params, json=data)

        if response.status_code == 200:
            raw_ai_reply = response.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "I'm here to support you.")
            empathetic_reply = make_response_empathic(request.message, raw_ai_reply)
            return {"bot_response": empathetic_reply}
        else:
            raise HTTPException(status_code=response.status_code, detail="AI API error")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# Run FastAPI Server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=True)
