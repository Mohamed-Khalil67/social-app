import {inject, Service, signal} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {Post} from '../../../../core/models/post.interface';

@Service()
export class PostService {
  private http = inject(HttpClient);
  private readonly filter = signal<string>('all');
  // activeFilter is the signal for global filter chosen
  readonly activeFilter = this.filter.asReadonly();

  setFilter(filter: string) {
    this.filter.set(filter || 'all');
  }

  getAllPosts(): Observable<any> {
    return this.http.get(environment.baseUrl + '/posts');
  }

  getHomeFeed(only: string = 'all', page: number = 1, limit: number = 10): Observable<any> {
    const params = { only: only, page, limit };
    return this.http.get(environment.baseUrl + '/posts/feed', { params });
  }

  // post.service.ts
  feedResource(page: () => number) {
    return httpResource<{ data: { posts: Post[] } }>(() => {
      const only = this.activeFilter();
      const p = page();
      console.log(`[2 request] GET /posts/feed?only=${only}&page=${p}`);
      return {
        url: `${environment.baseUrl}/posts/feed`,
        params: { only, page: p, limit: 10 },
      };
    });
  }

  getSinglePost(postId: string): Observable<any> {
    return this.http.get(environment.baseUrl + `/posts/${postId}`);
  }

  editPost(postId: string, data:FormData): Observable<any> {
    return this.http.put(environment.baseUrl + `/posts/${postId}`, data);
  }

  createPost(data:FormData): Observable<any> {
    return this.http.post(environment.baseUrl + '/posts/',data);
  }
}
