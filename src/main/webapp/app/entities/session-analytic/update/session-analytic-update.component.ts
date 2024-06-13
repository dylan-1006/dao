import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SessionAnalyticFormService, SessionAnalyticFormGroup } from './session-analytic-form.service';
import { ISessionAnalytic } from '../session-analytic.model';
import { SessionAnalyticService } from '../service/session-analytic.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { IAllTimeUserAnalytics } from 'app/entities/all-time-user-analytics/all-time-user-analytics.model';
import { AllTimeUserAnalyticsService } from 'app/entities/all-time-user-analytics/service/all-time-user-analytics.service';

@Component({
  selector: 'jhi-session-analytic-update',
  templateUrl: './session-analytic-update.component.html',
})
export class SessionAnalyticUpdateComponent implements OnInit {
  isSaving = false;
  sessionAnalytic: ISessionAnalytic | null = null;

  applicationUsersSharedCollection: IApplicationUser[] = [];
  allTimeUserAnalyticsSharedCollection: IAllTimeUserAnalytics[] = [];

  editForm: SessionAnalyticFormGroup = this.sessionAnalyticFormService.createSessionAnalyticFormGroup();

  constructor(
    protected sessionAnalyticService: SessionAnalyticService,
    protected sessionAnalyticFormService: SessionAnalyticFormService,
    protected applicationUserService: ApplicationUserService,
    protected allTimeUserAnalyticsService: AllTimeUserAnalyticsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  compareAllTimeUserAnalytics = (o1: IAllTimeUserAnalytics | null, o2: IAllTimeUserAnalytics | null): boolean =>
    this.allTimeUserAnalyticsService.compareAllTimeUserAnalytics(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sessionAnalytic }) => {
      this.sessionAnalytic = sessionAnalytic;
      if (sessionAnalytic) {
        this.updateForm(sessionAnalytic);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sessionAnalytic = this.sessionAnalyticFormService.getSessionAnalytic(this.editForm);
    if (sessionAnalytic.id !== null) {
      this.subscribeToSaveResponse(this.sessionAnalyticService.update(sessionAnalytic));
    } else {
      this.subscribeToSaveResponse(this.sessionAnalyticService.create(sessionAnalytic));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISessionAnalytic>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(sessionAnalytic: ISessionAnalytic): void {
    this.sessionAnalytic = sessionAnalytic;
    this.sessionAnalyticFormService.resetForm(this.editForm, sessionAnalytic);

    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      sessionAnalytic.user
    );
    this.allTimeUserAnalyticsSharedCollection =
      this.allTimeUserAnalyticsService.addAllTimeUserAnalyticsToCollectionIfMissing<IAllTimeUserAnalytics>(
        this.allTimeUserAnalyticsSharedCollection,
        sessionAnalytic.allTimeUserAnalytics
      );
  }

  protected loadRelationshipsOptions(): void {
    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
            applicationUsers,
            this.sessionAnalytic?.user
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.allTimeUserAnalyticsService
      .query()
      .pipe(map((res: HttpResponse<IAllTimeUserAnalytics[]>) => res.body ?? []))
      .pipe(
        map((allTimeUserAnalytics: IAllTimeUserAnalytics[]) =>
          this.allTimeUserAnalyticsService.addAllTimeUserAnalyticsToCollectionIfMissing<IAllTimeUserAnalytics>(
            allTimeUserAnalytics,
            this.sessionAnalytic?.allTimeUserAnalytics
          )
        )
      )
      .subscribe((allTimeUserAnalytics: IAllTimeUserAnalytics[]) => (this.allTimeUserAnalyticsSharedCollection = allTimeUserAnalytics));
  }
}
