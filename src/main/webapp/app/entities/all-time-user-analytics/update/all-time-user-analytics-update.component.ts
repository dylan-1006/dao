import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AllTimeUserAnalyticsFormService, AllTimeUserAnalyticsFormGroup } from './all-time-user-analytics-form.service';
import { IAllTimeUserAnalytics } from '../all-time-user-analytics.model';
import { AllTimeUserAnalyticsService } from '../service/all-time-user-analytics.service';

@Component({
  selector: 'jhi-all-time-user-analytics-update',
  templateUrl: './all-time-user-analytics-update.component.html',
})
export class AllTimeUserAnalyticsUpdateComponent implements OnInit {
  isSaving = false;
  allTimeUserAnalytics: IAllTimeUserAnalytics | null = null;

  editForm: AllTimeUserAnalyticsFormGroup = this.allTimeUserAnalyticsFormService.createAllTimeUserAnalyticsFormGroup();

  constructor(
    protected allTimeUserAnalyticsService: AllTimeUserAnalyticsService,
    protected allTimeUserAnalyticsFormService: AllTimeUserAnalyticsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ allTimeUserAnalytics }) => {
      this.allTimeUserAnalytics = allTimeUserAnalytics;
      if (allTimeUserAnalytics) {
        this.updateForm(allTimeUserAnalytics);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const allTimeUserAnalytics = this.allTimeUserAnalyticsFormService.getAllTimeUserAnalytics(this.editForm);
    if (allTimeUserAnalytics.id !== null) {
      this.subscribeToSaveResponse(this.allTimeUserAnalyticsService.update(allTimeUserAnalytics));
    } else {
      this.subscribeToSaveResponse(this.allTimeUserAnalyticsService.create(allTimeUserAnalytics));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAllTimeUserAnalytics>>): void {
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

  protected updateForm(allTimeUserAnalytics: IAllTimeUserAnalytics): void {
    this.allTimeUserAnalytics = allTimeUserAnalytics;
    this.allTimeUserAnalyticsFormService.resetForm(this.editForm, allTimeUserAnalytics);
  }
}
