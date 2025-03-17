import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../types/types';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  readonly currentUser = signal<User | undefined>(undefined);

  fetchCurrentUser() {
    console.log('fetching current user...');
    this.http
      .get<{ user: User }>(`${this.apiUrl}/me`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.currentUser.set(response.user);
        },
        error: (error) => {
          this.currentUser.set(undefined);
          this.router.navigate(['/login']);
        },
      });
  }

  async login(email: string, password: string) {
    let loginResponse: any = await firstValueFrom(
      this.http.post(
        `${this.apiUrl}/login`,
        { email, password },
        { withCredentials: true }
      )
    );
    this.currentUser.set(loginResponse.user);
  }
  register(email: string, username: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      email,
      username,
      password,
    });
  }
  logout() {
    this.currentUser.set(undefined);
    return this.http.delete(`${this.apiUrl}/logout`, { withCredentials: true });
  }
}
