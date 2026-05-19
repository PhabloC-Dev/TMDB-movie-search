import os
from dotenv import load_dotenv
from pathlib import Path
from flask import Flask
from flask_cors import CORS

os.environ['PGCLIENTENCODING'] = 'utf-8'

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

from database import init_db

app = Flask(__name__)
CORS(app)

from routes import register_routes
register_routes(app)

if __name__ == "__main__":
    try:
        init_db()
    except Exception as e:  
        db_host = os.environ.get("DB_HOST")
        db_name = os.environ.get("DB_NAME")
        db_user = os.environ.get("DB_USER")
        print("[WARN] Database initialization failed; continuing without DB init.")
        print(f"[WARN] DB host={db_host} name={db_name} user={db_user}")
        print(f"[WARN] Init error: {e}")

    host = os.environ.get("FLASK_HOST", "0.0.0.0")
    port = int(os.environ.get("FLASK_PORT", 5000))
    debug = str(os.environ.get("FLASK_DEBUG", "false")).lower() in ("1", "true", "yes")

    app.run(host=host, port=port, debug=debug)
