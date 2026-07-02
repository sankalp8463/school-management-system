import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { StudentsComponent } from './students/students.component';
import { ParentsComponent } from './parents/parents.component';
import { EmployeesComponent } from './employees/employees.component';
import { ClassesComponent } from './classes/classes.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { ExamsComponent } from './exams/exams.component';
import { ResultsComponent } from './results/results.component';
import { FeesComponent } from './fees/fees.component';
import { TransportComponent } from './transport/transport.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admissions', component: AdmissionsComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'parents', component: ParentsComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'assignments', component: AssignmentsComponent },
  { path: 'exams', component: ExamsComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'fees', component: FeesComponent },
  { path: 'transport', component: TransportComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent }
];
