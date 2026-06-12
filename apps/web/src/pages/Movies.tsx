import { useState, useEffect } from "react";
import { tmdb, type TMDBItem } from "@/lib/tmdb";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { SkeletonRow } from "@/components/Skeletons";

const genreIds: Record<string, number> = {
  Action: 28, Comedy: 35, Horror: 27, Romance: 10749, "Sci-Fi": 878, Drama: 18, Thriller: 53, Adventure: 12,
};

const Movies = () => {
  const [popular, setPopular] = useState<TMDBItem[]>([]);
  const [topRated, setTopRated] = useState<TMDBItem[]>([]);
  const [upcoming, setUpcoming] = useState<TMDBItem[]>([]);
  const [trending, setTrending] = useState<TMDBItem[]>([]);
  const [genreTab, setGenreTab] = useState("Action");
  const [genreItems, setGenreItems] = useState<TMDBItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [pop, top, up, tr] = await Promise.all([
          tmdb.popular(), tmdb.topRated(), tmdb.upcoming(), tmdb.trendingMovies(),
        ]);
        setPopular(pop.results);
        setTopRated(top.results);
        setUpcoming(up.results);
        setTrending(tr.results);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await tmdb.discover(genreIds[genreTab]);
        setGenreItems(data.results);
      } catch (e) {
        console.error("Failed to load genre items:", e);
      }
    })();
  }, [genreTab]);

  return (
    <div className="min-h-screen pb-20">
      <div className="pt-24 sm:pt-32">
        <div className="px-4 pb-4 pt-8 sm:px-6 sm:pt-10 lg:px-12">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Movies</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">Explore thousands of movies across every genre</p>
        </div>

        {loading ? <><SkeletonRow /><SkeletonRow /></> : (
          <>
            <ContentRow title="Trending Movies" items={trending} showTitle />
            <ContentRow title="Popular" items={popular} showTitle />
            <ContentRow title="Top Rated" items={topRated} showTitle />
            <ContentRow title="Coming Soon" items={upcoming} showTitle />
            <ContentRow
              title="Browse by Genre"
              items={genreItems}
              tabs={Object.keys(genreIds)}
              activeTab={genreTab}
              onTabChange={setGenreTab}
              showTitle
              variant="wide"
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Movies;
