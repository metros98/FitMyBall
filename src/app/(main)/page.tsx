import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] bg-surface-base flex items-center">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Left content (60%) */}
            <div className="lg:col-span-3 space-y-6 text-center">
              <img src="/Logo.png" className="w-full h-auto rounded-lg" />
              <h1 className="font-display text-5xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                Find Your Perfect Golf Ball
              </h1>
              <p className="text-lg text-slate-400 max-w-md mx-auto text-center">
                Unbiased recommendations from all major brands, matched to your
                exact swing. No manufacturer bias — just data.
              </p>
              <div className="flex gap-4 pt-2 justify-center">
                    <Link
                  href="/browse"
                  className="inline-flex items-center px-6 py-3 border border-slate-600 text-slate-200 font-medium rounded-button hover:border-slate-400 hover:text-white hover:bg-surface-elevated transition-all duration-150"
                >
                  Browse Balls
                </Link>
                <Link
                  href="/quiz"
                  className="inline-flex items-center px-6 py-3 bg-brand text-white font-medium rounded-button shadow-glow-blue hover:bg-brand-hover transition-all duration-150"
                >
                  Take the Quiz
                </Link>
            
              </div>
            </div>

            {/* Right content (40%) — hero video */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative w-full max-w-md">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover rounded-2xl opacity-90"
                >
                  <source src="/FitMyBallVideo.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-surface-slate py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-semibold text-slate-100 text-2xl md:text-3xl text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Take the Quiz",
                description:
                  "Answer a few quick questions about your game — swing speed, preferred feel, and playing conditions.",
              },
              {
                step: "02",
                title: "Get Matched",
                description:
                  "Our algorithm scores 50+ balls against your profile and ranks them by overall fit.",
              },
              {
                step: "03",
                title: "Compare & Choose",
                description:
                  "See detailed breakdowns, compare top picks side-by-side, and find your perfect ball.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-surface-base border border-[#1E293B] rounded-card p-6 text-center space-y-3"
              >
                <span className="text-accent-cyan text-xs font-semibold uppercase tracking-[0.2em]">
                  Step {item.step}
                </span>
                <h3 className="font-display font-semibold text-slate-100 text-xl">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-surface-base py-20">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="font-display font-semibold text-slate-100 text-2xl md:text-3xl">
            Ready to Find Your Ball?
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            It takes less than 3 minutes. No sign-up required.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center px-8 py-3.5 bg-brand text-white font-medium rounded-button shadow-glow-blue hover:bg-brand-hover transition-all duration-150 text-lg"
          >
            Take the Quiz
          </Link>
        </div>
      </section>
    </div>
  );
}
