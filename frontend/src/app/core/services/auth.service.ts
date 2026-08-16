import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { ApiResponseEnvelope, AuthResponseData, UserProfile } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE = '/api/v1/auth';

  accessToken = signal<string | null>(null);
  currentUser = signal<UserProfile | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkSession();
  }

  login(credentials: { email: String; password: String }): Observable<ApiResponseEnvelope<AuthResponseData>> {
    return this.http.post<ApiResponseEnvelope<AuthResponseData>>(`${this.API_BASE}/login`, credentials, { withCredentials: true })
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            this.handleAuthSuccess(res.data);
          }
        })
      );
  }

  register(data: any): Observable<ApiResponseEnvelope<AuthResponseData>> {
    return this.http.post<ApiResponseEnvelope<AuthResponseData>>(`${this.API_BASE}/register`, data, { withCredentials: true })
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            this.handleAuthSuccess(res.data);
          }
        })
      );
  }

  refreshToken(): Observable<ApiResponseEnvelope<AuthResponseData>> {
    return this.http.post<ApiResponseEnvelope<AuthResponseData>>(`${this.API_BASE}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            this.accessToken.set(res.data.accessToken);
            this.isAuthenticated.set(true);
          }
        })
      );
  }

  logout(): void {
    this.http.post(`${this.API_BASE}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private handleAuthSuccess(data: AuthResponseData): void {
    this.accessToken.set(data.accessToken);
    this.currentUser.set({
      userPublicId: data.userPublicId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      tenantId: data.tenantId,
      tenantSlug: data.tenantSlug,
      companyName: data.companyName,
      roles: data.roles || [],
      permissions: data.permissions || []
    });
    this.isAuthenticated.set(true);
  }

  private checkSession(): void {
    this.refreshToken().subscribe({
      next: () => {
        this.fetchProfile();
      },
      error: () => {
        this.isAuthenticated.set(false);
        this.accessToken.set(null);
        this.currentUser.set(null);
      }
    });
  }

  fetchProfile(): void {
    this.http.get<ApiResponseEnvelope<AuthResponseData>>(`${this.API_BASE}/me`, { withCredentials: true }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.currentUser.set({
            userPublicId: res.data.userPublicId,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            tenantId: res.data.tenantId,
            tenantSlug: res.data.tenantSlug,
            companyName: res.data.companyName,
            roles: res.data.roles || [],
            permissions: res.data.permissions || []
          });
          this.isAuthenticated.set(true);
        }
      }
    });
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
