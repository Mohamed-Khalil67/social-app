# Core Module (`src/app/core`)

The `core` directory represents the foundation of the application. It houses singleton services, global application state, authentication primitives, HTTP interceptors, system models, and route protection guards.

---

## Architecture Rules
1. **Singleton Only**: Everything in `core/` exists as a single instance throughout the application lifecycle.
2. **One-Way Dependency Flow**:
   - `features/` and `layouts/` CAN import from `core/`.
   - `core/` MUST NEVER import from `features/` or `layouts/`.
3. **Provided in Root**: All services in this module must be registered using `@Injectable({ providedIn: 'root' })` or modern `@Service`.

---

## Directory Breakdown

### `guards/`
Functional route guards using `CanActivateFn` or `CanMatchFn`.
- **Purpose**: Protect routes against unauthenticated or unauthorized access.
- **Examples**:
  - `auth.guard.ts`: Verifies user login session; redirects unauthenticated users to `/login`.
  - `guest.guard.ts`: Prevents logged-in users from accessing `/login` or `/register`.

### `interceptors/`
Functional HTTP interceptors using `HttpInterceptorFn`.
- **Purpose**: Intercept outgoing HTTP requests and incoming HTTP responses.
- **Examples**:
  - `auth.interceptor.ts`: Attaches the JWT Bearer token from `AuthService` into outgoing `Authorization` headers.
  - `error.interceptor.ts`: Catches global HTTP status codes (e.g., 401 Unauthorized, 403 Forbidden, 500 Server Error) and triggers alerts or logouts.
  - `logging.interceptor.ts`: Tracks request performance and telemetry.

### `models/`
Global entity models, API contract responses, and TypeScript interfaces (`*.model.ts`).
- **Purpose**: Defines core system data structures shared across multiple domains.
- **Examples**:
  - `user.model.ts`: `User`, `UserProfile`, `UserRole`.
  - `auth.model.ts`: `LoginCredentials`, `RegisterPayload`, `AuthTokenResponse`.
  - `api-response.model.ts`: Generic API wrapper type `ApiResponse<T>`.

### `services/`
Global singleton services and reactive state managers.
- **Purpose**: State storage and API communication for system-level operations.
- **Angular Best Practices**:
  - Use `inject()` instead of constructor injection.
  - Manage state reactively using Angular Signals (`signal()`, `computed()`, `linkedSignal()`).
  - Use `httpResource()` or `HttpClient` for network communication.
- **Examples**:
  - `auth.service.ts`: Manages authentication state, user session signal, login, and logout.
  - `theme.service.ts`: Controls dark/light mode toggles and PrimeNG theme switches.
  - `storage.service.ts`: Type-safe wrapper around `localStorage` and `sessionStorage`.
