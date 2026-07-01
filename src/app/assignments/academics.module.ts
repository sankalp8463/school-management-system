import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademicsRoutingModule } from './academics-routing.module';
import { ManageClassesComponent } from './manage-classes/manage-classes.component';

@NgModule({
  declarations: [ManageClassesComponent],
  imports: [CommonModule, AcademicsRoutingModule],
})
export class AcademicsModule {}