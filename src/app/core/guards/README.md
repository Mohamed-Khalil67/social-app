# Core Guards (`src/app/core/guards`)

Houses functional route guards that determine whether a navigation route can be activated, deactivated, or matched.

---

## Best Practices (Angular v22+)
- **Functional Guards**: Prefer `CanActivateFn` and `CanMatchFn` over class-based guards implementing deprecated interfaces.
- **Dependency Injection**: Use `inject(Router)` and `inject(AuthService)` inside the guard function.
- **Signals**: Read auth status directly from signals via `authService.isAuthenticated()`.
- **Redirects**: Return a `UrlTree` using `inject(Router).createUrlTree(['/login'])` instead of calling `router.navigate()`.

---

## Standard Guard Template
```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```
