import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ApplicationUserFormService, ApplicationUserFormGroup } from './application-user-form.service';
import { IApplicationUser } from '../application-user.model';
import { ApplicationUserService } from '../service/application-user.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IAllTimeUserAnalytics } from 'app/entities/all-time-user-analytics/all-time-user-analytics.model';
import { AllTimeUserAnalyticsService } from 'app/entities/all-time-user-analytics/service/all-time-user-analytics.service';
import { IMilestone } from 'app/entities/milestone/milestone.model';
import { MilestoneService } from 'app/entities/milestone/service/milestone.service';
import { IKanbanTask } from 'app/entities/kanban-task/kanban-task.model';
import { KanbanTaskService } from 'app/entities/kanban-task/service/kanban-task.service';
import { ISession } from 'app/entities/session/session.model';
import { SessionService } from 'app/entities/session/service/session.service';

@Component({
  selector: 'jhi-application-user-update',
  templateUrl: './application-user-update.component.html',
})
export class ApplicationUserUpdateComponent implements OnInit {
  isSaving = false;
  applicationUser: IApplicationUser | null = null;

  usersSharedCollection: IUser[] = [];
  allTimeAnalyticsCollection: IAllTimeUserAnalytics[] = [];
  milestonesSharedCollection: IMilestone[] = [];
  kanbanTasksSharedCollection: IKanbanTask[] = [];
  sessionsSharedCollection: ISession[] = [];

  editForm: ApplicationUserFormGroup = this.applicationUserFormService.createApplicationUserFormGroup();

  constructor(
    protected applicationUserService: ApplicationUserService,
    protected applicationUserFormService: ApplicationUserFormService,
    protected userService: UserService,
    protected allTimeUserAnalyticsService: AllTimeUserAnalyticsService,
    protected milestoneService: MilestoneService,
    protected kanbanTaskService: KanbanTaskService,
    protected sessionService: SessionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareAllTimeUserAnalytics = (o1: IAllTimeUserAnalytics | null, o2: IAllTimeUserAnalytics | null): boolean =>
    this.allTimeUserAnalyticsService.compareAllTimeUserAnalytics(o1, o2);

  compareMilestone = (o1: IMilestone | null, o2: IMilestone | null): boolean => this.milestoneService.compareMilestone(o1, o2);

  compareKanbanTask = (o1: IKanbanTask | null, o2: IKanbanTask | null): boolean => this.kanbanTaskService.compareKanbanTask(o1, o2);

  compareSession = (o1: ISession | null, o2: ISession | null): boolean => this.sessionService.compareSession(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUser }) => {
      this.applicationUser = applicationUser;
      if (applicationUser) {
        this.updateForm(applicationUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const applicationUser = this.applicationUserFormService.getApplicationUser(this.editForm);
    if (applicationUser.id !== null) {
      this.subscribeToSaveResponse(this.applicationUserService.update(applicationUser));
    } else {
      this.subscribeToSaveResponse(this.applicationUserService.create(applicationUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplicationUser>>): void {
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

  protected updateForm(applicationUser: IApplicationUser): void {
    this.applicationUser = applicationUser;
    this.applicationUserFormService.resetForm(this.editForm, applicationUser);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      applicationUser.internalUser
    );
    this.allTimeAnalyticsCollection = this.allTimeUserAnalyticsService.addAllTimeUserAnalyticsToCollectionIfMissing<IAllTimeUserAnalytics>(
      this.allTimeAnalyticsCollection,
      applicationUser.allTimeAnalytics
    );
    this.milestonesSharedCollection = this.milestoneService.addMilestoneToCollectionIfMissing<IMilestone>(
      this.milestonesSharedCollection,
      applicationUser.currentMilestone
    );
    this.kanbanTasksSharedCollection = this.kanbanTaskService.addKanbanTaskToCollectionIfMissing<IKanbanTask>(
      this.kanbanTasksSharedCollection,
      applicationUser.kanbanTask
    );
    this.sessionsSharedCollection = this.sessionService.addSessionToCollectionIfMissing<ISession>(
      this.sessionsSharedCollection,
      applicationUser.session
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.applicationUser?.internalUser)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.allTimeUserAnalyticsService
      .query({ filter: 'user-is-null' })
      .pipe(map((res: HttpResponse<IAllTimeUserAnalytics[]>) => res.body ?? []))
      .pipe(
        map((allTimeUserAnalytics: IAllTimeUserAnalytics[]) =>
          this.allTimeUserAnalyticsService.addAllTimeUserAnalyticsToCollectionIfMissing<IAllTimeUserAnalytics>(
            allTimeUserAnalytics,
            this.applicationUser?.allTimeAnalytics
          )
        )
      )
      .subscribe((allTimeUserAnalytics: IAllTimeUserAnalytics[]) => (this.allTimeAnalyticsCollection = allTimeUserAnalytics));

    this.milestoneService
      .query()
      .pipe(map((res: HttpResponse<IMilestone[]>) => res.body ?? []))
      .pipe(
        map((milestones: IMilestone[]) =>
          this.milestoneService.addMilestoneToCollectionIfMissing<IMilestone>(milestones, this.applicationUser?.currentMilestone)
        )
      )
      .subscribe((milestones: IMilestone[]) => (this.milestonesSharedCollection = milestones));

    this.kanbanTaskService
      .query()
      .pipe(map((res: HttpResponse<IKanbanTask[]>) => res.body ?? []))
      .pipe(
        map((kanbanTasks: IKanbanTask[]) =>
          this.kanbanTaskService.addKanbanTaskToCollectionIfMissing<IKanbanTask>(kanbanTasks, this.applicationUser?.kanbanTask)
        )
      )
      .subscribe((kanbanTasks: IKanbanTask[]) => (this.kanbanTasksSharedCollection = kanbanTasks));

    this.sessionService
      .query()
      .pipe(map((res: HttpResponse<ISession[]>) => res.body ?? []))
      .pipe(
        map((sessions: ISession[]) =>
          this.sessionService.addSessionToCollectionIfMissing<ISession>(sessions, this.applicationUser?.session)
        )
      )
      .subscribe((sessions: ISession[]) => (this.sessionsSharedCollection = sessions));
  }
}
