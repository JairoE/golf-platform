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
