import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DrawImageComponent } from './draw-image.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DrawImageComponent }
	])],
	exports: [RouterModule]
})
export class DrawImageRoutingModule { }
