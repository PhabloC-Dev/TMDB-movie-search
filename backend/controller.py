import os
from dotenv import load_dotenv
from pathlib import Path
import requests
from database import get_conn, close_conn

# 👇 Import the global cache manager instance
from movie_cache import tmdb_cache

# Load .env from project root
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

TMDB_API_KEY = os.getenv("TMDB_API_KEY")


def search_movies(query: str, page: int = 1):
    if not query:
        return {"results": [], "total_pages": 1}

    # 1. Create a unique cache key for this query combination
    cache_key = f"search:{query}:page:{page}"
    
    # 2. Return cached response if available
    cached_res = tmdb_cache.get(cache_key)
    if cached_res is not None:
        return cached_res

    # 3. Cache Miss: Make the outbound API call
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}&page={page}"
    resp = requests.get(url)
    data = resp.json()
    
    # 4. Save response data structure to cache before returning
    tmdb_cache.set(cache_key, data)
    return data


def movie_details(movie_id: int):
    cache_key = f"movie:details:{movie_id}"
    
    cached_res = tmdb_cache.get(cache_key)
    if cached_res is not None:
        return cached_res

    url = f"https://api.themoviedb.org/3/movie/{movie_id}"
    params = {"api_key": TMDB_API_KEY}
    resp = requests.get(url, params=params)
    data = resp.json()
    
    tmdb_cache.set(cache_key, data)
    return data


def movie_credits(movie_id: int):
    cache_key = f"movie:credits:{movie_id}"
    
    cached_res = tmdb_cache.get(cache_key)
    if cached_res is not None:
        return cached_res

    url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits"
    params = {"api_key": TMDB_API_KEY}
    resp = requests.get(url, params=params)
    data = resp.json()
    
    tmdb_cache.set(cache_key, data)
    return data


def rate_movie(data: dict):
    conn = None
    try:
        conn = get_conn()
        movie_id = data.get("movieId")
        rating = data.get("rating")
        title = data.get("title")
        poster_path = data.get("posterPath")
        genre_ids = data.get("genre_ids")
        release_date = data.get("release_date")

        if movie_id is None or rating is None:
            return {"success": False, "error": "Missing data"}, 400

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

        print(f"[OK] Saved '{title}' with rating {rating}")
        return {"success": True}
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"[ERROR] Database error: {e}")
        return {"success": False, "error": str(e)}, 500
    finally:
        close_conn(conn)


def get_rated_movies(page: int = 1, search: str = "", rating: str = "all", genre: str = "", year: str = ""):
    conn = None
    per_page = 20
    offset = (page - 1) * per_page
    
    try:
        conn = get_conn()
        
        base_where = "WHERE 1=1"
        query_params = []

        if search:
            base_where += " AND title ILIKE %s"
            query_params.append(f"%{search}%")
        if rating != "all":
            base_where += " AND rating = %s"
            query_params.append(int(rating))
        if genre:
            base_where += " AND %s = ANY(genre_ids)"
            query_params.append(int(genre))
        if year:
            base_where += " AND release_date LIKE %s"
            query_params.append(f"{year}%")

        with conn.cursor() as cur:
            cur.execute("SELECT release_date, genre_ids FROM ratings")
            metadata_rows = cur.fetchall()
            
            all_years = sorted(list(set(
                r[0][:4] for r in metadata_rows if r[0] and len(r[0]) >= 4
            )), reverse=True)
            
            all_genres_set = set()
            for r in metadata_rows:
                if r[1]:
                    for g_id in r[1]:
                        all_genres_set.add(g_id)
            all_genres = sorted(list(all_genres_set))

            count_sql = f"SELECT COUNT(*) FROM ratings {base_where}"
            cur.execute(count_sql, query_params)
            total_results = cur.fetchone()[0]

            data_sql = f"""
                SELECT movie_id, rating, title, poster_path, genre_ids, release_date 
                FROM ratings
                {base_where}
                ORDER BY movie_id DESC
                LIMIT %s OFFSET %s
            """
            cur.execute(data_sql, query_params + [per_page, offset])
            rows = cur.fetchall()

        movies = [
            {
                "id": r[0],
                "rating": r[1],
                "title": r[2],
                "poster_path": r[3],
                "genre_ids": r[4] if r[4] else [],
                "release_date": r[5] if r[5] else "",
            }
            for r in rows
        ]
        
        total_pages = (total_results + per_page - 1) // per_page

        return {
            "results": movies,
            "page": page,
            "per_page": per_page,
            "total_results": total_results,
            "total_pages": max(1, total_pages),
            "all_years": all_years,
            "all_genres": all_genres
        }
        
    except Exception as e:
        print(f"[ERROR] Fetch error: {e}")
        return {"success": False, "error": str(e)}, 500
    finally:
        close_conn(conn)


def delete_rating(movie_id: int):
    conn = None
    try:
        conn = get_conn()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM ratings WHERE movie_id = %s", (movie_id,))
            conn.commit()
        print(f"[OK] Deleted rating for movie {movie_id}")
        return {"success": True}
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"[ERROR] Delete error: {e}")
        return {"success": False, "error": str(e)}, 500
    finally:
        close_conn(conn)