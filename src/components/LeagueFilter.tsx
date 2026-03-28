import type { League } from '../types';

interface LeagueFilterProps {
  activeLeague: string;
  onLeagueChange: (league: League | 'all') => void;
}

const leagues = [
  { id: 'all', name: '全部' },
  { id: 'premier-league', name: '英超' },
  { id: 'la-liga', name: '西甲' },
  { id: 'serie-a', name: '意甲' },
  { id: 'bundesliga', name: '德甲' },
  { id: 'ligue-1', name: '法甲' },
];

export function LeagueFilter({ activeLeague, onLeagueChange }: LeagueFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {leagues.map((league) => (
        <button
          key={league.id}
          onClick={() => onLeagueChange(league.id as League | 'all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            activeLeague === league.id
              ? 'bg-[#6CABDD] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {league.name}
        </button>
      ))}
    </div>
  );
}
