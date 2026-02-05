// src/components/WeatherWidget.tsx
import { useState, useEffect } from 'react';
import { useWeather } from '../contexts/WeatherContext';

interface WeatherWidgetProps {
  isFloating?: boolean;
}

export default function WeatherWidget({ isFloating = true }: WeatherWidgetProps) {
  const { currentTemp, hourlyTemps, loading, error, fetchWeather } = useWeather();
  const [isExpanded, setIsExpanded] = useState(!isFloating);

  // static 버전일 경우 컴포넌트 마운트 시 데이터를 자동으로 가져옵니다.
  useEffect(() => {
    if (!isFloating && currentTemp === null) {
      fetchWeather();
    }
  }, [isFloating, currentTemp, fetchWeather]);

  const containerClasses = isFloating
    ? `fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'w-80' : 'w-16 h-16'}`
    : `w-full max-w-md mx-auto my-8`;

  const cardClasses = isFloating
    ? "bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
    : "bg-white border border-slate-200 rounded-2xl p-8 shadow-lg relative overflow-hidden";

  if (isFloating && !isExpanded) {
    return (
      <div className={containerClasses}>
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-xl flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all hover:shadow-2xl hover:border-blue-200 group"
        >
          <span className="group-hover:animate-bounce">🌤️</span>
        </button>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        {/* Close button - only for floating mode */}
        {isFloating && (
          <button 
            onClick={() => setIsExpanded(false)}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all shadow-sm"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        <h3 className={`${isFloating ? 'text-lg' : 'text-2xl'} font-bold text-slate-800 mb-4 flex items-center gap-2`}>
          <span className={isFloating ? 'text-2xl' : 'text-3xl'}>🌤️</span> 서울 날씨
        </h3>

        {loading && (
          <div className="py-8 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-blue-600">데이터를 가져오는 중...</p>
          </div>
        )}

        {error && <p className="text-sm text-red-500 bg-red-50 p-4 rounded-lg border border-red-100 mb-4">{error}</p>}

        {!loading && currentTemp !== null && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-8">
              <span className={`${isFloating ? 'text-5xl' : 'text-7xl'} font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600`}>
                {currentTemp}°C
              </span>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seoul, KR</p>
                <p className="text-sm text-slate-500 font-medium">실시간 기온</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">🕛 자정</span>
                <span className="font-bold text-slate-700 text-lg">{hourlyTemps[0]}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">☀️ 점심</span>
                <span className="font-bold text-slate-700 text-lg">{hourlyTemps[12]}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">🌙 저녁</span>
                <span className="font-bold text-slate-700 text-lg">{hourlyTemps[18]}°C</span>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={fetchWeather}
          disabled={loading}
          className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50"
        >
          {currentTemp ? '기상 정보 업데이트' : '날씨 데이터 불러오기'}
        </button>
      </div>
    </div>
  );
}

