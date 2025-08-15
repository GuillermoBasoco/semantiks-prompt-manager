from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column
from sqlalchemy.dialects.sqlite import JSON
from sqlmodel import Field, SQLModel


class Prompt(SQLModel, table=True):
	id: Optional[int] = Field(default=None, primary_key=True)
	title: str
	content: str
	tags: List[str] = Field(default_factory=list, sa_column=Column(JSON))
	is_active: bool = Field(default=True)
	created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
	updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


