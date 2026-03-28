import type { SeasonJersey, TeamWithJersey } from '../../types';
import { teams } from '../teams';

// 生成赛季球衣数据（使用占位图路径）
const generateJerseyData = (teamId: string, season: string): SeasonJersey => {
  const basePath = `/images/${teamId}`;

  return {
    season,
    homeKit: {
      color: '主场颜色',
      image: `${basePath}/home.jpg`,
      description: `${season} 赛季主场球衣`,
    },
    awayKit: {
      color: '客场颜色',
      image: `${basePath}/away.jpg`,
      description: `${season} 赛季客场球衣`,
    },
    players: [
      {
        name: '球员1',
        position: '前锋',
        image: `${basePath}/players/player1.jpg`,
      },
      {
        name: '球员2',
        position: '中场',
        image: `${basePath}/players/player2.jpg`,
      },
      {
        name: '球员3',
        position: '后卫',
        image: `${basePath}/players/player3.jpg`,
      },
    ],
  };
};

// 合并球队基础信息和赛季球衣数据
export const getTeamsWithJersey = (season: string = '2025-26'): TeamWithJersey[] => {
  return teams.map((team) => ({
    ...team,
    jersey: generateJerseyData(team.id, season),
  }));
};

// 导出赛季数据
export const season2025_26 = getTeamsWithJersey('2025-26');

// 按联赛筛选
export const getTeamsByLeague = (leagueId: string) => {
  return season2025_26.filter((team) => team.league === leagueId);
};

// 搜索球队
export const searchTeams = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return season2025_26.filter(
    (team) =>
      team.name.toLowerCase().includes(lowerQuery) ||
      team.nameEn.toLowerCase().includes(lowerQuery) ||
      team.city.toLowerCase().includes(lowerQuery)
  );
};
