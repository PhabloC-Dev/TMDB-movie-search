import time

class MovieCache:
    def __init__(self, expire_after_seconds=600):  # Kept for 10 minutes
        self.cache = {}
        self.expire_after_seconds = expire_after_seconds

    def get(self, key):
        """Retrieve data from cache if it exists and hasn't expired."""
        if key in self.cache:
            item = self.cache[key]
            if time.time() < item["expires_at"]:
                print(f"--- [CACHE HIT] Returning cached data for: {key} ---")
                return item["data"]
            else:
                print(f"--- [CACHE EXPIRED] Removing data for: {key} ---")
                del self.cache[key]
        return None

    def set(self, key, data):
        """Store data in the cache with an expiration timestamp."""
        print(f"--- [CACHE MISS] Writing new data to cache for: {key} ---")
        self.cache[key] = {
            "data": data,
            "expires_at": time.time() + self.expire_after_seconds
        }

tmdb_cache = MovieCache(expire_after_seconds=600)