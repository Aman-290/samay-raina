import { wallContent } from "@/lib/content";

export default function Wall() {
  return (
    <section 
      id="wall" 
      className="relative pt-24 pb-16 bg-gradient-to-b from-[#0c4021] via-[#0a0a0a] to-[#000000] overflow-x-hidden min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="flex justify-center mb-24 relative z-10">
          <div className="bg-[#1c1c1e] border border-[#2a2a2c] shadow-lg">
            <h2 className="font-space text-[#e8e4df] text-xs md:text-sm tracking-[0.4em] uppercase px-12 py-4">
              {wallContent.sectionLabel}
            </h2>
          </div>
        </div>

        {/* Scattered Cards */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-14">
          {wallContent.quotes.map((quote, i) => {
            // Deterministic scatter for a messy pinned-board look
            const rotations = [-3, 4, -5, 2, 5, -2, -4, 3, 0, -3, 4, -1];
            const mt = [0, 40, -20, 60, -40, 20, 30, -10, 50, 0, -30, 10];
            const rotate = rotations[i % 12];
            const marginTop = mt[i % 12];

            return (
              <div
                key={i}
                className="w-full sm:w-[320px] md:w-[380px] bg-[#141416] border border-[#2a2a2e] rounded-sm p-6 md:p-8 shadow-2xl transition-transform duration-300 hover:scale-105 hover:z-20 relative"
                style={{ 
                  transform: `rotate(${rotate}deg)`,
                  marginTop: `${marginTop}px`
                }}
              >
                <p className="font-caveat text-xl md:text-2xl text-[#e8e4df] leading-relaxed tracking-wide">
                  &quot;{quote.text}&quot;
                </p>
                <p className="font-space text-[10px] text-[#6b6b6f] mt-8">
                  — {quote.author}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Sequence */}
        <div className="mt-56 flex flex-col items-center justify-center relative z-10">
          <p className="font-caveat text-[1.75rem] md:text-4xl text-[#ff3d00] text-center max-w-3xl leading-snug px-4">
            {wallContent.tribute}
          </p>

          <div className="w-12 h-[1px] bg-[#3a3a3c] my-12" />

          <p className="font-dm text-[#6b6b6f] text-sm tracking-wide text-center">
            {wallContent.credit}
          </p>
          <p className="font-space text-[#444] text-[10px] md:text-xs tracking-widest uppercase text-center mt-4 cursor-pointer hover:text-[#888] transition-colors">
            {wallContent.nextEpisodeCta}
          </p>
        </div>
        
      </div>
    </section>
  );
}
