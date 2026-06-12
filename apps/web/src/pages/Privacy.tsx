import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 pt-[120px] pb-20 max-w-4xl">
        <h1 className="font-heading text-4xl font-black mb-8 text-primary uppercase tracking-tighter">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-8 font-body text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">1. Data Collection</h2>
            <p>We collect minimal data necessary for core features. This includes email and username (stored locally) to manage your profile, and local storage data for your watch history and watchlist preferences.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">2. Cookies and Tracking</h2>
            <p>VELORA uses local storage to maintain session state and preferences. We do not use persistent tracking cookies for third-party advertising.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">3. Third-Party Services</h2>
            <p>Our service integrates with TMDB for media metadata. We use local browser storage for authentication and preferences.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">4. Data Security</h2>
            <p>We prioritize your security by using industry-standard encryption provided by our hosting and database partners.</p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-foreground mb-4">5. Your Rights</h2>
             <p>You have the right to request deletion of your account data at any time through our contact channels or account settings.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
