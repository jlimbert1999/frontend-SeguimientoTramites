import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authStatus } from '../interfaces';

export const IsNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.authStatus() === authStatus.authenticated) {
   
    router.navigate(['/tramites/externos']);
    return false;
  }
  return true;
};
