import { Route } from '@angular/router';
import { registerRoutes } from 'src/app/auth/auth.routes';

export const appRoutes: Route[] = [
  {
    path: 'register',
    loadChildren: () =>
      import('src/app/auth/auth.routes').then((m) => registerRoutes),
  },
];
