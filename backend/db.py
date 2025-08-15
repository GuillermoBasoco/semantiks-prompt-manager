from __future__ import annotations

from pathlib import Path
from typing import Iterator

from sqlmodel import Session, SQLModel, create_engine


DB_PATH = Path(__file__).resolve().parent / "prompts.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def init_db() -> None:
	SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
	session = Session(engine)
	try:
		yield session
	finally:
		session.close()


