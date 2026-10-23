import {inject, Service, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SuggestedPaginationInfo, SuggestedUser, UserProfile} from '../models/user.interface';
import {environment} from '../../../environments/environment';

@Service()
export class UserService {
  private http = inject(HttpClient);
  baseUrl = `${environment.baseUrl}/users`;

  readonly userProfile = signal<UserProfile | null>(null)

  getSuggestions(page: number = 1, limit: number = 10):Observable<{data: {suggestions: SuggestedUser[]}; meta?: {pagination?: SuggestedPaginationInfo}}> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<{
      data: { suggestions: SuggestedUser[] };
      meta?: { pagination?: SuggestedPaginationInfo };
    }>(`${this.baseUrl}/suggestions`,{params});
  }

  toggleFollowUser(userId:string):Observable<any>{
    return this.http.put(`${this.baseUrl}/${userId}/follow`, {})
  }

  getMyProfileData():Observable<any> {
    return this.http.get(`${this.baseUrl}/profile-data`);
  }

  uploadProfilePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.put(`${this.baseUrl}/upload-photo`, formData);
  }
}
