import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {Post} from '../model/post.interface';

@Service()
export class PostService {
  private http = inject(HttpClient);

  headers = {
    headers: {
     AUTHORIZATION: `Bearer ${localStorage.getItem('userToken')}`
    }
  }

  getAllPosts(): Observable<any> {
    return this.http.get(environment.baseUrl + '/posts', this.headers);
  }

  getHomeFeed(only: string, limit: number): Observable<any> {
    const params = new HttpParams();
    return this.http.get(environment.baseUrl + '/feed', { params });
  }

  getSinglePost(postId: string): Observable<any> {
    return this.http.get(environment.baseUrl + `/posts/${postId}`, this.headers);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(environment.baseUrl + `/posts/${postId}`, this.headers);
  }

  createPost(data:Post): Observable<any> {
    return this.http.post(environment.baseUrl + '/posts/',data, this.headers);
  }
}
