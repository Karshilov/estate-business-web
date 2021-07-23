export interface UserInfoModel {
  username: string;
  email: string;
  avatar: string;
  userid: string;
  token: string;
  nickname: string;
  role: string;
  gender: number;
  phone_number: string;
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
  appointment_time: number; // 预约时间
  modify_time: number // 修改时间
  rate_score: string // 评分
  status: string // 状态
  reason: string // 理由
}

export interface GroupDetailModel {
  id: string;
  name: string;
  member_ids: UserInfoModel[];
  create_time: string;
  leader: UserInfoModel;
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