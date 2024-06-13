import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SessionAnalyticComponent } from './list/session-analytic.component';
import { SessionAnalyticDetailComponent } from './detail/session-analytic-detail.component';
import { SessionAnalyticUpdateComponent } from './update/session-analytic-update.component';
import { SessionAnalyticDeleteDialogComponent } from './delete/session-analytic-delete-dialog.component';
import { SessionAnalyticRoutingModule } from './route/session-analytic-routing.module';

@NgModule({
  imports: [SharedModule, SessionAnalyticRoutingModule],
  declarations: [
    SessionAnalyticComponent,
    SessionAnalyticDetailComponent,
    SessionAnalyticUpdateComponent,
    SessionAnalyticDeleteDialogComponent,
  ],
})
export class SessionAnalyticModule {}
