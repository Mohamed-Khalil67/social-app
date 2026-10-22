import {inject, Service, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserProfile} from '../models/user.interface';

@Service()
export class UserService {
  private http = inject(HttpClient);
  baseUrl = "https://route-posts.routemisr.com/users"

  readonly userProfile = signal<UserProfile | null>(null)

  getSuggestions():Observable<any> {
    return this.http.get(`${this.baseUrl}/suggestions`);
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
