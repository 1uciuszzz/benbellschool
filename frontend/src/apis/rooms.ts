import { http } from "../utils/http";
import { Room } from "../pages/rooms/page";
import { Pagination, Res } from "./type";

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

interface RoomListItem {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetRoomsResponse {
  rooms: RoomListItem[];
  total: number;
}

export const ROOMS_API = {
  CREATE_ROOM: (): Res<CreateRoomResponse> => http.post(`/rooms`),
  GET_ROOMS: (payload: Pagination): Res<GetRoomsResponse> =>
    http.get(`/rooms`, { params: payload }),
  GET_USERS: (roomId: string): Res<User[]> =>
    http.get(`/rooms/${roomId}/users`),
  ROOM_DETAIL: (id: string): Res<RoomDetailResponse> =>
    http.get(`/rooms/${id}`),
  JOIN_ROOM: (id: string) => http.post(`/rooms/join/${id}`),
  CLOSE_ROOM: (id: string) => http.patch(`/rooms/${id}/close`),
};
