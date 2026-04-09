import { wallContent } from "@/lib/content";

export default function Wall() {
  return (
    <section 
      id="wall" 
      className="relative pt-32 pb-24 bg-[#050505] overflow-hidden min-h-screen"
    >
      {/* Grungy Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-screen"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_80%)] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="flex justify-center mb-32 relative">
          <div className="bg-[#121212] border border-steel/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative transform -rotate-2">
            {/* Fake Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-zinc-700/40 backdrop-blur-sm -rotate-3 z-20 shadow-sm"></div>
            <h2 className="font-space text-chalk/80 text-sm md:text-base tracking-[0.4em] font-bold uppercase px-16 py-6">
              {wallContent.sectionLabel}
            </h2>
          </div>
        </div>

        {/* Scattered Cards */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 py-12 md:py-32 relative z-10 w-full mx-auto max-w-[1400px]">
            {wallContent.quotes.map((quote, i) => {
                const rotations = [-8, 12, -15, 6, 18, -4, -12, 9, 2, -18, 14, -7];
                const mt = [0, 80, -40, 120, -80, 40, 60, -20, 100, 10, -60, 30];
                const ml = [0, -30, 40, -10, 50, -20, 30, -40, 20, -50, 60, -30];
                const rotate = rotations[i % 12];
                const marginTop = mt[i % 12];
                const marginLeft = ml[i % 12];
                const isWarning = i % 4 === 0;

                return (
                <div
                    key={i}
                    className={`w-full sm:w-[340px] md:w-[420px] bg-[#101010] border ${isWarning ? 'border-alarm/40' : 'border-[#222]'} rounded-sm p-8 shadow-2xl transition-all duration-500 hover:scale-105 hover:z-50 relative group cursor-crosshair`}
                    style={{ 
                    transform: `rotate(${rotate}deg)`,
                    marginTop: `${marginTop}px`,
                    marginLeft: `${marginLeft}px`
                    }}
                >
                    {/* Pin/Tape */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-steel shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-[#111] absolute top-1 left-1"></div>
                    </div>
                    {isWarning && <div className="absolute -top-8 -right-8 w-24 h-8 bg-alarm/20 backdrop-blur-sm rotate-45 transform origin-bottom-left flex items-center justify-center font-space text-[8px] text-alarm font-bold tracking-widest">EVIDENCE</div>}

                    <div className="absolute top-0 left-0 text-[80px] font-playfair text-[#222] -translate-x-4 -translate-y-6 leading-none selection:bg-transparent">"</div>
                    <p className={`font-playfair italic ${i % 2 === 0 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} ${isWarning ? 'text-chalk' : 'text-[#bbb]'} leading-relaxed relative z-10 drop-shadow-md`}>
                    {quote.text}
                    </p>
                    <p className="font-space text-[10px] text-dim mt-8 tracking-widest uppercase font-bold text-right border-t border-[#222] pt-4">
                    FILE // {quote.author}
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
