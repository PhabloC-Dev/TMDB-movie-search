from flask import request, jsonify

from controller import (
    search_movies as search_movies_ctrl,
    movie_details as movie_details_ctrl,
    movie_credits as movie_credits_ctrl,
    rate_movie as rate_movie_ctrl,
    get_rated_movies as get_rated_movies_ctrl,
    delete_rating as delete_rating_ctrl,
)

def register_routes(app):
    """Register all API routes"""

    @app.route("/search")
    def search_movies():
        query = request.args.get("q")
        page = request.args.get("page", default=1, type=int)
        return jsonify(search_movies_ctrl(query, page))

    @app.route("/movie/<int:movie_id>")
    def movie_details(movie_id):
        return jsonify(movie_details_ctrl(movie_id))

    @app.route("/movie/<int:movie_id>/credits")
    def movie_credits(movie_id):
        return jsonify(movie_credits_ctrl(movie_id))

    @app.route("/rate", methods=["POST"])
    def rate_movie():
        data = request.json
        result = rate_movie_ctrl(data)
        if isinstance(result, tuple):
            payload, status = result
            return jsonify(payload), status
        return jsonify(result)

    @app.route("/rated", methods=["GET"])
    def get_rated_movies():
        page = request.args.get("page", default=1, type=int)
        search = request.args.get("search", default="")
        rating = request.args.get("rating", default="all")
        genre = request.args.get("genre", default="")
        year = request.args.get("year", default="")
        
        result = get_rated_movies_ctrl(
            page=page, 
            search=search, 
            rating=rating, 
            genre=genre, 
            year=year
        )
        
        if isinstance(result, tuple):
            payload, status = result
            return jsonify(payload), status
        return jsonify(result)

    @app.route("/rate/<int:movie_id>", methods=["DELETE"])
    def delete_rating(movie_id):
        result = delete_rating_ctrl(movie_id)
        if isinstance(result, tuple):
            payload, status = result
            return jsonify(payload), status
        return jsonify(result)