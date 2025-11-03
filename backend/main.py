from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
from bs4 import BeautifulSoup

app = FastAPI(title="Golf Platform API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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

