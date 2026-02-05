interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  avatar: string;
  gender: string;
  style: string;
  location: string;
  color?: string;
  isOnline?: boolean;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const borderColor = member.color || 'border-slate-300';

  return (
    <div 
      className={`bg-white border-4 ${borderColor} p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-100 group relative`}
    >
      {/* Online Status Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900 px-2 py-1 border-2 border-slate-700">
        <span className={`w-2 h-2 ${member.isOnline ? 'bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-slate-500'}`}></span>
        <span className="text-[10px] font-black text-white uppercase tracking-tighter">
          {member.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="relative mb-6 overflow-hidden border-2 border-slate-200 bg-slate-100">
        {member.avatar ? (
          <img 
            src={`http://127.0.0.1:8000${member.avatar}`} 
            alt={member.name}
            className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-300 scale-110"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-4xl grayscale">👤</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
      
      <h3 className="text-xl font-extrabold text-slate-900 mb-1">{member.name}</h3>
      <p className="text-sm font-bold text-blue-500 mb-3 uppercase tracking-tighter">
        {member.role} <span className="text-slate-300 mx-1">|</span> {member.gender}
      </p>
      <p className="text-slate-600 text-sm leading-relaxed mb-4">
        "{member.description}"
      </p>
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
        <span className="bg-slate-100 px-2 py-0.5 border border-slate-200">{member.location}</span>
        <span className="bg-slate-100 px-2 py-0.5 border border-slate-200">{member.style}</span>
      </div>
    </div>
  );
}

