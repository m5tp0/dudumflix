import Footer from "@/components/Footer";
import { useState } from "react";
import { Mail, MessageSquare, Globe, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 pt-[120px] pb-20 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="font-heading text-5xl font-black mb-6 text-primary uppercase tracking-tighter">Contact Support</h1>
            <p className="font-body text-lg text-muted-foreground mb-12">
              Have a question or feedback? We'd love to hear from you. Fill out the form or reach us through our official channels.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg">Email Us</h3>
                  <p className="font-body text-muted-foreground">contact@velora.sc</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg">Platform Support</h3>
                  <p className="font-body text-muted-foreground">Help center and ticket system</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Enter your name" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-body text-sm focus:border-primary/50 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                <input 
                  required
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-body text-sm focus:border-primary/50 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="How can we help?" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-body text-sm focus:border-primary/50 outline-none transition resize-none"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary py-4 rounded-2xl font-black uppercase tracking-widest text-sm text-primary-foreground flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
