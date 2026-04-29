from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import urllib.request
import urllib.parse
import json
import base64

app = FastAPI(title="Saudi-China Companion API")

# Setup CORS for the Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# No global OpenAI client needed anymore
class TranslateRequest(BaseModel):
    text: str
    source: str
    target: str

class VisionRequest(BaseModel):
    image_base64: str
    target_lang: str

@app.post("/translate")
def translate(req: TranslateRequest):
    try:
        # 100% FREE Google Translate Fallback
        target = 'zh-CN' if req.target.startswith('zh') else req.target
        source = 'zh-CN' if req.source.startswith('zh') else req.source
        
        encoded_text = urllib.parse.quote(req.text)
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl={source}&tl={target}&dt=t&q={encoded_text}"
        
        request_obj = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request_obj) as response:
            data = json.loads(response.read().decode())
            translated = "".join([sentence[0] for sentence in data[0] if sentence[0]])
            return {"translation": translated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google Translate Error: {str(e)}")

@app.post("/vision")
def vision_analyze(req: VisionRequest):
    return {"analysis": "(Mocked) تحليل للصورة: تحتوي الصورة المرفقة على عقد تجاري. لا توجد تفاصيل خطيرة، لكن السعر الإجمالي هو 5000 يوان."}

@app.post("/speak")
async def text_to_speech(request: dict):
    try:
        text = request.get("text", "")
        lang = request.get("lang", "zh-CN")
        tts_lang = 'zh-CN' if lang.startswith('zh') else 'ar'
        
        encoded_text = urllib.parse.quote(text)
        url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={encoded_text}&tl={tts_lang}&client=tw-ob"
        
        request_obj = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request_obj) as response:
            audio_data = response.read()
            audio_b64 = base64.b64encode(audio_data).decode()
            return {"audio": audio_b64, "format": "mp3"}
    except Exception as e:
        # If all fails, return empty to trigger local browser fallback
        return {"audio": "", "format": "mp3"}

@app.get("/health")
def health():
    return {"status": "ok"}
