import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConsultationDataComponent } from './consultation-data.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ConsultationDataComponent }
	])],
	exports: [RouterModule]
})
export class ConsultationDataRoutingModule { }
