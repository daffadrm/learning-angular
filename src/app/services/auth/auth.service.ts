import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'user_session';

  login(token: any) {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(token));
  }

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
  }
  getUser() {
    const data = sessionStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.SESSION_KEY);
  }
}
