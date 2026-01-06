import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const user = JSON.parse(sessionStorage.getItem('user_session') || '{}');
  const allowedRoles = route.data?.['roles'] as string[];

  if (!user?.role || !allowedRoles?.includes(user.role)) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
