import { useState, useEffect } from "react";
import { tmdb, type TMDBItem } from "@/lib/tmdb";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { SkeletonRow } from "@/components/Skeletons";

const platformFetchers: Record<string, () => Promise<{ results: TMDBItem[] }>> = {
  Netflix: tmdb.netflix, Prime: tmdb.prime, Max: tmdb.max,
  "Disney+": tmdb.disney, AppleTV: tmdb.apple, Paramount: tmdb.paramount,
};

const Channels = () => {
  const [activeChannel, setActiveChannel] = useState("Netflix");
  const [items, setItems] = useState<TMDBItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await platformFetchers[activeChannel]();
        setItems(data.results);
      } catch (e) {
        console.error("Failed to load channel items:", e);
      }
      finally { setLoading(false); }
    })();
  }, [activeChannel]);

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-[72px] sm:pt-[84px]">
        <div className="px-4 pb-4 pt-8 sm:px-6 sm:pt-10 lg:px-12">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Channels</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">Browse content from your favorite streaming platforms</p>
        </div>

        <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4 py-4 sm:px-6 lg:px-12">
          {Object.keys(platformFetchers).map(ch => (
            <button
              key={ch}
              onClick={() => { setActiveChannel(ch); setLoading(true); }}
              className={`flex-shrink-0 rounded-xl px-4 py-2.5 font-body text-sm font-semibold transition-all sm:px-6 sm:py-3 ${
                activeChannel === ch
                  ? "bg-primary text-primary-foreground"
                  : "border border-white/5 bg-white/5 text-white/40 hover:border-primary/30"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {loading ? <SkeletonRow /> : (
          <ContentRow title={`${activeChannel} Originals`} items={items} showTitle variant="wide" />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Channels;
