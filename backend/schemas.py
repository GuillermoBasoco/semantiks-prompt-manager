from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class PromptBase(BaseModel):
	title: str = Field(min_length=1, max_length=200)
	content: str = Field(min_length=1)
	tags: List[str] = []
	is_active: bool = True


class PromptCreate(PromptBase):
	pass


class PromptUpdate(BaseModel):
	title: Optional[str] = Field(default=None, min_length=1, max_length=200)
	content: Optional[str] = Field(default=None, min_length=1)
	tags: Optional[List[str]] = None
	is_active: Optional[bool] = None


class PromptRead(PromptBase):
	id: int
	created_at: datetime
	updated_at: datetime

	class Config:
		from_attributes = True


