import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);
  const expectedRoles: string[] = route.data['roles'] || [];

  if (authService.isAuthenticated() && authService.hasRole(expectedRoles)) {
    return true;
  }

  return router.navigate(['/login']);
};
