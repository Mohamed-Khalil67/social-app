import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Lets services call `/posts` instead of `environment.baseUrl + '/posts'`.
// Absolute URLs (already prefixed or third-party) pass through untouched.
export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/')) {
    return next(req.clone({ url: `${environment.baseUrl}${req.url}` }));
  }
  return next(req);
};
