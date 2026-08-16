import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();
  const user = authService.currentUser();

  let cloned = req.clone();

  if (token) {
    cloned = cloned.clone({
      headers: cloned.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  if (user?.tenantId) {
    cloned = cloned.clone({
      headers: cloned.headers.set('X-Tenant-ID', user.tenantId.toString())
    });
  }

  return next(cloned);
};
