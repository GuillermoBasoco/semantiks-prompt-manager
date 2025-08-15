## Semantiks Prompt Manager

A simple prompts manager with a FastAPI backend and a Next.js (TypeScript) frontend using shadcn-style UI components.

### Tech
- Backend: FastAPI + SQLModel (SQLite)
- Frontend: Next.js 14 + React + TypeScript + Tailwind (shadcn-style components included locally)

### Project Structure
- `backend/` – FastAPI app
- `frontend/` – Next.js app (App Router)

---

## How to Run

### 1) Backend

Requirements: Python 3.10+

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend will run at `http://localhost:8000`.

### 2) Frontend

Requirements: Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:3000`.

---

## Example API Usage

Base URL: `http://localhost:8000`

- Create a prompt
```bash
curl -X POST http://localhost:8000/prompts \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Summarize Meeting",
    "content": "Summarize the following transcript in bullet points.",
    "tags": ["summary", "meeting"],
    "is_active": true
  }'
```

- List prompts (optional filters: `status=active|inactive`, `tag=...`, `q=...`)
```bash
curl "http://localhost:8000/prompts?status=active&tag=summary&q=meeting"
```

- Get details
```bash
curl http://localhost:8000/prompts/1
```

- Update status
```bash
curl -X PATCH http://localhost:8000/prompts/1 \
  -H 'Content-Type: application/json' \
  -d '{"is_active": false}'
```

---

## UI Overview

- Home (`/`):
  - Table listing prompts: title, tags, status, created date
  - Filter bar: keyword and tag filter, status dropdown
  - Per-row actions: View, Toggle Active/Inactive

- Create (`/new`):
  - Form with Title, Content, Tags (comma-separated), Active checkbox

- Details (`/prompts/[id]`):
  - Prompt metadata and content
  - Toggle Active/Inactive button

---

## Notes

- CORS is enabled for `http://localhost:3000` in development.
- SQLite database file is created in `backend/` as `prompts.db` on first run.
- The frontend uses local shadcn-style components under `frontend/components/ui` (no CLI required).


