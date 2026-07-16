import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';
import { AuthService } from '../../services/authservice.service';
import { Router } from '@angular/router';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();

  let request = req;

  if (token) {

    request = req.clone({

      setHeaders: {

        Authorization: `Bearer ${token}`

      }

    });

  }

  return next(request).pipe(

    catchError((error: HttpErrorResponse) => {

      if (
        error.status === 401 &&
        authService.getRefreshToken()
      ) {

        return authService.refreshToken().pipe(

          switchMap((response) => {

            const retry = req.clone({

              setHeaders: {

                Authorization: `Bearer ${response.data.accessToken}`

              }

            });

            return next(retry);

          }),

          catchError(() => {

            authService.clearSession();

            router.navigate(['/login']);

            return throwError(() => error);

          })

        );

      }

      return throwError(() => error);

    })

  );

};
