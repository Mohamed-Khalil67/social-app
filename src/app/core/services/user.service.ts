import {inject, Service, signal} from '@angular/core';
import {HttpClient, HttpParams, httpResource} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SuggestedPaginationInfo, SuggestedUser, UserProfile} from '../models/user.interface';
import {Post} from '../models/post.interface';

@Service()
export class UserService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = '/users';

  // only this service writes the profile; everyone else reads userProfile
  private readonly profile = signal<UserProfile | null>(null);
  readonly userProfile = this.profile.asReadonly();

  // fetch the logged-in user once and keep them in the signal (null until it arrives)
  loadProfile(): void {
    this.getMyProfileData().subscribe({
      next: (res) => {
        console.log('[profile] loaded', res);
        this.profile.set(res.data.user);
      },
      error: (err) => console.error('[profile] failed', err.message),
    });
  }

  // keep name, email, _id... and replace only the photo
  updatePhoto(photo: string): void {
    this.profile.update((current) => (current ? { ...current, photo } : null));
  }

  getSuggestions(page: number = 1, limit: number = 10): Observable<{data: {suggestions: SuggestedUser[]}; meta?: {pagination?: SuggestedPaginationInfo}}> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<{
      data: { suggestions: SuggestedUser[] };
      meta?: { pagination?: SuggestedPaginationInfo };
    }>(`${this.baseUrl}/suggestions`, {params});
  }

  toggleFollowUser(userId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}/follow`, {});
  }

  getMyProfileData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile-data`);
  }

  uploadProfilePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.put(`${this.baseUrl}/upload-photo`, formData);
  }

  getPostsProfile(userId: () => string | undefined, limit: number = 20) {
    return httpResource<{ data: { posts: Post[] }; meta?: { pagination?: { total?: number } } }>(() => {
      const id = userId();
      if (!id) return undefined;
      return {
        url: `${this.baseUrl}/${id}/posts`,
        params: { limit },
      };
    });
  }
}
