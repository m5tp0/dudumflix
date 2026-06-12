import Footer from "@/components/Footer";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Is VELORA free to use?",
    answer: "Yes, VELORA is free to use. We offer a high-end, ad-free experience for our regular users, but the core features of discovery and playback are available to everyone."
  },
  {
    question: "How do I add movies to my Watchlist?",
    answer: "Simply navigate to the details page of any movie or TV show and click the heart icon. You can access your saved titles later from the 'Watchlist' section in the main menu."
  },
  {
    question: "Can I watch on multiple devices?",
    answer: "Absolutely. VELORA is fully responsive, so you can enjoy the experience on your phone, tablet, and desktop. Your history and watchlist are stored locally in your browser."
  },
  {
    question: "Where is the content hosted?",
    answer: "VELORA does not host any content. We provide a cinematic interface that connects to third-party media providers and uses the TMDB API for all metadata."
  },
  {
    question: "The player isn't working, what should I do?",
    answer: "Most playback issues can be resolved by refreshing the page or checking your internet connection. If a specific title fails to load, try switching providers if options are available."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 pt-[120px] pb-20 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl font-black mb-4 text-primary uppercase tracking-tighter">FAQ</h1>
          <p className="font-body text-muted-foreground">Everything you need to know about VELORA.</p>
        </div>
        
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div 
              key={index} 
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === index ? "border-primary/20 bg-primary/5" : "border-white/5 bg-card hover:bg-card/60"
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-heading font-bold text-lg">{item.question}</span>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="font-body text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
