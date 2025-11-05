from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from urllib.parse import urljoin
import httpx
from bs4 import BeautifulSoup
import logging
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Golf Platform API")

# CORS middleware
import os
allowed_origins = [
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", ""),
]
# Filter out empty strings
allowed_origins = [origin for origin in allowed_origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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

class ScrapeCoursesRequest(BaseModel):
    url: str
    selector: str
    field_selectors: Optional[Dict[str, str]] = None  # Optional field mappings like {"name": "h2", "url": "a"}

class CourseData(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    url: Optional[str] = None
    state: Optional[str] = None
    raw_html: Optional[str] = None
    extracted_fields: Optional[Dict[str, Any]] = None

class ScrapeCoursesResponse(BaseModel):
    url: str
    selector: str
    courses: List[CourseData]
    total_found: int

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

@app.post("/api/scrape-courses", response_model=ScrapeCoursesResponse)
async def scrape_courses(request: ScrapeCoursesRequest):
    """
    Scrape golf courses from a given URL using provided selectors.
    
    Example:
    - url: "https://golf-nyc.book.teeitup.com/search"
    - selector: "[data-testid^='facility-card-']"
    - field_selectors: {"name": "h2", "url": "a"}
    """
    try:
        async with httpx.AsyncClient() as client:
            # Set headers to mimic a browser request
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            response = await client.get(request.url, headers=headers, timeout=30.0)
            response.raise_for_status()
            
            # Check if HTML contains the selector (likely a JS-rendered page)
            html_snippet = response.text[:2000] if len(response.text) > 2000 else response.text
            logger.info(f"HTML snippet (first 2000 chars): {html_snippet}")
            # logger.info(f"HTML contains 'facility-card': {'facility-card' in response.text}")  // update fo future debugging
            
            # Try to use Playwright for JavaScript-rendered pages
            try:
                from playwright.async_api import async_playwright
                logger.info("Using Playwright to render JavaScript...")
                
                async with async_playwright() as p:
                    logger.info("Launching browser...")
                    browser = None
                    try:
                        browser = await p.chromium.launch(headless=True)
                        page = await browser.new_page()
                        
                        # Disable images and stylesheets for faster loading
                        async def handle_route(route):
                            resource_type = route.request.resource_type
                            if resource_type in ['image', 'stylesheet', 'font']:
                                await route.abort()
                            else:
                                await route.continue_()
                        
                        await page.route('**/*', handle_route)
                        
                        logger.info(f"Navigating to {request.url}...")
                        # Navigate once with the most permissive wait strategy
                        # If wait_until times out, the page may still be loading, so we'll rely on wait_for_selector later
                        try:
                            await page.goto(request.url, wait_until="domcontentloaded", timeout=60000)
                            logger.info("Page loaded (domcontentloaded)")
                        except Exception as e:
                            # logger.warning(f"domcontentloaded failed: {e}, trying load...")
                            # try:
                            #     await page.goto(request.url, wait_until="load", timeout=60000)
                            #     logger.info("Page loaded (load)")
                            # except Exception as e2:
                            #     logger.warning(f"load failed: {e2}, trying without wait...")
                            #     await page.goto(request.url, timeout=60000)
                            #     logger.info("Page loaded (no wait)")
                            logger.warning(f"Navigation wait timed out: {e}, page may still be loading - will wait for selector")
                            # Don't re-navigate - the page may have partially loaded
                            # Continue and rely on wait_for_selector to handle dynamic content
                        
                        # Wait a bit for JavaScript to execute
                        logger.info("Waiting for JavaScript to execute...")
                        await page.wait_for_timeout(3000)  # 3 seconds
                        
                        # Wait for elements to appear
                        logger.info(f"Waiting for selector: {request.selector}")
                        try:
                            await page.wait_for_selector(request.selector, timeout=10000)
                            logger.info("Selector found!")
                        except Exception as e:
                            logger.warning(f"Selector {request.selector} not found after 10 seconds: {e}")
                            # Check what's actually on the page
                            body_text = await page.evaluate("() => document.body.innerText")
                            logger.info(f"Page body text (first 500 chars): {body_text[:500]}")
                            # Check for any elements with data-testid
                            test_ids = await page.evaluate("""
                                () => {
                                    const elements = document.querySelectorAll('[data-testid]');
                                    return Array.from(elements).slice(0, 10).map(el => el.getAttribute('data-testid'));
                                }
                            """)
                            logger.info(f"Found data-testid attributes: {test_ids}")
                        
                        # Get the rendered HTML
                        logger.info("Getting page content...")
                        html_content = await page.content()
                        logger.info(f"Page content length: {len(html_content)}")
                        
                        soup = BeautifulSoup(html_content, 'lxml')
                        logger.info("Successfully parsed HTML with Playwright")
                    finally:
                        # Ensure browser is always closed, even if an exception occurs
                        if browser is not None:
                            try:
                                await browser.close()
                                logger.info("Browser closed successfully")
                            except Exception as e:
                                logger.warning(f"Error closing browser: {e}")
            except ImportError:
                logger.warning("Playwright not installed, falling back to static HTML parsing")
                soup = BeautifulSoup(response.text, 'lxml')
            except Exception as e:
                logger.error(f"Playwright failed: {e}")
                logger.error(f"Traceback: {traceback.format_exc()}")
                logger.warning("Falling back to static HTML parsing")
                soup = BeautifulSoup(response.text, 'lxml')
            
            # Find all elements matching the selector
            # Support both CSS selectors and attribute selectors
            matched_elements = soup.select(request.selector)
            logger.info(f"Request URL: {request.url}")
            logger.info(f"Selector: {request.selector}")
            logger.info(f"Found {len(matched_elements)} matched elements")
            
            courses = []
            for idx, element in enumerate(matched_elements):
                logger.info(f"Element: {element}")
                
                course_data = CourseData(
                    id=str(idx),
                    raw_html=str(element),
                    extracted_fields={}
                )
                
                # Extract data-testid if present
                test_id = element.get('data-testid', None)
                if test_id:
                    course_data.id = test_id
                    course_data.extracted_fields['data-testid'] = test_id
                
                # If field_selectors provided, extract specific fields
                if request.field_selectors:
                    for field_name, field_selector in request.field_selectors.items():
                        try:
                            field_element = element.select_one(field_selector)
                            if field_element:
                                # Get text or href depending on the element type
                                if field_element.name == 'a':
                                    value = field_element.get('href', field_element.get_text(strip=True))
                                    # Convert relative URLs to absolute
                                    if value and value.startswith('/'):
                                        value = urljoin(request.url, value)
                                else:
                                    value = field_element.get_text(strip=True)
                                
                                course_data.extracted_fields[field_name] = value
                                
                                # Map common fields to CourseData attributes
                                if field_name.lower() in ['name', 'title']:
                                    course_data.name = value
                                elif field_name.lower() in ['url', 'link', 'href']:
                                    course_data.url = value
                                elif field_name.lower() == 'state':
                                    course_data.state = value
                        except Exception as e:
                            # If selector fails for a field, continue with others
                            course_data.extracted_fields[field_name] = None
                
                # If no field_selectors provided, try to extract common patterns
                if not request.field_selectors:
                    # Try to find name in common tags (find() only accepts tag names)
                    name_elem = element.find(['h1', 'h2', 'h3', 'h4'])
                    # If not found, try CSS selectors using select_one()
                    if not name_elem:
                        name_elem = element.select_one('.name, [data-testid~="name"]')
                    if name_elem:
                        course_data.name = name_elem.get_text(strip=True)
                    
                    # Try to find URL in links
                    link_elem = element.find('a', href=True)
                    if link_elem:
                        href = link_elem.get('href')
                        if href:
                            course_data.url = urljoin(request.url, href)
                
                courses.append(course_data)
            
            return ScrapeCoursesResponse(
                url=request.url,
                selector=request.selector,
                courses=courses,
                total_found=len(courses)
            )
            
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch URL: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

