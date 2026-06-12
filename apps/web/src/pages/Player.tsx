import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { tmdb, type TMDBItem } from "@/lib/tmdb";
import { useHistory } from "@/hooks/use-history";
import { toast } from "sonner";

const Player = () => {
  const { type, id, season, episode } = useParams();
  const navigate = useNavigate();
  const { addToHistory } = useHistory();

  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [seriesData, setSeriesData] = useState<TMDBItem | null>(null);
  const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!id || !type) return;

    (async () => {
      setLoading(true);
      try {
        const data = await tmdb.details(type, Number(id));
        setSeriesData(data);
        addToHistory(data, type);
      } catch (e) {
        console.error("Failed to load media for player:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [type, id, addToHistory]);

  useEffect(() => {
    if (!seriesData) return;

    if (type === "tv") {
      document.title = `${seriesData.name || seriesData.title} — S${season} E${episode} — VELORA`;
    } else {
      document.title = `Playing ${seriesData.title || seriesData.name} — VELORA`;
    }

    return () => { document.title = "VELORA — Cinematic Experience"; };
  }, [type, season, episode, seriesData]);

  useEffect(() => {
    setIframeLoaded(false);
  }, [id, season, episode]);

  const handleAutoplay = useCallback(() => {
    if (type !== "tv" || !seriesData || !seriesData.seasons) return;

    const s = Number(season);
    const e = Number(episode);

    const currentSeason = seriesData.seasons.find(szn => szn.season_number === s);
    if (!currentSeason) return;

    let nextS = s;
    let nextE = e + 1;

    if (nextE > currentSeason.episode_count) {
      const nextSeason = seriesData.seasons
        .filter(szn => szn.season_number > s && szn.season_number !== 0)
        .sort((a, b) => a.season_number - b.season_number)[0];

      if (nextSeason) {
        nextS = nextSeason.season_number;
        nextE = 1;
      } else {
        toast("End of series reached");
        return;
      }
    }

    toast.info(`Up Next: S${nextS} E${nextE}`, {
      description: "Autoplay starting soon...",
      duration: 3000,
    });

    if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
    autoplayTimeoutRef.current = setTimeout(() => {
      navigate(`/player/tv/${id}/${nextS}/${nextE}`);
    }, 3000);
  }, [type, season, episode, seriesData, navigate, id]);

  useEffect(() => {
    return () => {
      if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (message && message.type === "PLAYER_EVENT" && message.data) {
          if (message.data.event === "ended") {
            handleAutoplay();
          }
          // Note: Remote playback sync removed as backend is disabled.
        }
      } catch (e) {
        // Not a VidKing message or not JSON
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleAutoplay]);

  const embedUrl = useMemo(() => {
    const baseUrl = type === "tv"
      ? `https://www.vidking.net/embed/tv/${id}/${season}/${episode}`
      : `https://www.vidking.net/embed/movie/${id}`;

    return `${baseUrl}?autoplay=1&color=e50914`;
  }, [type, id, season, episode]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {!iframeLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="font-body text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            VELORA CINEMATIC...
          </p>
        </div>
      )}

      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-6 top-6 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 active:scale-90"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      {/* THE PLAYER IFRAME */}
      <div className="absolute inset-0 h-full w-full">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="h-full w-full border-none"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          {...{ webkitallowfullscreen: "true", mozallowfullscreen: "true" }}
          title={seriesData?.title || seriesData?.name || "Player"}
          onLoad={() => setIframeLoaded(true)}
        />
      </div>
    </div>
  );
};

export default Player;
