from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import os

from routes import envi, indices

PORT_API = 8008

app = FastAPI(
    title="API server",
    version="1.0.0",
)

# Configure CORS settings
origins = [
  "http://localhost:3000",
  "https://hoppscotch.io",
  "https://your-web-app.com",
]
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  # allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
  expose_headers=["X-shape", "X-resize"]
)

@app.get("/")
def root():
  return {"message": f"Server running on port {PORT_API}"}

app.include_router(envi.router)
app.include_router(indices.router)

def start_api_server():
    try:
        print("Starting API server...")
        # uvicorn.run("main:app", host="0.0.0.0", port=PORT_API, log_level=None, reload=True)
        uvicorn.run(app, host="0.0.0.0", port=PORT_API, log_level=None)
        return True
    except:
        print("Failed to start API server")
        return False
      
if __name__ == "__main__":
  start_api_server()