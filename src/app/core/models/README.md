# Core Models (`src/app/core/models`)

Contains global TypeScript interfaces, types, and enums representing shared data structures across the application.

---

## Best Practices
1. **Naming Conventions**: Always use the `.model.ts` suffix (e.g., `user.model.ts`, `api.model.ts`).
2. **Interfaces over Classes**: Prefer `interface` or `type` for data shapes to avoid runtime JavaScript overhead.
3. **Strict Type Safety**: Avoid `any`. Use `unknown` when incoming data structure is uncertain, and validate with Zod or type guards if needed.
4. **Scope**: Only place domain entities that span multiple features (like `User`, `AuthSession`, `PaginationParams`) here. Feature-specific models belong inside that feature's folder.

---

## Example Model
```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  user: User;
}
```
