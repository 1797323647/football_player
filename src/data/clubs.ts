import type { League } from '../types';

export interface Club {
  id: string;
  name: string;
  nameEn: string;
  shortName: string;
  league: League;
  colors: string[];
  icon: string; // emoji或图标路径
  hasImage: boolean;
}

// 俱乐部数据
export const clubs: Club[] = [
  // 英超
  {
    id: 'man-city',
    name: '曼城',
    nameEn: 'Manchester City',
    shortName: '曼城',
    league: 'premier-league',
    colors: ['#6CABDD', '#1C2C5B'],
    icon: '🔵',
    hasImage: false,
  },
  {
    id: 'arsenal',
    name: '阿森纳',
    nameEn: 'Arsenal',
    shortName: '阿森纳',
    league: 'premier-league',
    colors: ['#EF0107', '#FFFFFF'],
    icon: '🔴',
    hasImage: false,
  },
  {
    id: 'liverpool',
    name: '利物浦',
    nameEn: 'Liverpool',
    shortName: '利物浦',
    league: 'premier-league',
    colors: ['#C8102E', '#F6EB61'],
    icon: '🔴',
    hasImage: false,
  },
  {
    id: 'man-united',
    name: '曼联',
    nameEn: 'Manchester United',
    shortName: '曼联',
    league: 'premier-league',
    colors: ['#DA291C', '#FBE122'],
    icon: '👹',
    hasImage: false,
  },
  {
    id: 'chelsea',
    name: '切尔西',
    nameEn: 'Chelsea',
    shortName: '切尔西',
    league: 'premier-league',
    colors: ['#034694', '#FFFFFF'],
    icon: '🔵',
    hasImage: false,
  },
  {
    id: 'tottenham',
    name: '热刺',
    nameEn: 'Tottenham Hotspur',
    shortName: '热刺',
    league: 'premier-league',
    colors: ['#FFFFFF', '#132257'],
    icon: '🐓',
    hasImage: false,
  },
  {
    id: 'newcastle',
    name: '纽卡斯尔',
    nameEn: 'Newcastle United',
    shortName: '纽卡斯尔',
    league: 'premier-league',
    colors: ['#241F20', '#FFFFFF'],
    icon: '⚫',
    hasImage: false,
  },
  {
    id: 'aston-villa',
    name: '阿斯顿维拉',
    nameEn: 'Aston Villa',
    shortName: '维拉',
    league: 'premier-league',
    colors: ['#95BFE5', '#670E36'],
    icon: '🦁',
    hasImage: false,
  },
  // 西甲
  {
    id: 'real-madrid',
    name: '皇家马德里',
    nameEn: 'Real Madrid',
    shortName: '皇马',
    league: 'la-liga',
    colors: ['#FFFFFF', '#FEBE10'],
    icon: '⚪',
    hasImage: false,
  },
  {
    id: 'barcelona',
    name: '巴塞罗那',
    nameEn: 'Barcelona',
    shortName: '巴萨',
    league: 'la-liga',
    colors: ['#A50044', '#004D98'],
    icon: '🔴',
    hasImage: false,
  },
  {
    id: 'atletico-madrid',
    name: '马德里竞技',
    nameEn: 'Atletico Madrid',
    shortName: '马竞',
    league: 'la-liga',
    colors: ['#CB3524', '#FFFFFF'],
    icon: '🔴',
    hasImage: false,
  },
  // 意甲
  {
    id: 'inter-milan',
    name: '国际米兰',
    nameEn: 'Inter Milan',
    shortName: '国米',
    league: 'serie-a',
    colors: ['#010E80', '#000000'],
    icon: '🔵',
    hasImage: false,
  },
  {
    id: 'ac-milan',
    name: 'AC米兰',
    nameEn: 'AC Milan',
    shortName: '米兰',
    league: 'serie-a',
    colors: ['#FB090B', '#000000'],
    icon: '🔴',
    hasImage: false,
  },
  {
    id: 'juventus',
    name: '尤文图斯',
    nameEn: 'Juventus',
    shortName: '尤文',
    league: 'serie-a',
    colors: ['#FFFFFF', '#000000'],
    icon: '⚫',
    hasImage: false,
  },
  // 德甲
  {
    id: 'bayern-munich',
    name: '拜仁慕尼黑',
    nameEn: 'Bayern Munich',
    shortName: '拜仁',
    league: 'bundesliga',
    colors: ['#DC052D', '#FFFFFF'],
    icon: '🔴',
    hasImage: false,
  },
  {
    id: 'leverkusen',
    name: '勒沃库森',
    nameEn: 'Bayer Leverkusen',
    shortName: '药厂',
    league: 'bundesliga',
    colors: ['#E32219', '#FFFFFF'],
    icon: '🔴',
    hasImage: false,
  },
  // 法甲
  {
    id: 'psg',
    name: '巴黎圣日耳曼',
    nameEn: 'Paris Saint-Germain',
    shortName: '巴黎',
    league: 'ligue-1',
    colors: ['#004170', '#DA291C'],
    icon: '🔵',
    hasImage: false,
  },
];

// 根据ID获取俱乐部
export function getClubById(id: string): Club | undefined {
  return clubs.find(c => c.id === id);
}

// 根据名称获取俱乐部
export function getClubByName(name: string): Club | undefined {
  return clubs.find(c => c.name === name || c.nameEn === name);
}

// 获取联赛所有俱乐部
export function getClubsByLeague(league: League): Club[] {
  return clubs.filter(c => c.league === league);
}
