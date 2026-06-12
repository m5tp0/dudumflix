const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "128be8f669a1827d6460059fe404f464";
const BASE = "https://api.themoviedb.org/3";

export const img = (path: string | null, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.svg";

export const backdrop = (path: string | null) => img(path, "original");

async function get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

interface TMDBList { results: TMDBItem[] }

export interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  origin_country?: string[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
  seasons?: TMDBSeason[];
}

export interface TMDBSeason {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  episodes?: TMDBEpisode[];
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  runtime: number;
}

export const getTitle = (item: TMDBItem) => item.title || item.name || "Untitled";
export const getYear = (item: TMDBItem) => (item.release_date || item.first_air_date || "").slice(0, 4);
export const getType = (item: TMDBItem) => item.media_type === "tv" || item.name ? "TV SHOW" : "MOVIE";
export const getMediaType = (item: TMDBItem) => item.media_type || (item.name ? "tv" : "movie");

export const genreMap: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

export const getGenres = (item: TMDBItem) =>
  (item.genre_ids || []).slice(0, 2).map(id => genreMap[id] || "").filter(Boolean).join(" · ");

export const tmdb = {
  trending: () => get<TMDBList>("/trending/all/day"),
  trendingMovies: () => get<TMDBList>("/trending/movie/day"),
  trendingTv: () => get<TMDBList>("/trending/tv/day"),
  popular: () => get<TMDBList>("/movie/popular"),
  popularTv: () => get<TMDBList>("/tv/popular"),
  topRated: () => get<TMDBList>("/movie/top_rated"),
  topRatedTv: () => get<TMDBList>("/tv/top_rated"),
  upcoming: () => get<TMDBList>("/movie/upcoming"),
  animePopular: () => get<TMDBList>("/discover/tv", { with_genres: "16", with_original_language: "ja", "sort_by": "popularity.desc" }),
  animeTopRated: () => get<TMDBList>("/discover/tv", { with_genres: "16", with_original_language: "ja", "sort_by": "vote_average.desc", "vote_count.gte": "100" }),
  animeTrending: () => get<TMDBList>("/discover/tv", { with_genres: "16", with_original_language: "ja", "sort_by": "first_air_date.desc" }),
  quality4KMovies: () => get<TMDBList>("/discover/movie", { "sort_by": "popularity.desc", "vote_count.gte": "500", "vote_average.gte": "7" }),
  quality4KSeries: () => get<TMDBList>("/discover/tv", { "sort_by": "popularity.desc", "vote_count.gte": "500", "vote_average.gte": "7" }),
  discover: (genre: number, type = "movie") => get<TMDBList>(`/discover/${type}`, { with_genres: String(genre) }),
  netflix: () => get<TMDBList>("/discover/tv", { with_networks: "213" }),
  prime: () => get<TMDBList>("/discover/tv", { with_networks: "1024" }),
  max: () => get<TMDBList>("/discover/tv", { with_networks: "3186" }),
  disney: () => get<TMDBList>("/discover/tv", { with_networks: "2739" }),
  apple: () => get<TMDBList>("/discover/tv", { with_networks: "2552" }),
  paramount: () => get<TMDBList>("/discover/tv", { with_networks: "4330" }),
  search: (query: string) => get<TMDBList>("/search/multi", { query }),
  details: (type: string, id: number) => get<TMDBItem>(`/${type}/${id}`, { append_to_response: "credits,videos,recommendations" }),
  videos: (type: string, id: number) => get<{ results: { key: string; site: string; type: string }[] }>(`/${type}/${id}/videos`),
  getSeason: (tvId: number | string, seasonNumber: number | string) => get<TMDBSeason>(`/tv/${tvId}/season/${seasonNumber}`),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  person: (id: number) => get<any>(`/person/${id}`, { append_to_response: "combined_credits,images" }),
};
