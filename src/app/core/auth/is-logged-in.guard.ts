import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { take, tap } from 'rxjs';

import { AuthService } from './auth.service';

export const isLoggedInGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userState$.pipe(
    take(1),
    tap((isLoggedIn) => (isLoggedIn ? true : router.navigate(['/login'])))
  );
};
