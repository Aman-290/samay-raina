import { wallContent } from "@/lib/content";

export default function Wall() {
  const handwritingFonts = [
    "font-caveat", 
    "font-marker", 
    "font-indie", 
    "font-kalam", 
    "font-amatic", 
    "font-shadows"
  ];

  return (
    <section 
      id="wall" 
      className="relative pt-32 pb-24 bg-[#050505] overflow-hidden min-h-screen"
      style={{
          backgroundImage: "linear-gradient(rgba(5,5,5,0.7), rgba(5,5,5,0.9)), url('/images/wall_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_80%)] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="flex justify-center mb-32 relative">
          <div className="bg-[#121212]/50 backdrop-blur-md border border-steel/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative transform -rotate-2">
            {/* Fake Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-zinc-400/20 backdrop-blur-sm -rotate-3 z-20 shadow-sm"></div>
            <h2 className="font-space text-chalk/80 text-sm md:text-base tracking-[0.4em] font-bold uppercase px-16 py-6">
              {wallContent.sectionLabel}
            </h2>
          </div>
        </div>

        {/* Scattered Graffiti/Notes */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 py-12 md:py-32 relative z-10 w-full mx-auto max-w-[1400px]">
            {wallContent.quotes.map((quote, i) => {
                const rotations = [-8, 12, -15, 6, 18, -4, -12, 9, 2, -18, 14, -7];
                const mt = [0, 80, -40, 120, -80, 40, 60, -20, 100, 10, -60, 30];
                const rotate = rotations[i % 12];
                const marginTop = mt[i % 12];
                const fontClass = handwritingFonts[i % handwritingFonts.length];
                const isWarning = i % 4 === 0;

                return (
                <div
                    key={i}
                    className={`w-full sm:w-[320px] md:w-[400px] ${isWarning ? 'bg-alarm/10 backdrop-blur-sm border border-alarm/20 text-alarm' : 'bg-transparent text-[#e8e4df]'} p-6 transition-all duration-500 hover:scale-105 hover:z-50 relative group cursor-crosshair drop-shadow-xl`}
                    style={{ 
                    transform: `rotate(${rotate}deg)`,
                    marginTop: `${marginTop}px`
                    }}
                >
                    {isWarning && <div className="absolute -top-8 -right-8 w-24 h-8 bg-alarm/20 backdrop-blur-sm rotate-45 transform origin-bottom-left flex items-center justify-center font-space text-[8px] text-alarm font-bold tracking-widest pointer-events-none">EVIDENCE</div>}

                    <p className={`${fontClass} leading-tight text-3xl md:text-4xl relative z-10`} style={{ textShadow: isWarning ? '0 0 10px rgba(255, 61, 0, 0.5)' : '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    "{quote.text}"
                    </p>
                    <p className="font-space text-[10px] text-dim/60 mt-6 tracking-widest uppercase font-bold text-right">
                    — {quote.author}
                    </p>
                </div>
                );
            })}
        </div>

        {/* Footer Sequence */}
        <div className="mt-[200px] flex flex-col items-center justify-center relative z-20 w-full overflow-hidden">
          <p className="font-playfair text-3xl sm:text-5xl md:text-6xl lg:text-[80px] text-alarm font-bold text-center leading-[1.15] px-4 italic mb-12 drop-shadow-[0_0_20px_rgba(255,61,0,0.3)] filter contrast-125 saturate-150 break-words w-full max-w-[1200px]">
            {wallContent.tribute}
          </p>

          <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-alarm/50 to-transparent my-16" />

          <p className="font-space text-dim text-xs md:text-sm tracking-[0.3em] uppercase text-center font-bold">
            {wallContent.credit}
          </p>
          <button className="font-space font-bold bg-alarm text-yard px-8 py-4 text-[10px] md:text-xs tracking-[0.4em] uppercase text-center mt-12 hover:bg-chalk transition-all duration-300 shadow-[0_0_20px_rgba(255,61,0,0.3)]">
            {wallContent.nextEpisodeCta}
          </button>
        </div>
        
      </div>
    </section>
  );
}
