import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Search, ArrowLeft, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: Access restricted at:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden text-center">
      {/* Cinematic background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.15)_0%,transparent_70%)] animate-pulse" />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
         <div className="h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-scale-in">
        <div className="mb-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
               <Search className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="font-heading text-7xl font-black tracking-tighter text-white uppercase italic drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
             404
          </h1>
          <div className="mt-2 flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 backdrop-blur-md">
             <Sparkles className="h-3 w-3 text-primary" />
             <p className="font-body text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Signal Lost</p>
          </div>
        </div>

        <div className="glass p-8 mb-8">
           <h2 className="mb-4 font-heading text-xl font-black text-white uppercase tracking-tight">Coordinates Not Found</h2>
           <p className="mb-8 font-body text-xs leading-relaxed text-white/40">
              The page <span className="font-black text-white">{location.pathname}</span> has been archived or drifted into another dimension. 
              Recalibrate your search and return to the main hub.
           </p>
           <button 
             onClick={() => navigate("/home")}
             className="group relative w-full overflow-hidden rounded-2xl bg-primary py-4 font-heading text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
             <span className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Hub
             </span>
           </button>
        </div>
        
        <p className="font-body text-[8px] uppercase tracking-[0.8em] text-white/10">
           Velora Cinematic Coordinate Tracker v4.0.4
        </p>
      </div>
    </div>
  );
};

export default NotFound;
