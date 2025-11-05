import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth'; // backend URL

  constructor(private http: HttpClient, private router: Router) { }

  // LOGIN
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  // REGISTER
  register(email: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { email, username, password });
  }

  // LOGOUT
  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // CHECK IF LOGGED IN
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  // GET LOGGED IN USER
  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // GET CUSTOMER ID
  getCustomerId(): number {
    const user = this.getUser();
    return user.id || 0;
  }
}
