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
