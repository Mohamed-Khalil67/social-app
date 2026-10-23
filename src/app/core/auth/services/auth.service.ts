import {inject, Service} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = `${environment.baseUrl}/users`;

  signUp(data:object): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  signIn(data:object): Observable<any> {
    return this.http.post(`${this.baseUrl}/signin`, data);
  }

  signOut(){
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  changePassword(data:object):Observable<any>{
    return this.http.patch(`${this.baseUrl}/change-password`, data);
  }
}

