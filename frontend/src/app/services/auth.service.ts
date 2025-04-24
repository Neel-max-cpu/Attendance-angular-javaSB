import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api'
  constructor(private http: HttpClient) { }

  signUp(userData: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/signup`, userData, {
      responseType: 'text',
    });
  }

  login(userData: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/login`, userData,{
      responseType: 'text',
    });
  }

  forgot(userData: any): Observable<any>{
    return this.http.put(`${this.baseUrl}/forgot`, userData,{
      responseType:'text',
    });
  }
}
