from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class PromptBase(BaseModel):
	title: str = Field(min_length=1, max_length=200)
	role: str = Field(min_length=1, max_length=200)
	task: str = Field(min_length=1)
	context: str = Field(min_length=1)
	constraints: List[str] = []
	output_format: str = Field(min_length=1)
	criteria: str = Field(min_length=1)
	status: str = Field(default="active", pattern="^(active|inactive)$")
	tags: List[str] = []


class PromptCreate(PromptBase):
	pass


class PromptUpdate(BaseModel):
	role: Optional[str] = Field(default=None, min_length=1, max_length=200)
	task: Optional[str] = Field(default=None, min_length=1)
	context: Optional[str] = Field(default=None, min_length=1)
	constraints: Optional[List[str]] = None
	output_format: Optional[str] = Field(default=None, min_length=1)
	criteria: Optional[str] = Field(default=None, min_length=1)
	status: Optional[str] = Field(default=None, pattern="^(active|inactive)$")
	tags: Optional[List[str]] = None


class PromptRead(PromptBase):
	id: int
	created_at: datetime
	updated_at: datetime

	class Config:
		from_attributes = True


