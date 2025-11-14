# Golf Platform Backend

FastAPI backend for the Golf Platform application.

## Setup

1. Create a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

## CORS and GitHub Pages (HTTPS)

When the frontend is hosted on GitHub Pages (HTTPS), the browser blocks requests to an HTTP backend (localhost). Use one of the following:

- Expose your local API over HTTPS using a tunnel (recommended for development)
- Deploy the API to a public HTTPS host (Railway/Render/etc.)

### Option A: Tunnel your local API (recommended for development)

Using cloudflared (free, no account required):

```bash
# Install if needed: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
cloudflared tunnel --url http://localhost:8000
```

Or using ngrok:

```bash
ngrok http 8000
```

Set environment variables so the backend allows your Pages origin and the frontend calls the tunnel URL:

```bash
# Backend (CORS)
export ALLOWED_ORIGINS=https://<your-username>.github.io
# or use regex (allows all your GitHub Pages subpaths)
# export ALLOWED_ORIGIN_REGEX=^https://<your-username>\.github\.io$

# Frontend (API URL)
# In GitHub Actions secret or local build env
export NEXT_PUBLIC_API_URL=https://<your-tunnel-subdomain>.trycloudflare.com
# or the ngrok https URL
```

Restart the backend after changing env vars.

### Option B: Deploy API to HTTPS

Deploy the FastAPI service to any provider and set:

```bash
# Backend (CORS)
export ALLOWED_ORIGINS=https://<your-username>.github.io
# Frontend (API URL)
export NEXT_PUBLIC_API_URL=https://<your-api-host>
```

## Environment variables

- `ALLOWED_ORIGINS`: Comma-separated list of exact origins allowed for CORS.
- `ALLOWED_ORIGIN_REGEX`: Optional regex to allow origins (e.g., `^https://<user>\.github\.io$`).
- `FRONTEND_URL`: Backward compatible single-origin allow (deprecated in favor of `ALLOWED_ORIGINS`).
