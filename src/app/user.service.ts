import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE_URL = 'https://rodfhbm5x7.execute-api.us-east-1.amazonaws.com/dev';
const LOCAL_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUsers() {
    return this.httpClient.get(`${BASE_URL}/users`);
  }
  delUser(val: any) {
    const data: any = {
      body: val,
    };
    return this.httpClient.delete(`${BASE_URL}/users`, data);
  }
  addUser(val: any) {
    return this.httpClient.post(`${BASE_URL}/users`, val);
  }
}
