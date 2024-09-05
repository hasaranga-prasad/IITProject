import { CanActivateFn, Router } from '@angular/router';
import{ inject } from'@angular/core';
import { UserService } from './user.service';

export const userGuard: CanActivateFn = (route, state) => {
  if (inject(UserService).isAuthenticated()) {
    return true;
  }else{
    inject(Router).navigate(['/login'])
    return false
  }
};
