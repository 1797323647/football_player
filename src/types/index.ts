// 联赛枚举
export type League =
  | 'premier-league'
  | 'la-liga'
  | 'serie-a'
  | 'bundesliga'
  | 'ligue-1';

// 页面类型
export type PageType = 'home' | 'players' | 'kits' | 'clubs';

// 联赛信息
export interface LeagueInfo {
  id: League;
  name: string;
  nameEn: string;
  country: string;
  color: string;
  gradient: string;
}

// 球星信息
export interface Player {
  id: string;
  name: string;
  nameEn: string;
  number: number;
  position: string;
  team: string;
  teamId: string;
  league: League;
  nationality: string;
  nationalityCode: string;
  age: number;
  birthDate: string;
  height: number; // cm
  preferredFoot: 'left' | 'right' | 'both';
  marketValue?: string; // 身价
  rating: number; // 评分 60-99
  image: string;
  isStar: boolean;
}

// 球员照片
export interface PlayerPhoto {
  name: string;
  position: string;
  number?: string;
  image: string;
}

// 球衣信息
export interface Kit {
  color: string;
  image: string;
  description: string;
}

// 赛季球衣数据
export interface SeasonJersey {
  season: string;
  homeKit: Kit;
  awayKit: Kit;
  players: PlayerPhoto[];
}

// 球队基础信息
export interface Team {
  id: string;
  name: string;
  nameEn: string;
  league: League;
  founded: number;
  stadium: string;
  city: string;
  manager?: string;
  website?: string;
}

// 完整的球队数据（基础信息 + 赛季球衣）
export interface TeamWithJersey extends Team {
  jersey: SeasonJersey;
}

// 视图模式
export type KitType = 'home' | 'away';
