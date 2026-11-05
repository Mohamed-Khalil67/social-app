import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { environment } from '../../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isOurApi = req.url.startsWith(environment.baseUrl);
  const isLoggedIn = !!localStorage.getItem('userToken');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 = the server rejected our token, so log the user out
      if (error.status === 401 && isOurApi && isLoggedIn) {
        authService.signOut();
      }
      // pass the error on so each component's own error handler still runs
      return throwError(() => error);
    }),
  );
};
