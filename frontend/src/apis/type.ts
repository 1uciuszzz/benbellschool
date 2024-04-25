import { AxiosResponse } from "axios";

export interface Pagination {
  page: number;
  size: number;
}

export type Res<T> = Promise<AxiosResponse<T>>;
