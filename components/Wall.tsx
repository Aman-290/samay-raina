import { wallContent } from "@/lib/content";

export default function Wall() {
  const cardStyles = [
    { font: 'font-caveat', container: 'text-chalk/90 bg-transparent text-4xl hover:scale-105', shadow: '0 0 10px rgba(255,255,255,0.2)' },
    { font: 'font-rock', container: 'text-alarm bg-transparent text-2xl hover:scale-105', shadow: '2px 2px 0px #000' },
    { font: 'font-indie', container: 'text-[#1a1a1a] bg-[#f4f0e6] p-6 border-t-[12px] border-[#e8dcb8] text-2xl hover:scale-110 shadow-[0_20px_40px_rgba(0,0,0,0.8)]' },
    { font: 'font-caveat-brush', container: 'text-alive bg-transparent text-4xl hover:scale-105', shadow: '0 0 10px rgba(0, 255, 0, 0.5)' },
    { font: 'font-special', container: 'text-chalk/90 bg-black/80 backdrop-blur-sm p-6 border border-white/20 text-xl rounded-sm hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.9)]' },
    { font: 'font-vt', container: 'text-gold bg-[#111]/90 p-6 border-l-4 border-gold text-3xl hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.9)]' },
    { font: 'font-shadows', container: 'text-chalk/80 bg-black/60 backdrop-blur-md p-8 border border-white/10 text-3xl rounded-xl hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.9)]' }
  ];

  return (
    <section 
      id="wall" 
      className="relative pt-32 pb-24 bg-[#050505] overflow-hidden min-h-screen"
      style={{
          backgroundImage: "linear-gradient(rgba(5,5,5,0.8), rgba(5,5,5,0.95)), url('/images/wall_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_80%)] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Massive Creative Title */}
        <div className="flex flex-col items-center justify-center mb-40 relative z-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px] h-[300px] bg-alarm/20 blur-[100px] rounded-full mix-blend-screen"></div>
          <h2 className="font-marker text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] text-transparent bg-clip-text bg-gradient-to-br from-alarm via-chalk to-steel leading-none text-center -rotate-2 drop-shadow-[0_10px_20px_rgba(255,61,0,0.4)]">
            THE WALL
          </h2>
          <div className="font-space text-chalk/50 tracking-[0.5em] uppercase text-sm md:text-xl mt-4 bg-black/50 px-8 py-2 border-y border-steel/50">
            EVIDENCE • TRIBUTES • GRAFFITI
          </div>
        </div>

        {/* Scattered Graffiti/Notes */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 relative z-10 w-full mx-auto max-w-[1400px]">
            {wallContent.quotes.map((quote, i) => {
                const rotations = [-6, 9, -12, 4, 15, -4, -8, 7, 2, -14, 10, -5];
                const mt = [0, 80, -40, 120, -80, 40, 60, -20, 100, 10, -60, 30];
                const rotate = rotations[i % 12];
                const marginTop = mt[i % 12];
                
                const styleObj = cardStyles[i % cardStyles.length];
                const isPostIt = styleObj.font === 'font-indie';
                const isWarning = i % 8 === 0;

                return (
                <div
                    key={i}
                    className={`w-full sm:w-[320px] md:w-[400px] transition-all duration-500 relative group cursor-crosshair drop-shadow-2xl ${styleObj.container}`}
                    style={{ 
                        transform: `rotate(${rotate}deg)`,
                        marginTop: `${marginTop}px`,
                        textShadow: styleObj.shadow
                    }}
                >
                    {/* Tape/Pin decoration based on style */}
                    {isPostIt && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 opacity-20 rotate-12">
                            <svg viewBox="0 0 100 100"><path fill="#000" d="M10,0 L90,10 L80,30 L20,20 Z" /></svg>
                        </div>
                    )}
                    {!isPostIt && !styleObj.container.includes('bg-black') && (
                        <div className="absolute top-2 left-2 text-chalk/10 font-space text-[10px] pointer-events-none">#{(i+1).toString().padStart(3, '0')}</div>
                    )}

                    {isWarning && <div className="absolute -top-6 -right-6 w-24 h-8 bg-alarm/80 backdrop-blur-sm rotate-12 flex items-center justify-center font-space text-[10px] text-black font-black tracking-widest shadow-xl">EVIDENCE</div>}

                    <p className={`${styleObj.font} leading-tight relative z-10`}>
                    "{quote.text}"
                    </p>
                    <p className={`font-space text-[10px] md:text-xs mt-6 tracking-widest uppercase font-bold text-right ${isPostIt ? 'text-black/60' : 'text-dim'}`}>
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
