import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MilestoneFormService, MilestoneFormGroup } from './milestone-form.service';
import { IMilestone } from '../milestone.model';
import { MilestoneService } from '../service/milestone.service';

@Component({
  selector: 'jhi-milestone-update',
  templateUrl: './milestone-update.component.html',
})
export class MilestoneUpdateComponent implements OnInit {
  isSaving = false;
  milestone: IMilestone | null = null;

  editForm: MilestoneFormGroup = this.milestoneFormService.createMilestoneFormGroup();

  constructor(
    protected milestoneService: MilestoneService,
    protected milestoneFormService: MilestoneFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ milestone }) => {
      this.milestone = milestone;
      if (milestone) {
        this.updateForm(milestone);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const milestone = this.milestoneFormService.getMilestone(this.editForm);
    if (milestone.id !== null) {
      this.subscribeToSaveResponse(this.milestoneService.update(milestone));
    } else {
      this.subscribeToSaveResponse(this.milestoneService.create(milestone));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMilestone>>): void {
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

  protected updateForm(milestone: IMilestone): void {
    this.milestone = milestone;
    this.milestoneFormService.resetForm(this.editForm, milestone);
  }
}
