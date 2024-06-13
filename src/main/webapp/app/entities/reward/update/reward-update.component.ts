import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RewardFormService, RewardFormGroup } from './reward-form.service';
import { IReward } from '../reward.model';
import { RewardService } from '../service/reward.service';
import { IMilestone } from 'app/entities/milestone/milestone.model';
import { MilestoneService } from 'app/entities/milestone/service/milestone.service';

@Component({
  selector: 'jhi-reward-update',
  templateUrl: './reward-update.component.html',
})
export class RewardUpdateComponent implements OnInit {
  isSaving = false;
  reward: IReward | null = null;

  milestonesSharedCollection: IMilestone[] = [];

  editForm: RewardFormGroup = this.rewardFormService.createRewardFormGroup();

  constructor(
    protected rewardService: RewardService,
    protected rewardFormService: RewardFormService,
    protected milestoneService: MilestoneService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMilestone = (o1: IMilestone | null, o2: IMilestone | null): boolean => this.milestoneService.compareMilestone(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reward }) => {
      this.reward = reward;
      if (reward) {
        this.updateForm(reward);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reward = this.rewardFormService.getReward(this.editForm);
    if (reward.id !== null) {
      this.subscribeToSaveResponse(this.rewardService.update(reward));
    } else {
      this.subscribeToSaveResponse(this.rewardService.create(reward));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReward>>): void {
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

  protected updateForm(reward: IReward): void {
    this.reward = reward;
    this.rewardFormService.resetForm(this.editForm, reward);

    this.milestonesSharedCollection = this.milestoneService.addMilestoneToCollectionIfMissing<IMilestone>(
      this.milestonesSharedCollection,
      reward.milestone
    );
  }

  protected loadRelationshipsOptions(): void {
    this.milestoneService
      .query()
      .pipe(map((res: HttpResponse<IMilestone[]>) => res.body ?? []))
      .pipe(
        map((milestones: IMilestone[]) =>
          this.milestoneService.addMilestoneToCollectionIfMissing<IMilestone>(milestones, this.reward?.milestone)
        )
      )
      .subscribe((milestones: IMilestone[]) => (this.milestonesSharedCollection = milestones));
  }
}
