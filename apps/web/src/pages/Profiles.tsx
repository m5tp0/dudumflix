import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Plus, Sparkles, LogOut, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Profiles = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);

  const loadProfiles = useCallback(async (user: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      let profileData;
      if (docSnap.exists()) {
        const data = docSnap.data();
        profileData = {
          ...data,
          avatar_url: data.avatar_url || user.photoURL || "/avatars/avatar_girl_cute.png"
        };
      } else {
        // Create initial document if missing
        profileData = {
          uid: user.uid,
          username: user.displayName || user.email?.split('@')[0] || "User",
          avatar_url: user.photoURL || "/avatars/avatar_girl_cute.png",
          email: user.email,
          watchlist: [],
          history: [],
          created_at: new Date().toISOString(),
        };
        await setDoc(docRef, profileData);
      }
      
      setProfiles([profileData]);
    } catch (e) {
      console.error("Error loading profiles:", e);
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadProfiles(user);
      } else {
        navigate("/auth");
      }
    });
    return () => unsubscribe();
  }, [loadProfiles, navigate]);

  const handleSelectProfile = (profile: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    localStorage.setItem("velora_active_profile", JSON.stringify(profile));
    navigate("/home");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("velora_active_profile");
      navigate("/auth");
    } catch (e) {
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="relative">
           <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
           <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-black p-6 overflow-y-auto py-8 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(229,9,20,0.1)_0%,transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
         <div className="h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl animate-scale-in">
        <div className="mb-8 flex flex-col items-center">
           <div className="mb-4 flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 backdrop-blur-md">
              <Sparkles className="h-2.5 w-2.5 text-primary" />
              <span className="font-body text-[8px] font-black uppercase tracking-[0.4em] text-white/40">Cinematic Entry</span>
           </div>
           <h1 className="font-heading text-xl font-black tracking-tighter text-white uppercase italic drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] md:text-3xl">
              Who's watching?
           </h1>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12">
          {profiles.map((p) => (
            <div
              key={p.uid || p.id}
              className="group flex cursor-pointer flex-col items-center gap-3 transition-all"
              onClick={() => handleSelectProfile(p)}
            >
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[20px] border-2 border-white/5 bg-white/5 transition-all duration-500 ease-out group-hover:scale-105 group-hover:border-primary group-hover:shadow-[0_0_40px_rgba(229,9,20,0.3)] sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
                {p.avatar_url ? (
                  <img 
                    src={p.avatar_url} 
                    alt={p.username} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/avatars/avatar_girl_cute.png";
                    }}
                  />
                ) : (
                  <UserIcon className="h-10 w-10 text-white/20 group-hover:text-primary transition-colors sm:h-12 sm:w-12 lg:h-16 lg:w-16" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-end justify-center pb-4">
                   <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                      <ChevronRight className="h-4 w-4 text-black" />
                   </div>
                </div>
              </div>
              <span className="font-heading text-[9px] font-black uppercase tracking-widest text-white/40 transition-all group-hover:text-primary group-hover:translate-y-[-2px] sm:text-[10px] lg:text-xs">
                {p.username}
              </span>
            </div>
          ))}

          <div 
            className="group flex cursor-pointer flex-col items-center gap-3"
            onClick={() => navigate("/auth", { state: { signup: true } })}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-[20px] border-2 border-dashed border-white/10 bg-white/[0.02] transition-all duration-500 group-hover:scale-105 group-hover:border-primary group-hover:bg-primary/5 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
              <Plus className="h-8 w-8 text-white/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-90 group-hover:text-primary sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
            </div>
            <span className="font-heading text-[9px] font-black uppercase tracking-widest text-white/20 transition-colors group-hover:text-white sm:text-[10px] lg:text-xs">
              Add Profile
            </span>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 md:mt-16">
           <button
            onClick={() => navigate("/profile")}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-8 py-2 font-heading text-[9px] font-black uppercase tracking-[0.3em] text-white/40 transition-all hover:border-white hover:text-white active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            Manage Profiles
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-heading text-[8px] font-black uppercase tracking-[0.3em] text-white/20 transition-colors hover:text-primary"
          >
            <LogOut className="h-3 w-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
