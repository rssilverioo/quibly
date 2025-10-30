const ManifestoSection = () => {
  return ( 
    <main className="min-h-screen bg-white dark:bg-background text-black dark:text-white transition-colors duration-300 pt-32 pb-20">
      <article
        aria-labelledby="manifesto-title"
        className="container mx-auto px-6 max-w-4xl"
      >
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1
            id="manifesto-title"
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            We’re not building a tool. We’re rewriting how people learn.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light">
            Because memorizing wasn’t the problem — the process was.
          </p>
        </header>

        {/* Section 1 */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <p>
            PDFs. Slides. Notes.<br />
            We don’t just display them. We transform them.
          </p>
          <p>
            <span className="bg-blue-300 px-1 p-0.5 rounded-sm font-bold">Quibly</span> reads with intention.<br />
            Extracts what matters.<br />
            Turns chaos into clarity.
          </p>
          <p>This isn’t studying. It’s leverage.</p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* Section 2 */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <p>
            “Students should take their own notes.”<br />
            They said the same thing about calculators.
          </p>
          <p>
            Every new technology looks like cheating<br />
            until we realize — it’s evolution.
          </p>
          <p>The best learners aren’t the ones who write the most.<br />They’re the ones who understand first.</p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* Section 3 */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">This changes everything.</h2>
          <p>It’s not about studying more hours.<br />It’s about retaining more in fewer minutes.</p>
          <p>Not about rewriting what exists.<br />But revealing what matters.</p>
          <p>The smartest student isn’t the one who highlights everything —<br />but the one who understands the structure.</p>
          <p>Learning isn’t repetition.<br />It’s clarity.</p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* Final CTA Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Stop rewriting your notes.<br />
            <span className="text-gray-600 dark:text-gray-400">Start understanding them.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            When the overwhelm disappears and everything clicks,<br />
            that’s when learning becomes power.
          </p>
        </section>

        {/* Bottom CTA */}
        <section className="text-center bg-black text-white p-12 rounded-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Try the new standard of learning.
          </h3>
          <p className="text-gray-300 mb-8 text-lg">
            Join the first generation of students who don’t study harder — they study smarter.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
            Try Quibly Free →
          </button>
        </section>
      </article>
    </main>
  );
}
 
export default ManifestoSection;
