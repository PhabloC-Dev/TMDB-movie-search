export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
  cast?: CastMember[];
}

export interface CastMember {
  cast_id: number;
  name: string;
  character: string;
}

export interface RatedMovie {
  id: number;
  title: string;
  poster_path: string;
  rating: number;
  genre_ids?: number[];
  release_date?: string;
}