import { History as HistoryIcon, Trash2, ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { img, getTitle } from "@/lib/tmdb";
import Footer from "@/components/Footer";
import { useHistory } from "@/hooks/use-history";

const History = () => {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20">
      <div className="pt-24 sm:pt-32">
        <div className="flex flex-col gap-6 px-6 pt-10 pb-8 sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-20">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <span className="font-heading text-[10px] font-black uppercase tracking-[0.3em] text-primary">Archive</span>
            </div>
            <h1 className="font-heading text-4xl font-black text-white uppercase tracking-tighter italic">History</h1>
            <p className="font-body text-sm text-white/40 italic">Your neural watch log</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-heading text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-primary/20 hover:text-primary transition-all active:scale-95"
            >
              <Trash2 className="h-4 w-4" /> Purge Memory
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 animate-fade-in">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
              <HistoryIcon className="relative h-20 w-20 text-white/10" />
            </div>
            <h3 className="font-heading text-xl font-black text-white uppercase tracking-tight">Memory Bank Empty</h3>
            <p className="mt-4 font-body text-sm text-white/20 italic">Begin your journey to populate the logs</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-10 flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-heading text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" /> Explore Database
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 px-6 py-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:px-12 lg:px-20">
            {history.map(entry => (
              <div
                key={`${entry.item.id}-${entry.watchedAt}`}
                className="group relative cursor-pointer space-y-4 animate-scale-in"
                onClick={() => navigate(`/details/${entry.mediaType}/${entry.item.id}`)}
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.03] transition-all duration-500 hover:border-primary group-hover:shadow-[0_0_30px_rgba(229,9,20,0.2)]">
                  <img
                    src={img(entry.item.poster_path)}
                    alt={getTitle(entry.item)}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                      <Play className="h-5 w-5 text-black fill-current" />
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); removeFromHistory(entry.item.id); }}
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/80 border border-white/10 text-white/40 opacity-0 transition-all group-hover:opacity-100 hover:text-primary hover:scale-110 active:scale-90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="px-1">
                  <p className="truncate font-heading text-sm font-black text-white/80 group-hover:text-primary transition-colors uppercase tracking-tight italic">{getTitle(entry.item)}</p>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{new Date(entry.watchedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default History;
