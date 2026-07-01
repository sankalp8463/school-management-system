import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { USER_ROLES } from './users/constants';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.module').then((m) => m.StudentModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [USER_ROLES.STUDENT] },
  },
  {
    path: 'parent',
    loadChildren: () => import('./parent/parent.module').then((m) => m.ParentModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [USER_ROLES.PARENT] },
  },
  {
    path: 'staff',
    loadChildren: () => import('./staff/staff.module').then((m) => m.StaffModule),
    canActivate: [AuthGuard], // More specific role guards can be inside the module
  },
  {
    path: 'academics',
    loadChildren: () => import('./academics/academics.module').then((m) => m.AcademicsModule),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/auth/login' } // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}