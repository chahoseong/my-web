import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import WeatherWidget from '../components/WeatherWidget';
import { useWeather } from '../contexts/WeatherContext';

export default function WeatherPage() {
  const { currentTemp, aiRecommendation, fetchAiRecommendation } = useWeather();

  // 날씨 데이터(기온)가 들어오면 AI 조언을 요청합니다.
  useEffect(() => {
    if (currentTemp !== null && !aiRecommendation) {
      fetchAiRecommendation(currentTemp);
    }
  }, [currentTemp, aiRecommendation, fetchAiRecommendation]);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
          📊 실시간 <span className="text-blue-600">기상 상황실</span>
        </h2>
        <p className="text-lg text-slate-500 font-medium">
          서울 지역의 주요 기상 데이터를 한눈에 확인하고 분석합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-slate-50 rounded-3xl p-8 border-2 border-dashed border-slate-200">
          {/* 정적 위젯으로 렌더링 */}
          <WeatherWidget isFloating={false} />
        </div>

        {/* AI 코디네이터 섹션 */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-4xl opacity-20 group-hover:opacity-40 transition-opacity">👕</span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">AI</span>
              오늘의 스타일 가이드
            </h3>

            {aiRecommendation ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="text-slate-600 leading-relaxed font-medium prose prose-slate max-w-none">
                  <ReactMarkdown>{aiRecommendation}</ReactMarkdown>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Gemini Smart Advice
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-10 gap-4">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 font-medium italic">스타일리스트가 고민 중입니다...</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
            <h4 className="font-bold mb-2">💡 스타일링 팁</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              기온뿐만 아니라 습도와 바람의 세기에 따라 체감 온도가 다를 수 있으니 가벼운 외투를 챙기시는 것을 권장합니다.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-400 font-mono">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="font-bold text-slate-600 mb-2">📡 DATA SOURCE</p>
          <p>Open-Meteo Global Forecasting API</p>
          <p>Update interval: High-frequency</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="font-bold text-slate-600 mb-2">📍 COORDINATES</p>
          <p>LAT: 37.5 (Seoul)</p>
          <p>LONG: 126.9 (Seoul)</p>
        </div>
      </div>
    </div>
  );
}

