from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Tuple

from sqlmodel import Session, select

from models import Prompt


def create_prompt(
	session: Session,
	*,
	role: str,
	task: str,
	context: str,
	constraints: Optional[List[str]],
	output_format: str,
	criteria: str,
	status: str,
	tags: Optional[List[str]],
) -> Prompt:
	prompt = Prompt(
		role=role,
		task=task,
		context=context,
		constraints=constraints or [],
		output_format=output_format,
		criteria=criteria,
		status=status,
		tags=tags or []
	)
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
		query = query.where(
			(Prompt.role.ilike(like)) | (Prompt.task.ilike(like)) | (Prompt.context.ilike(like)) | (Prompt.criteria.ilike(like)) | (Prompt.output_format.ilike(like))
		)

	if status in {"active", "inactive"}:
		query = query.where(Prompt.status == status)

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
	role: Optional[str] = None,
	task: Optional[str] = None,
	context: Optional[str] = None,
	constraints: Optional[List[str]] = None,
	output_format: Optional[str] = None,
	criteria: Optional[str] = None,
	status: Optional[str] = None,
	tags: Optional[List[str]] = None,
) -> Prompt:
	updated = False
	if role is not None:
		prompt.role = role
		updated = True
	if task is not None:
		prompt.task = task
		updated = True
	if context is not None:
		prompt.context = context
		updated = True
	if constraints is not None:
		prompt.constraints = constraints
		updated = True
	if output_format is not None:
		prompt.output_format = output_format
		updated = True
	if criteria is not None:
		prompt.criteria = criteria
		updated = True
	if status is not None:
		prompt.status = status
		updated = True
	if tags is not None:
		prompt.tags = tags
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


