import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  if (!token || req.url.endsWith('/auth/login') || req.url.endsWith('/auth/mfa') || req.url.endsWith('/health')) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })).pipe(
    catchError(err => {
      if (err.status === 401) auth.logout();
      return throwError(() => err);
    })
  );
};
