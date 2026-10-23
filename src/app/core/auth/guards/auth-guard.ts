import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // timeline , profile, notification
  if(localStorage.getItem('userToken')){
    return true;
  } else {
    // parseUrl , it returns url tree
    return router.parseUrl('/login');
  }
};
