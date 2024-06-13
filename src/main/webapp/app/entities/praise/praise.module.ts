import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PraiseComponent } from './list/praise.component';
import { PraiseDetailComponent } from './detail/praise-detail.component';
import { PraiseUpdateComponent } from './update/praise-update.component';
import { PraiseDeleteDialogComponent } from './delete/praise-delete-dialog.component';
import { PraiseRoutingModule } from './route/praise-routing.module';

@NgModule({
  imports: [SharedModule, PraiseRoutingModule],
  declarations: [PraiseComponent, PraiseDetailComponent, PraiseUpdateComponent, PraiseDeleteDialogComponent],
})
export class PraiseModule {}
