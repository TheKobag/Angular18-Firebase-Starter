import { Routes } from '@angular/router';
import { isLoggedInGuard } from './core/auth/is-logged-in.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./login/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
