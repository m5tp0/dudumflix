import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 pt-[120px] pb-20 max-w-4xl">
        <h1 className="font-heading text-4xl font-black mb-8 text-primary uppercase tracking-tighter">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-8 font-body text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using VELORA ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">2. Description of Service</h2>
            <p>VELORA is a streaming platform interface that connects users to content hosted on third-party servers. We do not store any media files on our own servers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">3. User Conduct</h2>
            <p>You agree to use the Service only for lawful purposes. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">4. Intellectual Property</h2>
            <p>All content discovery data is provided via TMDB API. We do not claim ownership of any media linked through our player integrations.</p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-foreground mb-4">5. Disclaimer</h2>
             <p>The Service is provided "as is" without warranty of any kind. VELORA reserves the right to modify or terminate the Service at any time.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
