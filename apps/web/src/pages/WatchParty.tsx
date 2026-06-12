import { useState } from "react";
import { Users, Copy, Check, Plus, LogIn } from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const WatchParty = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [roomCode] = useState(() => "VELORA-" + Math.random().toString(36).substring(2, 8).toUpperCase());

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast.success("Room code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateRoom = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Room ${roomCode} created successfully! Waiting for friends...`);
    }, 1500);
  };

  const handleJoinRoom = () => {
    if (!joinCode.trim()) {
      toast.error("Please enter a valid room code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (joinCode.toUpperCase().startsWith("VELORA-")) {
        toast.success(`Successfully joined room ${joinCode.toUpperCase()}!`);
      } else {
        toast.error("Invalid room code. Please try again.");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center pt-[96px]">
        <div className="mx-auto w-full max-w-lg px-6 text-center animate-fade-in">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
          <h1 className="mb-3 font-heading text-4xl font-bold text-foreground">Watch Party</h1>
          <p className="mb-10 font-body text-sm text-muted-foreground/60 leading-relaxed">
            Experience movies and series together with friends in real-time, no matter the distance.
          </p>

          <div className="mb-6 rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-left font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">Host a Party</h3>
            <div className="mb-4 flex items-center justify-between rounded-xl border border-white/5 bg-background/50 px-4 py-3.5">
              <span className="font-body text-sm font-bold text-foreground tracking-widest">{roomCode}</span>
              <button 
                onClick={copyCode} 
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 text-muted-foreground hover:text-primary transition-all active:scale-90"
                title="Copy Code"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <button 
              onClick={handleCreateRoom}
              disabled={loading}
              className="group w-full rounded-xl bg-primary py-4 font-body text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <Plus className="mr-2 inline h-4 w-4 group-hover:rotate-90 transition-transform" />
              {loading ? "Creating Room..." : "Create New Room"}
            </button>
          </div>

          <div className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-left font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">Join Friend's Party</h3>
            <div className="relative mb-4">
              <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input
                placeholder="Enter VELORA-XXXXXX code..."
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                className="w-full rounded-xl border border-white/5 bg-background/50 py-4 pl-12 pr-4 font-body text-sm text-foreground placeholder:text-white/20 outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <button 
              onClick={handleJoinRoom}
              disabled={loading || !joinCode}
              className="w-full rounded-xl border-2 border-primary/20 py-4 font-body text-sm font-bold text-primary transition-all hover:bg-primary/5 hover:border-primary/40 active:scale-95 disabled:opacity-30"
            >
              {loading ? "Joining..." : "Join Active Room"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WatchParty;

