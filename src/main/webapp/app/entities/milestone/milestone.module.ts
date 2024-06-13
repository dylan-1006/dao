import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MilestoneComponent } from './list/milestone.component';
import { MilestoneDetailComponent } from './detail/milestone-detail.component';
import { MilestoneUpdateComponent } from './update/milestone-update.component';
import { MilestoneDeleteDialogComponent } from './delete/milestone-delete-dialog.component';
import { MilestoneRoutingModule } from './route/milestone-routing.module';

@NgModule({
  imports: [SharedModule, MilestoneRoutingModule],
  declarations: [MilestoneComponent, MilestoneDetailComponent, MilestoneUpdateComponent, MilestoneDeleteDialogComponent],
})
export class MilestoneModule {}
