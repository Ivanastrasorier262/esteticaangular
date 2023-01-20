import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CorporalDataComponent } from './corporal-data.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CorporalDataComponent }
	])],
	exports: [RouterModule]
})
export class CorporalDataRoutingModule { }
