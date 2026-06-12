import { useState, useEffect } from "react";
import { tmdb, type TMDBItem } from "@/lib/tmdb";
import HeroSection from "@/components/HeroSection";
import Top10Carousel from "@/components/Top10Carousel";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { SkeletonRow } from "@/components/Skeletons";
import { useAds } from "@/hooks/use-ads";
import { toast } from "sonner";

const platformFetchers: Record<string, () => Promise<{ results: TMDBItem[] }>> = {
  Netflix: tmdb.netflix,
  Prime: tmdb.prime,
  Max: tmdb.max,
  "Disney+": tmdb.disney,
  AppleTV: tmdb.apple,
  Paramount: tmdb.paramount,
};

const genreIds: Record<string, number> = {
  Comedy: 35, Action: 28, Horror: 27, Romance: 10749, SciFi: 878, Drama: 18, Animation: 16,
};

const Index = () => {
  const [heroItems, setHeroItems] = useState<TMDBItem[]>([]);
  const [top10, setTop10] = useState<TMDBItem[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<TMDBItem[]>([]);
  const [trendingTv, setTrendingTv] = useState<TMDBItem[]>([]);
  const [trendingTab, setTrendingTab] = useState("Movies");
  const [platformTab, setPlatformTab] = useState("Netflix");
  const [platformItems, setPlatformItems] = useState<TMDBItem[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<TMDBItem[]>([]);
  const [topRatedTv, setTopRatedTv] = useState<TMDBItem[]>([]);
  const [topRatedTab, setTopRatedTab] = useState("Movies");
  const [genreTab, setGenreTab] = useState("Comedy");
  const [genreItems, setGenreItems] = useState<TMDBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { adsOn, removeAds } = useAds();

  // Initial data load
  useEffect(() => {
    (async () => {
      try {
        const [trending, popular, trMovies, trTv, topM, topTv] = await Promise.all([
          tmdb.trending(),
          tmdb.popular(),
          tmdb.trendingMovies(),
          tmdb.trendingTv(),
          tmdb.topRated(),
          tmdb.topRatedTv(),
        ]);
        setHeroItems(trending.results.filter(r => r.backdrop_path).slice(0, 8));
        setTop10(popular.results);
        setTrendingMovies(trMovies.results);
        setTrendingTv(trTv.results);
        setTopRatedMovies(topM.results);
        setTopRatedTv(topTv.results);
      } catch (e) {
        console.error("Failed to load TMDB data:", e);
        toast.error("Network error: Failed to connect to Movie Database.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Platform tab
  useEffect(() => {
    (async () => {
      try {
        const data = await platformFetchers[platformTab]();
        setPlatformItems(data.results);
      } catch (e) {
        console.error("Failed to load platform items:", e);
      }
    })();
  }, [platformTab]);

  // Genre tab
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
    <>
      <HeroSection items={heroItems} />

      {adsOn && !loading && (
        <ContentRow
          title="Sponsor Spotlight"
          items={trendingMovies.slice(4, 10)}
          showTitle
          variant="wide"
          action={{
            label: "Upgrade Experience",
            onClick: () => {
              removeAds();
              toast.success("Premium Experience Activated!");
            }
          }}
        />
      )}

      <div className="flex flex-col gap-2 pb-8">
        {loading ? (
          <div className="space-y-20 px-6 sm:px-12 lg:px-20 py-20">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : (
          <>
            <Top10Carousel items={top10} />

            <ContentRow
              title="Neural Trends"
              items={trendingTab === "Movies" ? trendingMovies : trendingTv}
              tabs={["Movies", "Series"]}
              activeTab={trendingTab}
              onTabChange={setTrendingTab}
            />

            <div className="relative py-10">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
              <ContentRow
                title={`${platformTab} Originals`}
                items={platformItems}
                tabs={Object.keys(platformFetchers)}
                activeTab={platformTab}
                onTabChange={setPlatformTab}
                showTitle
                variant="wide"
              />
            </div>

            <ContentRow
              title="The Elite Selection"
              items={topRatedTab === "Movies" ? topRatedMovies : topRatedTv}
              tabs={["Movies", "Series"]}
              activeTab={topRatedTab}
              onTabChange={setTopRatedTab}
              showTitle
            />

            <ContentRow
              title="Genre Explorer"
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
    </>
  );
};

export default Index;
