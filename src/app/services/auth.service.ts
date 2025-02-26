import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../types/correspondents';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  private readonly http = inject(HttpClient);
  private currentUser: User = {
    id: -1,
    username: '',
    email: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    role: '',
  };

  login(email: string, password: string) {
    return this.http.post(
      `${this.apiUrl}/login`,
      { email, password },
      { withCredentials: true }
    );
  }
  register(email: string, username: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      email,
      username,
      password,
    });
  }
  logout() {
    this.setCurrentUser({
      id: -1,
      username: '',
      email: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: '',
    });
    return this.http.delete(`${this.apiUrl}/logout`, { withCredentials: true });
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }
  getCurrentUserId() {
    return this.currentUser?.id;
  }

  getCurrentUser() {
    return this.currentUser ?? '';
  }
}
