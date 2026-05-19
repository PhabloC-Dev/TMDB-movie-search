from dotenv import load_dotenv
import os
import psycopg2 
import sys
from pathlib import Path

os.environ['PGCLIENTENCODING'] = 'utf-8'

# Load .env from project root
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)


def get_conn():
    """Create a fresh database connection"""
    try:
        conn = psycopg2.connect(
            database=os.getenv("DB_NAME", "movies"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST", "127.0.0.1"),
            port=os.getenv("DB_PORT", "5432")
        )
        return conn
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")
        raise


def close_conn(conn):
    """Close the database connection"""
    if conn:
        conn.close()


def init_db():
    """Initialize the database schema if necessary."""
    conn = None
    try:
        conn = get_conn()
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS ratings (
                    movie_id INTEGER PRIMARY KEY,
                    rating INTEGER NOT NULL,
                    title TEXT,
                    poster_path TEXT,
                    genre_ids INTEGER[],
                    release_date TEXT
                )
                """
            )
            conn.commit()
    except Exception as e:
        print(f"[ERROR] Database initialization failed: {e}")
        raise
    finally:
        close_conn(conn)
