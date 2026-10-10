# Layouts Module (`src/app/layouts`)

The `layouts` directory contains structural UI shells that wrap the application routes using `<router-outlet>`. Layouts establish page skeletons (headers, sidebars, footers, containers) while child routes render dynamic content within them.

---

## Architecture Rules
1. **Router Outlet Containers**: Every layout component contains a `<router-outlet />` where feature components are displayed.
2. **Layout Routing**: Layouts are configured at the route level in `app.routes.ts` using nested child routes:
   ```typescript
   {
     path: '',
     component: MainLayout,
     children: [
       { path: 'timeline', loadComponent: () => import('./features/timeline/timeline') },
       { path: 'profile', loadComponent: () => import('./features/profile/profile') }
     ]
   },
   {
     path: '',
     component: AuthLayout,
     children: [
       { path: 'login', loadComponent: () => import('./features/login/login') },
       { path: 'register', loadComponent: () => import('./features/register/register') }
     ]
   }
   ```

---

## Layouts in this Project

### `main-layout/`
- **Purpose**: The primary authenticated user layout.
- **Components**:
  - `navbar/`: Top navigation bar with logo, search bar, navigation links, notification indicator, and user menu dropdown.
  - Sidebar / Right widgets: Suggested users to follow, trending topics.
  - Main center column containing `<router-outlet />`.

### `auth-layout/`
- **Purpose**: A clean, distraction-free layout for unauthenticated flows (Login, Register, Forgot Password).
- **Features**: Centered card container, brand branding, and `<router-outlet />` without top navigation or sidebars.
