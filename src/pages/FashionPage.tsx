import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface FashionRecommendation {
  top: string;
  bottom: string;
  shoes: string;
  accessory: string;
  comment?: string;
}

export default function FashionPage() {
  const [members, setMembers] = useState<string[]>([]);
  const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null);
  const [selectedMemberAvatar, setSelectedMemberAvatar] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<FashionRecommendation | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // 1. 컴포넌트 마운트 시 전체 멤버 리스트 가져오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/members');
        const memberList = response.data;
        setMembers(memberList);
        if (memberList && memberList.length > 0) {
          setSelectedMemberName(memberList[0]);
        }
      } catch (error) {
        console.error('Error fetching member list:', error);
      }
    };
    fetchMembers();
  }, []);

  // 2. 선택된 멤버 정보 기반 AI 추천 요청
  useEffect(() => {
    if (selectedMemberName) {
      const getAiRecommendation = async () => {
        try {
          setIsLoadingAi(true);
          setRecommendation(null);
          
          // 멤버 상세 정보 가져오기
          const response = await axios.get(`http://127.0.0.1:8000/members/${selectedMemberName}`);
          const { location, style, gender, avatar } = response.data;
          
          if (avatar) {
            setSelectedMemberAvatar(`http://127.0.0.1:8000${avatar}`);
          } else {
            setSelectedMemberAvatar(null);
          }

          console.log('Member Details:', response.data);

          const geminiKey = import.meta.env.VITE_GEMINI_KEY;
          if (!geminiKey) {
            console.error('Gemini API key is missing.');
            return;
          }

          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({ model: import.meta.env.VITE_MODEL || "gemini-2.5-flash-lite" });

          const prompt = `
            사용자 정보:
            - 거주지: ${location}
            - 선호 스타일: ${style}
            - 성별: ${gender}

            위 정보를 바탕으로 오늘 입기 좋은 패션 아이템 4가지를 추천해줘.
            반드시 아래의 JSON 형식으로만 응답해줘. 다른 설명은 생략해.
            JSON 예시:
            {
              "top": "상의 아이템 이름",
              "bottom": "하의 아이템 이름",
              "shoes": "신발 이름",
              "accessory": "액세서리 이름",
              "comment": "한 줄 스타일링 팁"
            }
          `;

          const result = await model.generateContent(prompt);
          const text = result.response.text();
          const cleanJson = text.replace(/```json|```/g, '').trim();
          const parsedRecommendation = JSON.parse(cleanJson);
          
          setRecommendation(parsedRecommendation);
        } catch (error) {
          console.error('Error getting AI recommendation:', error);
        } finally {
          setIsLoadingAi(false);
        }
      };

      getAiRecommendation();
    }
  }, [selectedMemberName]);

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[inherit] bg-slate-50">
      {/* 왼쪽: SelectBox 영역 */}
      <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-slate-200 bg-white">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">팀원 선택</h2>
        <div className="space-y-4">
          <label htmlFor="member-select" className="block text-sm font-medium text-slate-600">
            패션 가이드를 확인할 팀원을 선택하세요
          </label>
          <select
            id="member-select"
            value={selectedMemberName || ''}
            onChange={(e) => setSelectedMemberName(e.target.value)}
            className="w-full p-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer text-slate-700 font-medium"
          >
            {members.map((name, index) => (
              <option key={`${name}-${index}`} value={name}>
                {name}
              </option>
            ))}
          </select>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700 leading-relaxed">
              선택된 팀원 <strong>{selectedMemberName || '정보 없음'}</strong>님에게 어울리는 추천 패션 스타일이 오른쪽에 표시됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 오른쪽: 결과 화면 영역 */}
      <div className="w-full md:w-2/3 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white min-h-[400px]">
        {selectedMemberName ? (
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-500">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-slate-100 flex items-center justify-center">
                  {selectedMemberAvatar ? (
                    <img 
                      src={selectedMemberAvatar} 
                      alt={selectedMemberName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-slate-400">👤</span>
                  )}
                </div>
                <div className="absolute -bottom-2 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                  Fashion Pick
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{selectedMemberName}</h3>
              <p className="text-blue-600 font-semibold mb-6">오늘의 추천 룩</p>
              
              <div className="w-full h-px bg-slate-100 mb-6"></div>
              
              <div className="text-left w-full space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    AI 스타일리스트 추천
                  </h4>
                  {isLoadingAi && (
                    <span className="text-xs text-blue-500 animate-pulse font-medium">분석 중...</span>
                  )}
                </div>

                {recommendation ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Top</p>
                        <p className="text-sm font-medium text-slate-700">{recommendation.top}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Bottom</p>
                        <p className="text-sm font-medium text-slate-700">{recommendation.bottom}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Shoes</p>
                        <p className="text-sm font-medium text-slate-700">{recommendation.shoes}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Accessory</p>
                        <p className="text-sm font-medium text-slate-700">{recommendation.accessory}</p>
                      </div>
                    </div>
                    {recommendation.comment && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-600 text-center">
                        "{recommendation.comment}"
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">최고의 스타일을 찾는 중입니다...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-slate-400 font-medium italic">팀원을 선택하여 고유한 패션 스타일을 확인해보세요!</div>
        )}
      </div>
    </div>
  );
}

