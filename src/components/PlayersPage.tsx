import { useState, useMemo } from 'react';
import type { Player, League } from '../types';
import { PlayerCard } from './PlayerCard';
import { players } from '../data/players';
import { leagues } from '../data/leagues';
import { getClubByName } from '../data/clubs';

interface PlayersPageProps {
  onPlayerClick: (player: Player) => void;
}

const leagueTabs = [
  { id: 'all', name: '全部联赛' },
  { id: 'premier-league', name: '英超' },
  { id: 'la-liga', name: '西甲' },
  { id: 'serie-a', name: '意甲' },
  { id: 'bundesliga', name: '德甲' },
  { id: 'ligue-1', name: '法甲' },
];

export function PlayersPage({ onPlayerClick }: PlayersPageProps) {
  const [activeLeague, setActiveLeague] = useState<League | 'all'>('all');

  // 筛选球员
  const filteredPlayers = useMemo(() => {
    if (activeLeague === 'all') {
      return players;
    }
    return players.filter((p) => p.league === activeLeague);
  }, [activeLeague]);

  // 按俱乐部分组，并按评分从高到低排序
  const playersByClub = useMemo(() => {
    const grouped: Record<string, Player[]> = {};
    filteredPlayers.forEach((player) => {
      if (!grouped[player.team]) {
        grouped[player.team] = [];
      }
      grouped[player.team].push(player);
    });
    // 对每个俱乐部的球员按评分从高到低排序
    Object.keys(grouped).forEach((team) => {
      grouped[team].sort((a, b) => b.rating - a.rating);
    });
    return grouped;
  }, [filteredPlayers]);


  const handlePlayerClick = (player: Player) => {
    onPlayerClick(player);
  };

  const leagueColor = leagues.find((l) => l.id === activeLeague)?.color || '#6CABDD';

  return (
    <div>
      {/* 头部横幅 */}
      <div
        className="pb-12 pt-8 transition-colors duration-300"
        style={{ backgroundColor: leagueColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            五大联赛球星
          </h1>
          <p className="text-white/80 text-lg">
            {activeLeague === 'all'
              ? '全部联赛球星一览'
              : `${leagues.find((l) => l.id === activeLeague)?.name}球星一览`}
          </p>
        </div>
      </div>

      {/* 联赛筛选标签 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {leagueTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLeague(tab.id as League | 'all')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeLeague === tab.id
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: activeLeague === tab.id ? leagueColor : undefined,
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 球员列表 - 按俱乐部分组 */}
      <main className="max-w-[1600px] mx-auto px-2 sm:px-3 lg:px-4 pb-16">
        {Object.entries(playersByClub).length > 0 ? (
          Object.entries(playersByClub).map(([clubName, clubPlayers]) => {
            const club = getClubByName(clubName);
            return (
              <section key={clubName} className="mb-12">
                {/* 俱乐部标题 */}
                <div className="flex items-center gap-4 mb-4 pb-2 border-b-2 border-gray-100">
                  {club ? (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${club.colors[0]}, ${club.colors[1] || club.colors[0]})`,
                      }}
                    >
                      {club.icon}
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black text-white shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${leagueColor}, ${leagueColor}99)`,
                      }}
                    >
                      {clubName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {clubName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {clubPlayers.length} 名球星
                    </p>
                  </div>
                </div>

                {/* 球员网格 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {clubPlayers.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      onClick={() => handlePlayerClick(player)}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">该联赛暂无球星数据</p>
          </div>
        )}
      </main>
    </div>
  );
}
