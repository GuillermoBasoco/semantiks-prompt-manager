from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel


class Prompt(SQLModel, table=True):
	id: Optional[int] = Field(default=None, primary_key=True)
	title: str
	role: str  # "Eres [experto X]"
	task: str  # "[acción concreta]"
	context: str  # "[datos]"
	constraints: List[str] = Field(default_factory=list, sa_column=Column(JSON))  # "[lista]"
	output_format: str  # "[ej. JSON con campos...]"
	criteria: str  # "[qué evaluar antes de responder]"
	status: str = Field(default="active")  # "active" | "inactive"
	tags: List[str] = Field(default_factory=list, sa_column=Column(JSON))
	created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
	updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


