import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth'
  constructor(private http: HttpClient) { }

  signUp(userData: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/signup`, userData, {
      responseType: 'text',
    });
  }

  login(userData: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/login`, userData,{
      responseType: 'json',
    }).pipe(
      tap((respose: any)=>{
        if(respose && respose.token){
          // store it
          localStorage.setItem('token', respose.token)
        }
      })
    );
  }

  forgot(userData: any): Observable<any>{
    return this.http.put(`${this.baseUrl}/forgot`, userData,{
      responseType:'text',
    });
  }
}
