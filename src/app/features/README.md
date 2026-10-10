# Features Module (`src/app/features`)

The `features` directory contains all business-domain specific pages and user-facing modules of the social media application. Each folder represents an independent domain or routed feature.

---

## Architecture Rules
1. **Domain Isolation**:
   - Features MUST NOT import private components or private state from other sibling feature folders.
   - If two features need the same UI widget or model, move it to `shared/` or `core/`.
2. **Lazy Loading**:
   - Every routed feature should be lazy loaded in `app.routes.ts` via `loadComponent: () => import(...)`.
3. **Internal Structure**:
   Complex features should contain:
   ```text
   feature-name/
   ├── components/         # Sub-components private to this feature only
   ├── services/           # Feature data/store (e.g. timeline-data.ts)
   ├── models/             # Domain models private to this feature (e.g. post.model.ts)
   ├── feature-name.ts     # Main routed smart component
   ├── feature-name.html   # Main template
   ├── feature-name.css    # Scoped styles (Pure CSS / Tailwind utilities)
   └── feature-name.spec.ts# Unit tests
   ```

---

## Feature Domains in this Project

| Domain Folder | Purpose |
| :--- | :--- |
| **`timeline/`** | The main social feed: post streams, post creation, comments, likes, and infinite scrolling. |
| **`profile/`** | User profile page: user bio, user posts, follower/following counts, profile edit modals. |
| **`notification/`** | Social alerts: likes, mentions, comments, and follow requests. |
| **`login/`** | User login form with authentication handling and error states. |
| **`register/`** | New user sign-up form with input validation and account creation. |
| **`forgetpassword/`** | Password reset request form (email verification link). |
| **`changepassword/`** | Secure password change/update screen. |
| **`notfound/`** | 404 error page displayed when users navigate to undefined routes. |
