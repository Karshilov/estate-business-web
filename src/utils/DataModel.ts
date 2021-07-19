export interface UserInfoModel {
  username: string;
  email: string;
  avatar: string;
  userid: string;
  token: string;
  nickname: string;
  role: string;
}

export interface SearchItemModel {
  id: string;
  title: string; // 标题
  neighbourhood: string; // 小区
  cover: string;
  area: string; //面积
  floor: number; //楼层 （相对楼层）
  total_floor: number; // 总层数
  price: number;
  create_time: number;
  features: string[];
}

export interface RentDetailModel {
  title: string;
  photos: string[];
  house_type: string;
  area: number;
  create_time: number;
  last_modify: number;
  floor: number;
  total_floor: number;
  price: number;
  owner: {
    username: string;
    nickname: string;
    avatar: string;
  }
  decoration: string;
  features: string[];
  neighbourhood: string;
  city: string;
  rent_type: string;
  equipments: number;
}


export interface SecondHandDetailModel {
  title: string;
  photos: string[];
  house_type: string;
  area: number;
  create_time: number;
  last_modify: number;
  floor: number;
  total_floor: number;
  price: number;
  owner: {
    username: string;
    nickname: string;
    avatar: string;
  }
  decoration: string;
  features: string[];
  neighbourhood: string;
  city: string;
  rent_type: string;
  equipments: number;
}