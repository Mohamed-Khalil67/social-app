import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('userToken');

  if (token) {
    // Clone request because HttpRequest is immutable in Angular
    const clonedRequest = req.clone({
      setHeaders: {
        token: token,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
