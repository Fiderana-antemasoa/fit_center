import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Membres } from './pages/membres/membres';
import { Abonnements } from './pages/abonnements/abonnements';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard
  },
  {
    path: 'membres',
    component: Membres
  },
  {
    path: 'abonnements',
    component: Abonnements
  },
  {
    path: '**',
    redirectTo: ''
  }
];