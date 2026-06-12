import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdb, img, getTitle, type TMDBItem } from "@/lib/tmdb";
import { ArrowLeft, Star, Calendar, MapPin, Play } from "lucide-react";
import Footer from "@/components/Footer";

interface PersonData {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
  combined_credits?: { cast: TMDBItem[] };
}

const Person = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<PersonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const personJson = await tmdb.person(Number(id));
        setData(personJson as PersonData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black gap-6">
        <div className="relative">
           <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
           <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <p className="font-heading text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Analyzing Neural Profile...</p>
      </div>
    );
  }

  const cast = (data.combined_credits?.cast || [])
    .filter(item => item.poster_path)
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i) // Remove duplicates
    .slice(0, 40);

  return (
    <div className="min-h-screen bg-black">
      {/* Decorative grain */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03] mix-blend-overlay">
         <div className="h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1920px] px-6 pt-32 pb-32 sm:px-12 lg:px-20 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="group mb-12 flex items-center gap-3 font-heading text-[10px] font-black uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Database
        </button>

        <div className="flex flex-col gap-16 lg:flex-row">
          {/* Sidebar Profile Card */}
          <div className="w-full shrink-0 lg:w-80">
            <div className="group relative overflow-hidden rounded-[40px] border border-white/5 bg-white/5 shadow-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_50px_rgba(229,9,20,0.3)]">
              <img src={img(data.profile_path, "h632")} alt={data.name} className="w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            <div className="mt-12 space-y-8 animate-slide-up">
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="font-heading text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Temporal Origin</h3>
                 </div>
                 <p className="font-heading text-sm font-black text-white uppercase tracking-widest">{data.birthday || "Unknown"}</p>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="font-heading text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Neural Location</h3>
                 </div>
                 <p className="font-heading text-sm font-black text-white uppercase tracking-widest leading-relaxed">{data.place_of_birth || "Classified"}</p>
              </div>

               <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 border border-white/5">
                     <div>
                        <p className="font-heading text-[9px] font-black text-white/20 uppercase tracking-widest italic">Identity Verified</p>
                        <p className="font-heading text-xs font-black text-white uppercase tracking-tight italic">Active Profile</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Dossier Content */}
          <div className="flex-1 animate-slide-up [animation-delay:0.2s]">
            <div className="mb-10">
               <div className="mb-4 flex items-center gap-3">
                  <span className="flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">Featured Artist</span>
               </div>
                <h1 className="font-heading text-5xl font-black text-white md:text-7xl lg:text-8xl leading-[0.8] tracking-tighter uppercase italic drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {data.name}
                </h1>
            </div>
            
            {data.biography && (
              <div className="mt-12 space-y-8">
                <div className="flex items-center gap-4">
                   <div className="h-px flex-1 bg-gradient-to-r from-primary to-transparent" />
                   <h2 className="font-heading text-xl font-black text-white uppercase tracking-tight italic">Identity Dossier</h2>
                   <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
                </div>
                <p className="font-body text-base leading-[1.8] text-white/60 selection:bg-primary/30 sm:text-lg lg:text-xl font-medium italic">
                  {data.biography}
                </p>
              </div>
            )}

            <div className="mt-20">
              <div className="mb-12 flex items-center justify-between">
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                     <div className="h-1.5 w-10 rounded-full bg-primary" />
                     <span className="font-heading text-[10px] font-black uppercase tracking-[0.3em] text-primary">Mastery Archive</span>
                   </div>
                   <h2 className="font-heading text-3xl font-black text-white sm:text-4xl uppercase tracking-tighter italic">Known For</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {cast.map(item => (
                  <div
                    key={`${item.id}-${item.media_type}`}
                    className="group cursor-pointer space-y-4"
                    onClick={() => navigate(`/details/${item.media_type || (item.name ? "tv" : "movie")}/${item.id}`)}
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-[24px] bg-white/5 border border-white/5 transition-all duration-500 hover:border-primary group-hover:shadow-[0_0_30px_rgba(229,9,20,0.2)]">
                      <img
                        src={img(item.poster_path)}
                        alt={getTitle(item)}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center">
                         <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                            <Play className="h-4 w-4 text-black fill-current" />
                         </div>
                      </div>
                      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-xl bg-black/80 px-2 py-1 backdrop-blur-xl border border-white/10">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-black text-white">{item.vote_average?.toFixed(1) || "NR"}</span>
                      </div>
                    </div>
                    <div className="px-1">
                       <p className="truncate font-heading text-xs font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                         {getTitle(item)}
                       </p>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Official Entry</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Person;
