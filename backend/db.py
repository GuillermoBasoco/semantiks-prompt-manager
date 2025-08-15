from __future__ import annotations

from pathlib import Path
from typing import Iterator
import os

from sqlmodel import Session, SQLModel, create_engine


DB_PATH = Path(__file__).resolve().parent / "prompts.db"

DEFAULT_SQLITE_URL = f"sqlite:///{DB_PATH}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
	connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def init_db() -> None:
	SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
	session = Session(engine)
	try:
		yield session
	finally:
		session.close()


