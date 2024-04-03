import { AxiosResponse } from "axios";
import { http } from "../utils/http";
import { Room } from "../pages/rooms/page";

export interface User {
  id: string;
  name: string;
}

export interface UserStats {
  userId: string;
  amount: number;
}

export interface Expenditure {
  id: string;
  payerId: string;
  payeeId: string;
  amount: number;
  roomId: string;
  createAt: string;
}

interface RoomDetailResponse {
  room: Room;
  roomUsers: User[];
  expenditureStats: UserStats[];
  expenditures: Expenditure[];
}

interface CreateRoomResponse {
  id: string;
  name: string;
  createdAt: string;
}

export const ROOMS_API = {
  CREATE_ROOM: (): Promise<AxiosResponse<CreateRoomResponse>> =>
    http.post(`/rooms`),
  GET_ROOMS: (): Promise<AxiosResponse> => http.get(`/rooms`),
  GET_USERS: (roomId: string): Promise<AxiosResponse<User[]>> =>
    http.get(`/rooms/${roomId}/users`),
  ROOM_DETAIL: (id: string): Promise<AxiosResponse<RoomDetailResponse>> =>
    http.get(`/rooms/${id}`),
  JOIN_ROOM: (id: string): Promise<AxiosResponse> =>
    http.post(`/rooms/join/${id}`),
  CLOSE_ROOM: (id: string): Promise<AxiosResponse> =>
    http.patch(`/rooms/${id}/close`),
};
