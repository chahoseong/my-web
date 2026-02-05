import { useState, useEffect } from 'react';
import axios from 'axios';
import TeamMemberCard from '../components/TeamMemberCard';

// 서버에서 제공하는 멤버 정보 인터페이스
interface Member {
  id: number;
  name: string;
  gender: string;
  role: string;
  description: string;
  avatar: string; // 이미지 URL 또는 경로
  style: string;
  location: string;
  isOnline?: boolean; // 선택적 (기존 호환성 유지)
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        // 1. 멤버 이름 목록 가져오기
        const listResponse = await axios.get('http://127.0.0.1:8000/members');
        const names: string[] = listResponse.data;

        // 2. 각 멤버의 상세 정보 가져오기 (병렬 처리)
        const detailPromises = names.map(name => 
          axios.get(`http://127.0.0.1:8000/members/${name}`)
        );
        
        const detailResponses = await Promise.all(detailPromises);
        const detailedMembers = detailResponses.map(res => ({
          ...res.data,
          // 실시간성을 위해 무작위로 온라인 상태 부여 (기존 코드의 느낌 유지)
          isOnline: Math.random() > 0.3
        }));

        setMembers(detailedMembers);
      } catch (error) {
        console.error('팀 정보를 불러오는 데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  // 시뮬레이션: 3초마다 무작위 한 명의 접속 상태를 변경합니다.
  useEffect(() => {
    if (members.length === 0) return;

    const interval = setInterval(() => {
      setMembers(prevMembers => {
        const randomIndex = Math.floor(Math.random() * prevMembers.length);
        return prevMembers.map((m, i) => 
          i === randomIndex ? { ...m, isOnline: !m.isOnline } : m
        );
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [members.length]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">팀 정보를 최신 상태로 불러오고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-100 min-h-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-800 uppercase tracking-widest mb-4">
          Meet the <span className="text-blue-600">Pixel Team</span>
        </h2>
        <p className="text-slate-500 font-medium">서버에서 실시간으로 가져온 우리 팀원들을 소개합니다!</p>
        <p className="text-xs text-slate-400 mt-2 font-mono">Connected to API: 127.0.0.1:8000</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}




