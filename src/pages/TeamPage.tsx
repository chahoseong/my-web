import { useState, useEffect } from 'react';
import avatar1 from '../assets/team/avatar1.png';
import avatar2 from '../assets/team/avatar2.png';
import avatar3 from '../assets/team/avatar3.png';
import avatar4 from '../assets/team/avatar4.png';
import avatar5 from '../assets/team/avatar5.png';
import TeamMemberCard from '../components/TeamMemberCard';

const INITIAL_TEAM_MEMBERS = [
  {
    id: 1,
    name: '김 픽셀 (PM)',
    role: '프로젝트 매니저',
    description: '아이디어를 도트로 하나하나 구현해내는 실행력의 끝판왕입니다.',
    image: avatar1,
    color: 'border-yellow-400',
    isOnline: true
  },
  {
    id: 2,
    name: '이 바이트 (CTO)',
    role: '메인 개발자',
    description: '서버를 0과 1로 지배하며, 버그 없는 코드를 위해 밤을 지새웁니다.',
    image: avatar2,
    color: 'border-blue-400',
    isOnline: true
  },
  {
    id: 3,
    name: '박 스프라이트 (CDO)',
    role: '디자인 총괄',
    description: '모든 디자인을 픽셀 단위로 정밀하게 다듬는 예술가입니다.',
    image: avatar3,
    color: 'border-purple-400',
    isOnline: false
  },
  {
    id: 4,
    name: '최 프레임 (Developer)',
    role: '프론트엔드 엔지니어',
    description: '부드러운 화면 전환과 최적의 프레임워크를 연구합니다.',
    image: avatar4,
    color: 'border-green-400',
    isOnline: true
  },
  {
    id: 5,
    name: '정 해상도 (Marketing)',
    role: '마케팅 전략가',
    description: '우리의 가치를 가장 높은 해상도로 세상에 알립니다.',
    image: avatar5,
    color: 'border-pink-400',
    isOnline: false
  }
];

export default function TeamPage() {
  const [members, setMembers] = useState(INITIAL_TEAM_MEMBERS);

  // 시뮬레이션: 3초마다 무작위 한 명의 접속 상태를 변경합니다.
  useEffect(() => {
    const interval = setInterval(() => {
      setMembers(prevMembers => {
        const randomIndex = Math.floor(Math.random() * prevMembers.length);
        return prevMembers.map((m, i) => 
          i === randomIndex ? { ...m, isOnline: !m.isOnline } : m
        );
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-slate-100 min-h-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-800 uppercase tracking-widest mb-4">
          Meet the <span className="text-blue-600">Pixel Team</span>
        </h2>
        <p className="text-slate-500 font-medium">8비트 감성으로 뭉친 우리 팀을 소개합니다!</p>
        <p className="text-xs text-slate-400 mt-2 font-mono">Status updates in real-time...</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}



