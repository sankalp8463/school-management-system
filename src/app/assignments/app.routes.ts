import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'staff',
        loadChildren: () => import('./staff/staff.routes').then(m => m.STAFF_ROUTES)
      },
      {
        path: 'student',
        loadChildren: () => import('./student/student.routes').then(m => m.STUDENT_ROUTES)
      },
      {
        path: 'parent',
        loadChildren: () => import('./parent/parent.routes').then(m => m.PARENT_ROUTES)
      },
      {
        path: 'academics',
        loadChildren: () => import('./academics/academics.routes').then(m => m.ACADEMICS_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
