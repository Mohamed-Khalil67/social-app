import {inject, Service, signal} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {Post} from '../../../../core/models/post.interface';

@Service()
export class PostService {
  private http = inject(HttpClient);
  private readonly filter = signal<string>('all');
  // activeFilter is the signal for global filter chosen
  readonly activeFilter = this.filter.asReadonly();

  headers = {
    headers: {
     AUTHORIZATION: `Bearer ${localStorage.getItem('userToken')}`
    }
  }

  setFilter(filter: string) {
    this.filter.set(filter || 'all');
  }

  getAllPosts(): Observable<any> {
    return this.http.get(environment.baseUrl + '/posts', this.headers);
  }

  getHomeFeed(only: string = 'all', page: number = 1, limit: number = 10): Observable<any> {
    const params = { only: only, page, limit };
    return this.http.get(environment.baseUrl + '/posts/feed', { ...this.headers, params });
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
