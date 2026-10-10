# Core Interceptors (`src/app/core/interceptors`)

Contains functional HTTP interceptors passed into `provideHttpClient(withInterceptors([...]))` in `app.config.ts`.

---

## Best Practices (Angular v22+)
- **Functional Interceptors**: Always use `HttpInterceptorFn`.
- **Dependency Injection**: Use `inject()` to access services like `AuthService` or notification dialogs.
- **Immutability**: Always clone requests when modifying headers (`req.clone({ setHeaders: { ... } })`).
- **Error Handling**: Use RxJS `catchError` to handle unhandled server responses or session expirations.

---

## Standard Auth Interceptor Template
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
```
