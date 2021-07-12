export interface UserInfoModel {
    username: string;
    email:string;
    avatar: string;
}

export interface SearchItemModel {
    id: string;
    title: string; // 标题
    neighborhood: string; // 小区
    cover: string;
    area: string; //面积
    floor: number; //楼层 （相对楼层）
    total_floor: number; // 总层数
}