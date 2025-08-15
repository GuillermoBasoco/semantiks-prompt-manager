from __future__ import annotations

from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import os
from sqlmodel import Session

from crud import create_prompt, get_prompt_by_id, list_prompts, update_prompt
from db import get_session, init_db
from schemas import PromptCreate, PromptRead, PromptUpdate


app = FastAPI(title="Semantiks Prompt Manager", version="0.1.0")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
	CORSMiddleware,
	allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
	init_db()


@app.post("/prompts", response_model=PromptRead, status_code=201)
def create_prompt_endpoint(payload: PromptCreate, session: Session = Depends(get_session)) -> PromptRead:
	prompt = create_prompt(
		session,
		title=payload.title,
		content=payload.content,
		tags=payload.tags,
		is_active=payload.is_active,
	)
	return prompt


@app.get("/prompts", response_model=List[PromptRead])
def list_prompts_endpoint(
	session: Session = Depends(get_session),
	q: Optional[str] = Query(default=None, description="Search in title/content"),
	status: Optional[str] = Query(default=None, pattern="^(active|inactive)$"),
	tag: Optional[str] = Query(default=None),
	limit: int = Query(default=100, ge=1, le=500),
	offset: int = Query(default=0, ge=0),
) -> List[PromptRead]:
	rows, _ = list_prompts(session, q=q, status=status, tag=tag, limit=limit, offset=offset)
	return rows


@app.get("/prompts/{prompt_id}", response_model=PromptRead)
def get_prompt_endpoint(prompt_id: int, session: Session = Depends(get_session)) -> PromptRead:
	prompt = get_prompt_by_id(session, prompt_id)
	if not prompt:
		raise HTTPException(status_code=404, detail="Prompt not found")
	return prompt


@app.patch("/prompts/{prompt_id}", response_model=PromptRead)
def update_prompt_endpoint(
	prompt_id: int,
	payload: PromptUpdate,
	session: Session = Depends(get_session),
) -> PromptRead:
	prompt = get_prompt_by_id(session, prompt_id)
	if not prompt:
		raise HTTPException(status_code=404, detail="Prompt not found")

	updated = update_prompt(
		session,
		prompt=prompt,
		title=payload.title,
		content=payload.content,
		tags=payload.tags,
		is_active=payload.is_active,
	)
	return updated


