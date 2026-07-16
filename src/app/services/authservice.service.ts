import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../model/environment';
import { LoginRequest } from '../model/login-request';
import { RegisterRequest } from '../model/register-request';
import { AuthResponse, User } from '../model/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap((response) => this.saveSession(response))
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      data
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/refresh`,
      {
        refreshToken: this.getRefreshToken()
      }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/logout`,
      {
        refreshToken: this.getRefreshToken()
      }
    ).pipe(
      tap(() => this.clearSession())
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/me`
    );
  }

 saveSession(response: AuthResponse): void {

  localStorage.setItem(
    'accessToken',
    response.data.accessToken
  );

  localStorage.setItem(
    'refreshToken',
    response.data.refreshToken
  );

  localStorage.setItem(
    'user',
    JSON.stringify(response.data.user)
  );

}
  clearSession(): void {

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getCurrentUser(): User | null {

    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) as User : null;

  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  hasRole(role: string): boolean {
    return this.getCurrentUser()?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {

    const role = this.getCurrentUser()?.role;

    return role ? roles.includes(role) : false;

  }

}
