import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Never leak the token to third-party hosts
  if (!req.url.startsWith(environment.baseUrl)) {
    return next(req);
  }

  const token = localStorage.getItem('userToken');
  if (!token) {
    return next(req);
  }

  // HttpRequest is immutable, so clone it. The Route API expects the raw `token` header.
  return next(req.clone({ setHeaders: { token } }));
};
