import { useState, useEffect } from "react";
import { tmdb, type TMDBItem } from "@/lib/tmdb";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { SkeletonRow } from "@/components/Skeletons";

const Anime = () => {
  const [popular, setPopular] = useState<TMDBItem[]>([]);
  const [topRated, setTopRated] = useState<TMDBItem[]>([]);
  const [trending, setTrending] = useState<TMDBItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [pop, top, tr] = await Promise.all([
          tmdb.animePopular(), tmdb.animeTopRated(), tmdb.animeTrending(),
        ]);
        setPopular(pop.results);
        setTopRated(top.results);
        setTrending(tr.results);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <div className="pt-24 sm:pt-32">
        <div className="px-4 pb-4 pt-8 sm:px-6 sm:pt-10 lg:px-12">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Anime</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">Japanese animation at its finest</p>
        </div>

        {loading ? <><SkeletonRow /><SkeletonRow /></> : (
          <>
            <ContentRow title="Popular Anime" items={popular} showTitle />
            <ContentRow title="Top Rated" items={topRated} showTitle />
            <ContentRow title="Recently Aired" items={airing} showTitle />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Anime;
