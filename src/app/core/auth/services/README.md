# Core Services (``)

Houses application-wide singleton services. These services handle global state, authentication, external API communication, and browser API integrations.

---

## Best Practices (Angular v22+)
- **Dependency Injection**: Use `inject()` function at the property level instead of constructor injection.
- **Modern Decorator**: In Angular v22+, prefer `@Service` or `@Injectable({ providedIn: 'root' })`.
- **Reactivity**:
  - Expose signals as read-only (`mySignal.asReadonly()`) to prevent consumer components from directly mutating internal state.
  - Use `computed()` for derived state.
  - Avoid unnecessary RxJS Subjects when Angular Signals can model the synchronous state.
- **Single Responsibility**: Each service should do one thing well (e.g., `AuthService` handles authentication, `ThemeService` handles themes).

---

## Example Service Pattern
```typescript
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, AuthSession } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  
  // State Signals
  private readonly _session = signal<AuthSession | null>(null);
  
  // Public Read-only Signals
  readonly session = this._session.asReadonly();
  readonly currentUser = computed(() => this._session()?.user ?? null);
  readonly isAuthenticated = computed(() => !!this._session());

  setSession(session: AuthSession | null): void {
    this._session.set(session);
  }

  logout(): void {
    this._session.set(null);
  }
}
```
