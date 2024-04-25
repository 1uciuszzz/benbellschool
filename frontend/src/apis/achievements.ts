import { http } from "../utils/http";
import { Pagination, Res } from "./type";

export interface Achievement {
  id: string;
  roomName: string;
  winNumber: number;
  date: string;
}

interface GetAchievementsResponse {
  achievements: Achievement[];
  total: number;
}

export interface StatusData {
  total: number;
  winCount: number;
  winRate: number;
}

export const ACHIEVEMENTS_API = {
  GET: (payload: Pagination): Res<GetAchievementsResponse> =>
    http.get(`/achievements`, { params: payload }),
  STATUS: (): Res<StatusData> => http.get(`/achievements/status`),
};
