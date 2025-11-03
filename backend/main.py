from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import httpx
from bs4 import BeautifulSoup

app = FastAPI(title="Golf Platform API")

# CORS configuration
# Prefer explicit ALLOWED_ORIGINS (comma-separated). FRONTEND_URL kept for backward compatibility.
raw_allowed: str = os.getenv("ALLOWED_ORIGINS", "").strip()
fallback_frontend: str = os.getenv("FRONTEND_URL", "").strip()

allowed_origins: List[str] = [
    origin.strip()
    for origin in (raw_allowed.split(",") if raw_allowed else [])
    if origin.strip()
]

# Always allow local Next.js dev by default
if "http://localhost:3000" not in allowed_origins:
    allowed_origins.append("http://localhost:3000")

# Back-compat single value
if fallback_frontend and fallback_frontend not in allowed_origins:
    allowed_origins.append(fallback_frontend)

allowed_origin_regex = os.getenv("ALLOWED_ORIGIN_REGEX", "").strip() or None

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TeeTimeRequest(BaseModel):
    url: str

class TeeTimeResponse(BaseModel):
    course: str
    url: str
    tee_times: Optional[list] = None
    raw_data: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Golf Platform API"}

@app.post("/api/tee-times/{course_name}")
async def get_tee_times(course_name: str, request: TeeTimeRequest):
    """
    Fetch tee times for a given course URL
    TODO: Implement actual tee time extraction logic with Playwright
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(request.url, timeout=30.0)
            response.raise_for_status()
            
            # Parse HTML content
            soup = BeautifulSoup(response.text, 'lxml')
            
            # Extract tee time data (this is a placeholder - actual extraction depends on the site structure)
            tee_times_data = {
                "url": request.url,
                "title": soup.title.string if soup.title else None,
                "content_length": len(response.text),
            }
            
            return TeeTimeResponse(
                course=course_name,
                url=request.url,
                tee_times=None,
                raw_data=str(tee_times_data)
            )
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tee times: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

