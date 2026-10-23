import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class PostService {
  private http = inject(HttpClient);
  baseUrl = `${environment.baseUrl}/posts`;

  getAllPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts`);
  }

  getHomeFeed(only: string, limit: number): Observable<any> {
    const params = new HttpParams();
    return this.http.get(`${this.baseUrl}/feed/`, { params });
  }
}
