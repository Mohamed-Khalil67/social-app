import {inject, Service} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient)

  signUp(data:object): Observable<any> {
    return this.http.post("https://route-posts.routemisr.com/users/signup",data)
  }

  signIn(data:object): Observable<any> {
    return this.http.post("https://route-posts.routemisr.com/users/signin",data)
  }

  changePassword(data:object):Observable<any>{
    return this.http.patch("https://route-posts.routemisr.com/users/change-password",data)
  }
}

