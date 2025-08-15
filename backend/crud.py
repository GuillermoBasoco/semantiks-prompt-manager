from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Tuple

from sqlmodel import Session, select

from models import Prompt


def create_prompt(session: Session, *, title: str, content: str, tags: Optional[List[str]], is_active: bool) -> Prompt:
	prompt = Prompt(title=title, content=content, tags=tags or [], is_active=is_active)
	session.add(prompt)
	session.commit()
	session.refresh(prompt)
	return prompt


def get_prompt_by_id(session: Session, prompt_id: int) -> Optional[Prompt]:
	return session.get(Prompt, prompt_id)


def list_prompts(
	session: Session,
	*,
	q: Optional[str] = None,
	status: Optional[str] = None,
	tag: Optional[str] = None,
	limit: int = 100,
	offset: int = 0,
) -> Tuple[List[Prompt], int]:
	query = select(Prompt)

	if q:
		like = f"%{q}%"
		query = query.where((Prompt.title.ilike(like)) | (Prompt.content.ilike(like)))

	if status in {"active", "inactive"}:
		is_active = status == "active"
		query = query.where(Prompt.is_active == is_active)

	# Fetch first, then filter tags in Python for SQLite compatibility
	query = query.order_by(Prompt.created_at.desc())
	all_rows = session.exec(query).all()

	if tag:
		all_rows = [p for p in all_rows if tag in (p.tags or [])]

	total = len(all_rows)
	rows = all_rows[offset: offset + limit]
	return rows, total


def update_prompt(
	session: Session,
	*,
	prompt: Prompt,
	title: Optional[str] = None,
	content: Optional[str] = None,
	tags: Optional[List[str]] = None,
	is_active: Optional[bool] = None,
) -> Prompt:
	updated = False
	if title is not None:
		prompt.title = title
		updated = True
	if content is not None:
		prompt.content = content
		updated = True
	if tags is not None:
		prompt.tags = tags
		updated = True
	if is_active is not None:
		prompt.is_active = is_active
		updated = True
	if updated:
		prompt.updated_at = datetime.utcnow()
		session.add(prompt)
		session.commit()
		session.refresh(prompt)
	return prompt


def delete_prompt(session: Session, *, prompt: Prompt) -> None:
	session.delete(prompt)
	session.commit()


