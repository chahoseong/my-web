import { useState, useEffect } from 'react';
import pixelHero from '../assets/pixel_hero.png';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const fullText = "과거의 감성과 미래의 기술이 만났습니다.\n8비트 스타일로 재해석된 현대적인 웹 애플리케이션을 경험해보세요.";
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // 타이핑 속도 (ms)

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <div className="relative min-h-[calc(100vh-12rem)] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Pixel Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={pixelHero} 
          alt="Pixel City" 
          className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/80"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-12 flex flex-col items-center justify-center text-center space-y-8 max-w-4xl">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">
            Welcome to the <br />
            <span className="text-blue-400 drop-shadow-[4px_4px_0px_rgba(30,58,138,1)]">Pixel Universe</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 font-bold uppercase tracking-widest bg-slate-900/50 py-2 px-4 backdrop-blur-sm border-x-4 border-blue-500 inline-block">
            Powered by Google Gemini
          </p>
        </div>

        <div className="min-h-[4rem]">
          <p className="max-w-2xl text-lg text-slate-400 font-medium leading-relaxed whitespace-pre-wrap">
            {displayText}
            <span className="inline-block w-2 h-5 ml-1 bg-blue-500 animate-pulse align-middle"></span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-4">
          <Link 
            to="/team"
            className="group relative px-8 py-4 bg-blue-600 border-4 border-blue-400 text-white font-black text-xl uppercase tracking-wider shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(30,58,138,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
          >
            Explore Team
          </Link>
          <button 
            className="px-8 py-4 bg-transparent border-4 border-slate-500 text-slate-300 font-black text-xl uppercase tracking-wider hover:border-white hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(71,85,105,1)]"
          >
            Learn More
          </button>
        </div>
        
        {/* Retro Badge */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 w-full">
          <div className="inline-flex items-center gap-3 text-slate-500 font-mono text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            SYSTEM ONLINE: v4.0-PIXEL-CORE
          </div>
        </div>
      </div>
    </div>
  );
}



