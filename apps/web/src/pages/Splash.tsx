import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Sparkles } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    // Simulate a cinematic loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const checkSession = () => {
      const fallbackTimeout = setTimeout(() => {
        navigate("/auth");
      }, 8000);

      const startTime = Date.now();
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        const endTime = Date.now();
        const elapsed = endTime - startTime;
        const waitTime = Math.max(0, 3500 - elapsed); // Slightly longer for more "wow"

        setTimeout(() => {
          clearTimeout(fallbackTimeout);
          unsubscribe();
          if (user) {
            navigate("/profiles");
          } else {
            navigate("/auth");
          }
        }, waitTime);
      });
    };

    checkSession();
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden text-center">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.15)_0%,transparent_70%)] animate-pulse" />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
         <div className="h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute -top-[10%] -left-[10%] h-96 w-96 rounded-full bg-primary/10 blur-[100px] animate-float" />
      <div className="absolute -bottom-[10%] -right-[10%] h-96 w-96 rounded-full bg-primary/10 blur-[100px] animate-float [animation-delay:2s]" />
      
      <div className={`relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-xl'}`}>
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150 animate-pulse transition-transform duration-1000 group-hover:scale-[2]" />
          <img 
            src="/logo.png" 
            alt="Velora Logo" 
            className="relative mx-auto h-36 w-36 drop-shadow-[0_0_50px_rgba(229,9,20,0.6)] animate-float"
          />
          {/* Ripple effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary/20 animate-ping opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-primary/10 animate-ping opacity-10 [animation-delay:0.5s]" />
        </div>
        
        <div className="space-y-4">
           <h1 className="font-heading text-6xl font-black tracking-[0.3em] text-white drop-shadow-[0_0_20px_rgba(229,9,20,0.4)] italic">
              VELORA
           </h1>
           <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary" />
              <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 backdrop-blur-md">
                 <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                 <span className="font-body text-[10px] font-black uppercase tracking-[0.5em] text-white/50">
                    Streaming Redefined
                 </span>
              </div>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary" />
           </div>
        </div>
      </div>

      {/* Loading Architecture */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 space-y-4">
        <div className="flex justify-between items-center px-1">
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Establishing Secure Stream</span>
           <span className="text-[9px] font-black text-primary">{progress}%</span>
        </div>
        <div className="h-[2px] w-full bg-white/5 overflow-hidden rounded-full backdrop-blur-sm border border-white/[0.02]">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_15px_rgba(229,9,20,0.8)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 right-0">
         <p className="text-[8px] font-black uppercase tracking-[0.8em] text-white/10">
            Powered by Velora Cinematic Engine
         </p>
      </div>
    </div>
  );
};

export default Splash;
