import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
//   User tries to open /timeline
//                    │
//           Is userToken present?
//            ├── YES  ──> ✅ return true (Allow access to /timeline)
//            └── NO   ──> ⛔ redirect to /login
  // timeline , profile, notification
  if(localStorage.getItem('userToken')){
    return true;
  } else {
    // parseUrl , it returns url tree
    return router.parseUrl('/login');
  }
};
