// no-auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const autenticado = localStorage.getItem('autenticado') === 'true';

  if (!autenticado) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
