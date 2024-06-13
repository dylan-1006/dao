import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AllTimeUserAnalyticsComponent } from './list/all-time-user-analytics.component';
import { AllTimeUserAnalyticsDetailComponent } from './detail/all-time-user-analytics-detail.component';
import { AllTimeUserAnalyticsUpdateComponent } from './update/all-time-user-analytics-update.component';
import { AllTimeUserAnalyticsDeleteDialogComponent } from './delete/all-time-user-analytics-delete-dialog.component';
import { AllTimeUserAnalyticsRoutingModule } from './route/all-time-user-analytics-routing.module';

@NgModule({
  imports: [SharedModule, AllTimeUserAnalyticsRoutingModule],
  declarations: [
    AllTimeUserAnalyticsComponent,
    AllTimeUserAnalyticsDetailComponent,
    AllTimeUserAnalyticsUpdateComponent,
    AllTimeUserAnalyticsDeleteDialogComponent,
  ],
})
export class AllTimeUserAnalyticsModule {}
