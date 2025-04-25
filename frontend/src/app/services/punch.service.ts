import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PunchService {
  private baseUrl = 'http://localhost:8080/api/puch'
  constructor(private http: HttpClient) { }

  private getAthHeaders():HttpHeaders{
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization':`${token}`
    });
  }

  // punch in
  punchIn(): Observable<any>{
    const headers = this.getAthHeaders();
    return this.http.post(`${this.baseUrl}/in`, {}, {headers});
  }
  
  // punch out
  punchOut(): Observable<any>{
    const headers = this.getAthHeaders();
    return this.http.post(`${this.baseUrl}/out`, {}, {headers});
  }
  
  
  // history
  getHistory():Observable<any[]>{
    const headers = this.getAthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/history`, {headers});
  }
}
