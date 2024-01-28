import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import { authActions } from './actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PersistantService } from 'src/app/shared/services/persistant.service';
import { Router } from '@angular/router';

// for all action types consider only authAction.register and return the response from api
export const registerEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    persistantService = inject(PersistantService)
  ) => {
    // listen to all actions
    return actions$.pipe(
      // only consider authAction.register
      ofType(authActions.register),
      // return value
      switchMap(({ request }) => {
        // call api return currentUser or error
        return authService.register(request).pipe(
          map((currentUser: CurrentUserInterface) => {
            persistantService.set('accessToken', currentUser.token);
            return authActions.registerSuccess({ currentUser });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              authActions.registerFailure({
                errors: errorResponse.error.errors,
              })
            );
          })
        );
      })
    );
  },
  { functional: true }
);

export const redirectAfterRegisterSuccess = createEffect(
  (actions$ = inject(Actions), router$ = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.registerSuccess),
      tap(() => {
        router$.navigateByUrl('/');
      })
    );
  },
  { functional: true }
);
