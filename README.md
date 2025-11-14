# Golf Platform

A Next.js application with TypeScript frontend and Python FastAPI backend for managing golf course bookings and tee times.

## Features

- User authentication with login page
- Home page with navigation to available courses
- Course directory displaying available golf courses
- Backend API for fetching tee-time information

## Tech Stack

### Frontend

- Next.js 15 with App Router
- TypeScript
- React 18
- Emotion & styled-components for styling
- Yarn for package management

### Backend

- Python 3
- FastAPI
- BeautifulSoup4 for web scraping

## Setup

### Frontend Setup

1. Install dependencies:

```bash
yarn install
```

2. Run the development server:

```bash
yarn dev
```

The frontend will be available at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the backend server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

## Usage

1. Start both the frontend and backend servers
2. Navigate to http://localhost:3000
3. Login with any username and password
4. Click "Available Courses" to view the course directory
5. Click "Get Tee Times" for any course to fetch tee-time information

## Project Structure

```
golf-platform/
├── app/                    # Next.js app directory
│   ├── login/             # Login page
│   ├── home/              # Home page after login
│   ├── courses/           # Available courses page
│   └── layout.tsx         # Root layout
├── backend/               # Python FastAPI backend
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
└── package.json          # Frontend dependencies
```

## Available Courses

Currently configured courses:

- **bethpage**: https://foreupsoftware.com/index.php/booking/19765/2431#teetimes

## GitHub Pages Deployment

The frontend can be deployed to GitHub Pages as a static site.

### Prerequisites

1. Enable GitHub Pages in your repository settings (Settings → Pages)
2. Select GitHub Actions as the source
3. Host your backend API somewhere accessible (e.g., Railway, Render, Heroku)

### Deployment Steps

1. **Set up environment variables** in GitHub repository secrets:

   - `API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app`)

2. **Build and test locally**:

   ```bash
   # Set API URL (optional, defaults to http://localhost:8000)
   export NEXT_PUBLIC_API_URL=https://your-backend-url.com
   yarn build
   ```

   The static files will be in the `out/` directory.

3. **Push to main branch**:
   The GitHub Actions workflow will automatically build and deploy to GitHub Pages.

4. **Update backend CORS**:
   Make sure your backend allows your GitHub Pages domain:
   ```bash
   export FRONTEND_URL=https://your-username.github.io
   ```

### Manual Build for GitHub Pages

If deploying manually:

```bash
# For repository subdirectory (username.github.io/repo-name)
export NEXT_PUBLIC_BASE_PATH=/repo-name
export NEXT_PUBLIC_API_URL=https://your-backend-url.com
yarn build
# Then upload the 'out' folder contents to GitHub Pages
```

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8000`)
- `NEXT_PUBLIC_BASE_PATH`: Base path for GitHub Pages subdirectory deployment (e.g., `/repo-name`)

#### Allowing your GitHub Pages origin in the backend

In `backend/` set one of the following before starting the server:

```bash
export ALLOWED_ORIGINS=https://<your-username>.github.io
# or allow via regex
# export ALLOWED_ORIGIN_REGEX=^https://<your-username>\.github\.io$
```

For local development with a tunnel:

```bash
cloudflared tunnel --url http://localhost:8000
export NEXT_PUBLIC_API_URL=https://<your-tunnel>.trycloudflare.com
```
