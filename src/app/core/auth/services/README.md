# Core Services (`src/app/core/auth/services` & `src/app/core/services`)

Houses application-wide singleton services. These services handle global state, authentication, external API communication, and browser API integrations.

---

## Best Practices (Angular v22+)
- **Dependency Injection**: Use `inject()` function at the property level instead of constructor injection.
- **Modern Decorator**: In Angular v22+, prefer `@Service` or `@Injectable({ providedIn: 'root' })`.
- **Reactivity & Encapsulation**:
  - Expose signals as read-only (`mySignal.asReadonly()`) so consumer components cannot directly mutate internal state.
  - Only service methods should execute `.set()` or `.update()`.
  - Use `computed()` for derived state.
  - Avoid unnecessary RxJS Subjects when Angular Signals can model synchronous state.
- **Single Responsibility**: Each service should do one thing well (e.g., `AuthService` handles authentication, `UserService` handles user profiles).

---

## Signal State Mutation: `computed()` vs `.set()` vs `.update()`

Understanding the purpose of each mutation mechanism prevents common reactive state bugs:

### 1. `computed()` — Reacting to *Other* Signals (Derived State)
Use `computed()` when state is derived from one or more other signals. You never manually push values into a computed signal; it automatically recalculates:
```typescript
const firstName = signal('John');
const lastName = signal('Doe');

// Automatically recomputes whenever firstName or lastName changes
readonly fullName = computed(() => `${firstName()} ${lastName()}`);
```

### 2. `.set(newValue)` — Complete State Replacement
Use `.set()` when you **do not care** about the previous state and want to overwrite it completely with a brand new value:
```typescript
// Replace entire user object from backend response
this._userProfile.set(response.data.user);

// Clear state on logout
this._session.set(null);
```

### 3. `.update(fn)` — Partial or Value-Dependent Mutation
Use `.update()` when the new state **depends on the current state**. It passes the current value into a callback function so you can immutably derive the next value without losing existing fields:
```typescript
// Example: Updating only the user's photo while preserving name, email, counts, etc.
updateProfilePhoto(newPhotoUrl: string): void {
  this._userProfile.update((current) => {
    if (!current) return null;
    return {
      ...current,               // Preserves all existing profile properties
      photo: newPhotoUrl,       // Patches only the photo property
    };
  });
}

// Example: Incrementing a numeric counter
this._unreadCount.update((count) => count + 1);
```

---

## Example Service Pattern
```typescript
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, AuthSession } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  
  // 1. Private writable state
  private readonly _session = signal<AuthSession | null>(null);
  
  // 2. Public read-only signals
  readonly session = this._session.asReadonly();
  readonly currentUser = computed(() => this._session()?.user ?? null);
  readonly isAuthenticated = computed(() => !!this._session());

  // 3. Complete replacement (.set)
  setSession(session: AuthSession | null): void {
    this._session.set(session);
  }

  // 4. Immutably patching existing state (.update)
  updateUserAvatar(newPhotoUrl: string): void {
    this._session.update((session) => {
      if (!session || !session.user) return session;
      return {
        ...session,
        user: {
          ...session.user,
          photo: newPhotoUrl,
        },
      };
    });
  }

  logout(): void {
    this._session.set(null);
  }
}
```
