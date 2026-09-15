import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const EXTERNAL_DOMAINS = ['api.cloudinary.com'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isExternal = req.url.startsWith('http') && EXTERNAL_DOMAINS.some(d => req.url.includes(d));

  if (isExternal) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
