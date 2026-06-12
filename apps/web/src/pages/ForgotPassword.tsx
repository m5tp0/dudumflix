import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail, ArrowLeft, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success("Recovery instructions sent to your email!");
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error("Reset Error:", err);
      let message = "Failed to send reset email.";
      if (err.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-black overflow-y-auto py-12 sm:py-20">
      {/* Cinematic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
         <div className="h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-scale-in">
        <button
          onClick={() => navigate("/auth")}
          className="group mb-8 flex items-center gap-2 font-heading text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Entrance
        </button>

        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
            <img src="/logo.png" alt="Velora Logo" className="relative h-24 w-24 drop-shadow-[0_0_15px_rgba(229,9,20,0.4)] animate-float" />
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-white uppercase italic">RECOVERY</h1>
          <div className="mt-2 flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1 backdrop-blur-md">
             <Sparkles className="h-3 w-3 text-primary" />
             <p className="font-body text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Access Restoration</p>
          </div>
        </div>

        <div className="glass group relative overflow-hidden p-8 transition-all hover:border-white/20">
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2s] ease-in-out" />

          {sent ? (
            <div className="text-center animate-fade-in relative z-10">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_30px_rgba(229,9,20,0.2)]">
                <Send className="h-10 w-10" />
              </div>
              <h2 className="mb-3 font-heading text-xl font-black text-white uppercase tracking-tight">Signal Transmitted</h2>
              <p className="mb-8 font-body text-xs leading-relaxed text-white/40">
                Recovery protocol initiated. Please check <span className="font-black text-white">{email}</span> for the restoration link.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="group relative w-full overflow-hidden rounded-2xl bg-primary py-4 font-heading text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <p className="text-center font-body text-xs leading-relaxed text-white/40 mb-2">
                 Enter your registered coordinates to receive a neural-link for identity verification.
              </p>
              
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-white/20 transition-colors group-focus-within/input:text-primary" />
                <input
                  type="email"
                  placeholder="Neural Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.03] py-4 pl-12 pr-4 font-body text-sm text-white placeholder:text-white/20 transition-all focus:border-primary/50 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-2xl bg-primary py-4 font-heading text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                {loading ? "Transmitting..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
        
        <p className="mt-8 text-center font-body text-[10px] uppercase tracking-[0.3em] text-white/20">
           Velora Cinematic Data Restoration System
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
