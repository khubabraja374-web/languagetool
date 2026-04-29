# Saudi-China Companion Backend

FastAPI application to integrate with OpenAI for real-time translation and vision-enabled contract reading.

## Setup
1. Create a virtual environment: `python -m venv venv`
2. Install dependencies: `pip install -r requirements.txt`
3. Update `.env` with your `OPENAI_API_KEY`.
4. Run server: `uvicorn main:app --reload`

## Deploy steps for Railway.app:
1. Connect GitHub repo
2. Set `OPENAI_API_KEY` environment variable in Railway
3. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
