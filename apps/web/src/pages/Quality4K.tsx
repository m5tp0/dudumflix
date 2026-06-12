import { useState, useEffect } from "react";
import { tmdb, type TMDBItem } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import SearchOverlay from "@/components/SearchOverlay";
import BrowseMenu from "@/components/BrowseMenu";
import Footer from "@/components/Footer";
import { SkeletonRow } from "@/components/Skeletons";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "19ecff6b7bc9e5d417b715349b09474a";

const Quality4K = () => {
  const [movies, setMovies] = useState<TMDBItem[]>([]);
  const [shows, setShows] = useState<TMDBItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [m, s] = await Promise.all([
          tmdb.quality4KMovies(),
          tmdb.quality4KSeries(),
        ]);
        setMovies(m.results);
        setShows(s.results);
      } catch (e) {
        console.error("Failed to load 4K content:", e);
      }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearchOpen={() => setSearchOpen(true)} onBrowseToggle={() => setBrowseOpen(!browseOpen)} browseOpen={browseOpen} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <BrowseMenu open={browseOpen} onClose={() => setBrowseOpen(false)} />

      <div className="pt-[96px]">
        <div className="px-12 pt-10 pb-4">
          <h1 className="font-heading text-4xl font-bold text-foreground">4K Ultra HD</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">High-fidelity content available in stunning 4K quality</p>
        </div>

        {loading ? <><SkeletonRow /><SkeletonRow /></> : (
          <>
            <ContentRow title="4K Movies" items={movies} showTitle variant="wide" />
            <ContentRow title="4K Series" items={shows} showTitle variant="wide" />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Quality4K;
