import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/auth'; // Replace with your actual API URL

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    // Replace with a real HTTP call
    return of({ token: 'fake-jwt-token', role: 'student' }).pipe(
      tap((response) => localStorage.setItem('token', response.token)),
      tap((response) => localStorage.setItem('role', response.role))
    );
  }

  isAuthenticated(): boolean {
    // Check if the token exists in local storage
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/auth/login']);
  }
}