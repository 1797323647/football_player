import type { LeagueInfo } from '../types';

export const leagues: LeagueInfo[] = [
  {
    id: 'premier-league',
    name: '英超',
    nameEn: 'Premier League',
    country: '英格兰',
    color: '#00ff87',
    gradient: 'from-purple-600 to-pink-500',
  },
  {
    id: 'la-liga',
    name: '西甲',
    nameEn: 'La Liga',
    country: '西班牙',
    color: '#ff6b35',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'serie-a',
    name: '意甲',
    nameEn: 'Serie A',
    country: '意大利',
    color: '#1e90ff',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'bundesliga',
    name: '德甲',
    nameEn: 'Bundesliga',
    country: '德国',
    color: '#d90202',
    gradient: 'from-red-600 to-yellow-500',
  },
  {
    id: 'ligue-1',
    name: '法甲',
    nameEn: 'Ligue 1',
    country: '法国',
    color: '#dbeafe',
    gradient: 'from-indigo-500 to-purple-500',
  },
];

export const getLeagueById = (id: string) => {
  return leagues.find((league) => league.id === id);
};
