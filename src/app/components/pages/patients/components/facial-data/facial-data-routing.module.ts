import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FacialDataComponent } from './facial-data.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FacialDataComponent }
	])],
	exports: [RouterModule]
})
export class FacialDataRoutingModule { }
