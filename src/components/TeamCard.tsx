import type { TeamWithJersey } from '../types';
import { leagues } from '../data/leagues';

interface TeamCardProps {
  team: TeamWithJersey;
  onClick: () => void;
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  const league = leagues.find(l => l.id === team.league);

  return (
    <div
      onClick={onClick}
      className="group relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* 背景色 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundColor: league?.color || '#6CABDD' }}
      />

      {/* 球队徽章区域 */}
      <div className="relative pt-8 pb-16 px-4 flex items-center justify-center">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg transform group-hover:scale-105 transition-transform"
          style={{
            background: `linear-gradient(135deg, ${league?.color || '#6CABDD'}, ${league?.color ? `${league.color}99` : '#1C2C5B'})`,
          }}
        >
          {team.name.charAt(0)}
        </div>
      </div>

      {/* 底部信息栏 */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <p className="text-white font-bold text-sm sm:text-base truncate">
          {team.name}
        </p>
        <p className="text-white/70 text-xs truncate">
          {team.nameEn}
        </p>
      </div>

      {/* 联赛标签 */}
      <div className="absolute top-2 left-2">
        <span
          className="px-2 py-0.5 text-[10px] font-bold text-white rounded"
          style={{ backgroundColor: league?.color || '#6CABDD' }}
        >
          {league?.name}
        </span>
      </div>
    </div>
  );
}
