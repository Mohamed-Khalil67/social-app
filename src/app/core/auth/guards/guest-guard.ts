import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';


export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if(localStorage.getItem('userToken')){
    return router.parseUrl('/timeline');
  } else {
    return true;
  }
};
