export interface ChartInfo {
  id: number;
  name: string;
  level: string;
  difficulty: number;
  charter: string;
  composer: string;
  illustrator: string;
  description: string;
  ranked: boolean;
  reviewed: boolean;
  stable: boolean;
  stableRequest: boolean;
  illustration: string;
  preview: string;
  file: string;
  uploader: number;
  tags: string[];
  rating: number;
  ratingCount: number;
  created: string;
  updated: string;
  chartUpdated: string;
}

export interface UserInfo {
  id: number;
  name: string;
  avatar: string;
  badges: any[]; // 根据实际数据结构可能需要更具体的类型
  language: string;
  bio: string;
  exp: number;
  rks: number;
  joined: string;
  last_login: string;
  roles: number;
  banned: boolean;
  login_banned: boolean;
  follower_count: number;
  following_count: number;
  following: boolean;
}
