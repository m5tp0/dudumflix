import Footer from "@/components/Footer";
import { Film, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 pt-[120px] pb-20 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl font-black mb-6 text-primary uppercase tracking-tighter">About VELORA</h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Redefining the cinematic experience with an immersive, focused, and intuitive streaming interface.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-4">
            <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-2">
              <Film className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold font-heading">Our Mission</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              VELORA was built to eliminate the friction between discovery and viewing. We provide a beautiful, ad-free exploration layer for the world's largest media database.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-4">
            <div className="h-12 w-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500 mb-2">
              <Zap className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold font-heading">The Experience</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              From glassmorphism UI to sub-second load times, every pixel is optimized for high-fidelity performance across all your devices.
            </p>
          </div>
        </div>

        <div className="bg-card/40 rounded-3xl p-10 border border-white/10 text-center space-y-6">
          <h2 className="text-3xl font-bold font-heading">Powered by Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-40">
             <span className="font-black tracking-widest uppercase text-sm">React 18</span>
             <span className="font-black tracking-widest uppercase text-sm">Tailwind CSS</span>
             <span className="font-black tracking-widest uppercase text-sm">Vite</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
