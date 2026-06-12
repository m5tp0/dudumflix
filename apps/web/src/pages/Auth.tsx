import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "@/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";
import { toast } from "sonner";

const AVATARS = [
  "/avatars/avatar_girl_cute.png",
  "/avatars/avatar_boy_cute.png",
];

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.signup ? false : true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }
      if (!/\d/.test(password)) {
        toast.error("Password must contain at least one digit.");
        return;
      }
      if (!/[A-Z]/.test(password)) {
        toast.error("Password must contain at least one capital letter.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Auto-select profile
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          localStorage.setItem("velora_active_profile", JSON.stringify(docSnap.data()));
        }

        toast.success("Welcome back to Velora!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile in Auth
        await updateProfile(user, {
          displayName: username,
          photoURL: selectedAvatar,
        });

        const profileData = {
          uid: user.uid,
          username: username,
          avatar_url: selectedAvatar,
          email: email,
          watchlist: [],
          favorites: [],
          history: [],
          created_at: new Date().toISOString(),
        };

        // Save profile in Firestore
        await setDoc(doc(db, "users", user.uid), profileData);
        
        // Auto-select profile
        localStorage.setItem("velora_active_profile", JSON.stringify(profileData));

        toast.success("Welcome to the cinematic experience!");
      }
      navigate("/home");
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error("Auth Error:", err);
      let message = "Authentication failed. Please try again.";
      
      if (err.code === "auth/invalid-credential") {
        message = "Invalid email or password. If you haven't created an account yet, please Sign Up first.";
      } else if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered. Try signing in instead.";
      } else if (err.code === "auth/weak-password") {
        message = "Password is too weak. Please use at least 6 characters.";
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-black to-background z-0" />
        
        {/* Moving glowing orbs */}
        <div className="absolute top-0 left-[20%] h-[50vh] w-[50vw] rounded-full bg-primary/10 blur-[120px] mix-blend-screen animate-float [animation-duration:15s]" />
        <div className="absolute bottom-0 right-[20%] h-[60vh] w-[60vw] rounded-full bg-primary/5 blur-[150px] mix-blend-screen animate-pulse [animation-duration:10s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40vh] w-[40vw] rounded-full bg-primary/5 blur-[100px] mix-blend-screen animate-float [animation-duration:20s] [animation-delay:2s]" />
        
        {/* Grid lines for a cool cinematic UI effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

        <div className="absolute inset-0 z-10 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10 w-full max-w-[360px] px-5 animate-scale-in">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-primary/20 blur-[20px] animate-pulse" />
            <img src="/logo.png" alt="Velora Logo" className="relative h-14 w-14 drop-shadow-[0_0_15px_rgba(229,9,20,0.6)] animate-float" />
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter uppercase italic text-gradient-hero mb-2">
             VELORA
          </h1>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md shadow-lg shadow-black/50">
             <Sparkles className="h-2.5 w-2.5 text-primary" />
             <p className="font-body text-[8px] font-bold uppercase tracking-[0.2em] text-white/70">
                {isLogin ? "Cinematic Entrance" : "Join the Movement"}
             </p>
          </div>
        </div>

        <div className="relative glass-sm p-6 shadow-2xl shadow-black/80 rounded-3xl">
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            {!isLogin && (
              <div className="animate-slide-up">
                <div className="flex justify-center gap-3">
                  {AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setSelectedAvatar(av)}
                      className={`h-10 w-10 overflow-hidden rounded-xl border-2 transition-all duration-300 ${selectedAvatar === av
                        ? "border-primary scale-110 shadow-[0_0_15px_rgba(229,9,20,0.5)]"
                        : "border-white/10 opacity-40 hover:opacity-100 hover:border-white/30"
                        }`}
                    >
                      <img src={av} alt="avatar" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-1">
              {!isLogin && (
                <div className="relative group/input animate-slide-up [animation-delay:0.1s]">
                  <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30 transition-colors group-focus-within/input:text-primary" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-2.5 pl-9 pr-3 font-body text-xs text-white placeholder:text-white/30 transition-all focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              )}

              <div className="relative group/input animate-slide-up [animation-delay:0.2s]">
                <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30 transition-colors group-focus-within/input:text-primary" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-2.5 pl-9 pr-3 font-body text-xs text-white placeholder:text-white/30 transition-all focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div className="relative group/input animate-slide-up [animation-delay:0.3s]">
                <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30 transition-colors group-focus-within/input:text-primary" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-2.5 pl-9 pr-9 font-body text-xs text-white placeholder:text-white/30 transition-all focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative group/input animate-slide-up [animation-delay:0.4s]">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30 transition-colors group-focus-within/input:text-primary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-2.5 pl-9 pr-9 font-body text-xs text-white placeholder:text-white/30 transition-all focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group hover-glow relative mt-4 w-full overflow-hidden rounded-xl bg-primary py-3 font-heading text-xs font-black uppercase tracking-widest text-white transition-all disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />
              {loading ? "Decrypting..." : isLogin ? "Enter Velora" : "Begin Journey"}
            </button>
          </form>

          <div className="mt-5 text-center animate-fade-in [animation-delay:0.5s]">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="group inline-flex items-center gap-1.5 font-body text-[10px] font-medium text-white/50 transition-colors hover:text-white"
            >
              <span>{isLogin ? "New to the platform?" : "Already a member?"}</span>
              <span className="font-black text-primary transition-all group-hover:translate-x-1">{isLogin ? "Sign Up" : "Sign In"}</span>
            </button>
          </div>
        </div>
        
        <p className="mt-6 text-center font-body text-[8px] uppercase tracking-[0.3em] text-white/30 animate-fade-in [animation-delay:0.7s]">
           Protected by Velora Cinematic Encryption
        </p>
      </div>
    </div>
  );
};

export default Auth;
