import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdb, img, backdrop, getTitle, getYear, getGenres, type TMDBItem, type TMDBSeason } from "@/lib/tmdb";
import { ArrowLeft, Play, Loader2, Star, Plus, Check, Library, ChevronDown, Search, Download, Volume2, VolumeX, Sparkles, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { useWatchlist } from "@/hooks/use-watchlist";

const Details = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  const [data, setData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [seasonData, setSeasonData] = useState<TMDBSeason | null>(null);
  const [loading, setLoading] = useState(true);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const json = await tmdb.details(type!, Number(id));
        setData(json);

        if (type === "tv") {
          const sData = await tmdb.getSeason(id!, 1);
          setSeasonData(sData);
        }
      } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [type, id]);

  const handleSeasonChange = async (seasonNum: number) => {
    setSelectedSeason(seasonNum);
    setSeasonLoading(true);
    try {
      const sData = await tmdb.getSeason(id!, seasonNum);
      setSeasonData(sData);
    } catch (e) {
      toast.error("Failed to load season data");
    } finally {
      setSeasonLoading(false);
    }
  };

  const handleWatchlist = () => {
    if (data) {
      const isCurrentlyIn = isInWatchlist(data.id);
      toggleWatchlist(data, type!);
      if (isCurrentlyIn) {
        toast.error("Removed from Watchlist");
      } else {
        toast.success("Added to Watchlist");
      }
    }
  };

  const handlePlay = (s?: number, e?: number) => {
    if (type === "tv") {
      navigate(`/player/${type}/${id}/${s || selectedSeason}/${e || 1}`);
    } else {
      navigate(`/player/${type}/${id}`);
    }
  };

  if (loading) return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
        <Loader2 className="relative h-12 w-12 animate-spin text-primary" />
      </div>
      <p className="font-heading text-xs font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">
        Synchronizing Cinematic Data...
      </p>
    </div>
  );

  if (error || !data) return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black p-10 text-center">
      <div className="mb-8 rounded-full bg-white/5 border border-white/10 p-6">
        <Search className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Content Not Found</h1>
      <p className="mb-8 text-white/40 font-body max-w-md">This title might have been moved or is currently unavailable in your region.</p>
      <button onClick={() => navigate("/home")} className="group relative overflow-hidden rounded-2xl bg-white px-10 py-4 font-heading text-sm font-black text-black transition-transform hover:scale-105 active:scale-95">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        Return to Home
      </button>
    </div>
  );

  const episodes = seasonData?.episodes || [];
  const filteredEpisodes = episodes.filter(ep =>
    ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(ep.episode_number).includes(searchQuery)
  );

  const cast = data.credits?.cast?.slice(0, 10) || [];
  const recommendations = data.recommendations?.results || [];
  const inWatchlist = isInWatchlist(data.id);

  return (
    <div className="min-h-screen bg-black pb-32 font-body animate-fade-in">
      {/* Hero Header */}
      <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden sm:h-[85vh]">
        <div className="absolute inset-0">
          <img
            src={backdrop(data.backdrop_path)}
            alt={getTitle(data)}
            className="h-full w-full object-cover opacity-60 scale-105"
          />
          <div className="hero-gradient absolute inset-0 z-10" />
          <div className="hero-gradient-side absolute inset-0 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10" />
        </div>

        {/* Action Buttons Header */}
        <div className="absolute left-0 right-0 top-20 z-30 px-6 sm:top-24 sm:px-12 lg:px-20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white backdrop-blur-xl transition-all hover:bg-black/60 hover:border-white/30 active:scale-90 sm:h-12 sm:w-12 sm:rounded-2xl"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 sm:h-6 sm:w-6" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/30 active:scale-90 sm:h-12 sm:w-12 sm:rounded-2xl"
            >
              {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>

        <div className="absolute bottom-16 left-0 z-20 w-full px-6 sm:bottom-24 sm:px-12 lg:px-20">
          <div className="max-w-4xl animate-slide-up">


            <h1 className="font-heading text-3xl font-black text-white md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter uppercase italic drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {getTitle(data)}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-[10px] font-bold text-white/40 sm:mb-8 sm:gap-6 sm:text-sm">
              <div className="flex items-center gap-2 text-amber-400">
                <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
                <span>{data.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{getYear(data)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{data.runtime ? `${data.runtime}m` : `${data.number_of_seasons}S`}</span>
              </div>
              <div className="hidden xs:block px-2 py-0.5 rounded border border-white/20 text-[9px] uppercase tracking-tighter">
                4K Ultra HD
              </div>
            </div>

            <p className="mb-8 line-clamp-2 max-w-2xl text-xs font-medium leading-relaxed text-white/60 italic sm:text-sm lg:text-lg">
              {data.overview}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => handlePlay()}
                className="group relative flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-xl bg-white px-8 py-4 font-heading text-xs font-black text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] sm:flex-initial sm:rounded-2xl sm:px-10 sm:text-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Play className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
                Watch Now
              </button>

              <button
                onClick={handleWatchlist}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all hover:scale-105 active:scale-95 sm:h-14 sm:w-14 sm:rounded-2xl ${inWatchlist
                    ? "bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(229,9,20,0.5)]"
                    : "bg-white/10 border-white/5 text-white hover:bg-white/20 hover:border-white/20"
                  }`}
              >
                {inWatchlist ? <Check className="h-5 w-5 stroke-[3] sm:h-6 sm:w-6" /> : <Plus className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>

              {type === "tv" && (
                <button
                  onClick={() => document.getElementById('episodes-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="glass-sm flex flex-1 items-center justify-center gap-3 px-6 py-4 font-heading text-xs font-black text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 sm:flex-initial sm:px-8 sm:text-sm"
                >
                  <Library className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  Episodes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      {type === "tv" && (
        <div id="episodes-section" className="px-6 py-16 sm:px-12 sm:py-20 lg:px-20">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 rounded-full bg-primary" />
                <span className="font-heading text-[8px] font-black uppercase tracking-[0.3em] text-primary sm:text-[10px]">Season Directory</span>
              </div>
              <h2 className="font-heading text-2xl font-black text-white sm:text-4xl uppercase tracking-tighter">Episodes</h2>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row xs:items-center">
              <div className="relative">
                <select
                  value={selectedSeason}
                  onChange={(e) => handleSeasonChange(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl bg-white/5 border border-white/10 px-6 py-3 pr-12 text-xs font-black text-white focus:outline-none focus:ring-1 focus:ring-primary/40 tracking-widest cursor-pointer hover:bg-white/10 transition-all uppercase sm:text-sm"
                >
                  {Array.from({ length: data.number_of_seasons || 1 }, (_, i) => i + 1).map(s => (
                    <option key={s} value={s} className="bg-black">Season {s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>

              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-white/5 py-3 pl-12 pr-4 font-body text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all focus:bg-white/10 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {seasonLoading ? (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Loading Database...</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {filteredEpisodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => handlePlay(ep.season_number, ep.episode_number)}
                  className="group relative flex flex-col items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.06] hover:border-white/20 xs:flex-row xs:items-center cursor-pointer sm:rounded-3xl sm:p-5 sm:gap-6"
                >
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-card xs:w-48 sm:w-64 lg:w-72 shadow-2xl">
                    <img
                      src={img(ep.still_path || data.backdrop_path, "w500")}
                      alt={ep.name}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-500 group-hover:opacity-100">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center scale-90 group-hover:scale-100 transition-transform sm:h-14 sm:w-14">
                        <Play className="h-4 w-4 text-black fill-current sm:h-6 sm:w-6" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-lg bg-black/80 text-[10px] font-black text-white border border-white/10 backdrop-blur-md sm:bottom-3 sm:left-3 sm:h-8 sm:w-8 sm:text-xs">
                      {ep.episode_number}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-2 sm:mb-3">
                      <h3 className="truncate font-heading text-sm font-black text-white/90 group-hover:text-primary transition-colors uppercase tracking-tight sm:text-lg">
                        {ep.name}
                      </h3>
                      <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors group/dl sm:h-10 sm:w-10">
                        <Download className="h-3 w-3 text-white/30 group-hover/dl:text-white sm:h-4 sm:w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[8px] font-black text-white/40 uppercase tracking-widest mb-3 sm:gap-4 sm:text-[10px] sm:mb-4">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        {ep.runtime || "45"}m
                      </span>
                      <span className="h-0.5 w-0.5 rounded-full bg-white/10" />
                      <span>EP {ep.episode_number}</span>
                    </div>

                    <p className="line-clamp-2 text-[11px] font-medium leading-relaxed text-white/30 group-hover:text-white/60 transition-colors sm:text-sm">
                      {ep.overview || "Deep database analysis required for specific chapter summary. Cinematic experience ready for playback."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actors Section */}
      <div className="px-6 py-16 sm:px-12 sm:py-20 lg:px-20 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-primary" />
            <span className="font-heading text-[8px] font-black uppercase tracking-[0.3em] text-primary sm:text-[10px]">Star Cast</span>
          </div>
          <h2 className="font-heading text-2xl font-black text-white sm:text-4xl uppercase tracking-tighter">Featured Talent</h2>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6">
          {cast.map((actor: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
            <div
              key={actor.id}
              onClick={() => navigate(`/person/${actor.id}`)}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="relative h-20 w-20 mb-3 overflow-hidden rounded-2xl border-2 border-white/5 bg-white/5 transition-all duration-500 group-hover:scale-105 group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(229,9,20,0.3)] xs:h-24 xs:w-24 sm:h-36 sm:w-36 lg:h-44 lg:w-44 lg:rounded-[40px] sm:mb-4">
                <img
                  src={img(actor.profile_path, "w185")}
                  alt={actor.name}
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-black text-white mb-0.5 group-hover:text-primary transition-colors uppercase tracking-tight sm:text-sm sm:mb-1">{actor.name}</p>
                <p className="truncate text-[8px] font-black text-white/20 uppercase tracking-widest italic sm:text-[10px]">
                  {actor.character || "Protagonist"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="px-6 py-16 sm:px-12 sm:py-20 lg:px-20">
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-primary" />
            <span className="font-heading text-[8px] font-black uppercase tracking-[0.3em] text-primary sm:text-[10px]">Discover More</span>
          </div>
          <h2 className="font-heading text-2xl font-black text-white sm:text-4xl uppercase tracking-tighter">Similar Titles</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6">
          {recommendations.slice(0, 12).map((item: TMDBItem) => (
            <div
              key={item.id}
              onClick={() => navigate(`/details/${type || 'movie'}/${item.id}`)}
              className="group cursor-pointer space-y-3 sm:space-y-4"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5 shadow-2xl transition-all duration-500 hover:shadow-primary/20 sm:rounded-3xl">
                <img
                  src={img(item.poster_path, "w500")}
                  alt={getTitle(item)}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex flex-col items-center justify-center p-4 gap-4">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform sm:h-12 sm:w-12">
                    <Play className="h-4 w-4 text-black fill-current sm:h-5 sm:w-5" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 px-1.5 py-0.5 text-[9px] font-black text-amber-400 backdrop-blur-xl border border-white/10 sm:top-4 sm:right-4 sm:px-2.5 sm:py-1 sm:text-[11px] sm:rounded-xl">
                  <Star className="h-2.5 w-2.5 fill-current sm:h-3.5 sm:w-3.5" />
                  {item.vote_average.toFixed(1)}
                </div>
              </div>
              <div className="px-1">
                <h4 className="truncate text-xs font-black text-white/80 group-hover:text-primary transition-colors uppercase tracking-tight sm:text-sm">{getTitle(item)}</h4>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest sm:text-[10px]">{getYear(item)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;
