import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../constant/constant';

export interface Users {
  username: string;
  level: string;
  id: string;
  password: string;
  nama: string;
}

export interface Order {
  id: number;
  brand: string;
  ordnum: string;
  courier: string;
  cust_name: string;
  order_date: string;
  status: string | null;
  awb: string;
}

export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  data: T[];
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getOrders(limit: number, offset: number) {
    return this.http.get<PaginatedResponse<Order>>(
      Constant.API_END_POINT + Constant.METHOD.GET_ALL_ORDERS + '/paginated',
      {
        params: {
          limit: limit,
          offset: offset,
        },
      }
    );
  }
}
