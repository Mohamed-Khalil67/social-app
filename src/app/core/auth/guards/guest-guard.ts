import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';


export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
//   User tries to open /login
//                    │
//           Is userToken present?
//            ├── YES  ──> ⛔ redirect to /timeline (Already logged in!)
//            └── NO   ──> ✅ return true (Allow them to log in or register)

  if(localStorage.getItem('userToken')){
    return router.parseUrl('/timeline');
  } else {
    return true;
  }
};
