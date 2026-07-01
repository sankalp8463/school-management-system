import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageClassesComponent } from './manage-classes/manage-classes.component';

const routes: Routes = [
  { path: 'classes', component: ManageClassesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicsRoutingModule { }