// auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const autenticado = localStorage.getItem('autenticado') === 'true';

  if (autenticado) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
