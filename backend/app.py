<<<<<<< HEAD
import os
from dotenv import load_dotenv
from pathlib import Path
from flask import Flask
from flask_cors import CORS

os.environ['PGCLIENTENCODING'] = 'utf-8'

# Load .env from project root
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

from database import init_db

# Create Flask app
app = Flask(__name__)
CORS(app)

# Register routes
from routes import register_routes
register_routes(app)

if __name__ == "__main__":
    try:
        init_db()
    except Exception as e:
        # Don't crash the whole app on DB init errors during local development.
        # Print useful, non-sensitive info to help debugging and continue.
        db_host = os.environ.get("DB_HOST")
        db_name = os.environ.get("DB_NAME")
        db_user = os.environ.get("DB_USER")
        print("[WARN] Database initialization failed; continuing without DB init.")
        print(f"[WARN] DB host={db_host} name={db_name} user={db_user}")
        print(f"[WARN] Init error: {e}")

    # Read host/port/debug from environment so Docker can configure them
    host = os.environ.get("FLASK_HOST", "0.0.0.0")
    port = int(os.environ.get("FLASK_PORT", 5000))
    debug = str(os.environ.get("FLASK_DEBUG", "false")).lower() in ("1", "true", "yes")

    app.run(host=host, port=port, debug=debug)
=======
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import psycopg2

os.environ['PGCLIENTENCODING'] = 'utf-8'

# Create the Flask app
app = Flask(__name__)
CORS(app)  # allow frontend to talk to backend

# Load environment variables from .env
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

# Connect to PostgreSQL
DB_PASS = os.getenv("DB_PASSWORD")

try:
    conn = psycopg2.connect(
        database=os.getenv("DB_NAME", "movies"),
        user=os.getenv("DB_USER", "postgres"),
        password=DB_PASS,
        host=os.getenv("DB_HOST", "127.0.0.1"), 
        port=os.getenv("DB_PORT", "5432")
    )
    cur = conn.cursor()
    print("Successfully connected to PostgreSQL via Network Port!")
except Exception as e:
    print(f"Database connection failed: {e}")
# ------------------------------------------------

# ------------------- ROUTES -------------------

# Search movies from TMDB
@app.route("/search")
def search_movies():
    query = request.args.get("q")
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}"
    response = requests.get(url)
    return jsonify(response.json())

# Get detailed movie metadata from TMDB
@app.route("/movie/<int:movie_id>")
def movie_details(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}"
    params = {"api_key": TMDB_API_KEY}
    response = requests.get(url, params=params)
    return jsonify(response.json())

# Get movie credits from TMDB
@app.route("/movie/<int:movie_id>/credits")
def movie_credits(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits"
    params = {"api_key": TMDB_API_KEY}
    response = requests.get(url, params=params)
    return jsonify(response.json())

# Save or update a rating into PostgreSQL (With Caching!)
@app.route("/rate", methods=["POST"])
def rate_movie():
    data = request.json
    movie_id = data.get("movieId")
    rating = data.get("rating")
    title = data.get("title")          
    poster_path = data.get("posterPath")  
    genre_ids = data.get("genre_ids")
    release_date = data.get("release_date")

    if movie_id is None or rating is None:
        return jsonify({"success": False, "error": "Missing data"}), 400

    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO ratings (movie_id, rating, title, poster_path, genre_ids, release_date)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (movie_id) 
                DO UPDATE SET 
                    rating = EXCLUDED.rating,
                    title = EXCLUDED.title,
                    poster_path = EXCLUDED.poster_path,
                    genre_ids = EXCLUDED.genre_ids,
                    release_date = EXCLUDED.release_date
                """,
                (movie_id, rating, title, poster_path, genre_ids, release_date)
            )
            conn.commit()
            
        print(f"CACHE & DATABASE SUCCESS: Saved '{title}'")
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        print(f"DATABASE ERROR: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# Fetch all rated movies from PostgreSQL
@app.route("/rated", methods=["GET"])
def get_rated_movies():
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT movie_id, rating, title, poster_path, genre_ids, release_date FROM ratings")
            rows = cur.fetchall()
            
        return jsonify([
            {
                "id": r[0], 
                "rating": r[1], 
                "title": r[2], 
                "poster_path": r[3],
                "genre_ids": r[4] if r[4] else [], 
                "release_date": r[5] if r[5] else "" 
            } for r in rows
        ])
    except Exception as e:
        print(f"FETCH ERROR: {e}")
        return jsonify([]), 500

# Remove a rating from PostgreSQL
@app.route("/rate/<int:movie_id>", methods=["DELETE"])
def delete_rating(movie_id):
    try:
        cur.execute("DELETE FROM ratings WHERE movie_id = %s", (movie_id,))
        conn.commit()
        print(f"DATABASE SUCCESS: Deleted rating for movie {movie_id}")
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        print(f"DELETE ERROR: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# ------------------- RUN APP -------------------
if __name__ == "__main__":
    app.run(debug=True)
>>>>>>> 6055484d4ec3175b56593bcab86dbf2858f653ec
