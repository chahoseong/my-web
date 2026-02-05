import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface WeatherData {
  currentTemp: number | null;
  hourlyTemps: number[];
  loading: boolean;
  error: string | null;
  aiRecommendation: string | null;
  fetchWeather: () => Promise<void>;
  fetchAiRecommendation: (temp: number) => Promise<void>;
}

const WeatherContext = createContext<WeatherData | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [hourlyTemps, setHourlyTemps] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = "https://api.open-meteo.com/v1/forecast?latitude=37.5&longitude=126.9&current_weather=true&hourly=temperature_2m";
      const response = await axios.get(url);
      const data = response.data;

      setCurrentTemp(data.current_weather.temperature);
      setHourlyTemps(data.hourly.temperature_2m);
    } catch (err) {
      setError("날씨 데이터를 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAiRecommendation = useCallback(async (temp: number) => {
    try {
      setAiRecommendation(null);
      const geminiKey = import.meta.env.VITE_GEMINI_KEY;
      if (!geminiKey) {
        setAiRecommendation("API 키가 설정되지 않았습니다.");
        return;
      }

      const genAI = new GoogleGenerativeAI(geminiKey);
      const modelName = import.meta.env.VITE_MODEL || "gemini-2.0-flash";
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `현재 서울 기온이 섭씨 ${temp}도야. 이 날씨에 어울리는 한국의 20대 남성 옷차림을 3줄 이내로 간결하게 추천해줘. 말투는 친근한 스타일리스트처럼 해줘.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setAiRecommendation(text);
    } catch (error) {
      console.error("AI 추천 실패:", error);
      setAiRecommendation("AI 스타일리스트가 잠시 자리를 비웠어요. 😅");
    }
  }, []);

  return (
    <WeatherContext.Provider value={{ 
      currentTemp, 
      hourlyTemps, 
      loading, 
      error, 
      aiRecommendation,
      fetchWeather, 
      fetchAiRecommendation 
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
