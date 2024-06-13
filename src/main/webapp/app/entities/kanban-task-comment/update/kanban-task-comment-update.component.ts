import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { KanbanTaskCommentFormService, KanbanTaskCommentFormGroup } from './kanban-task-comment-form.service';
import { IKanbanTaskComment } from '../kanban-task-comment.model';
import { KanbanTaskCommentService } from '../service/kanban-task-comment.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { IKanbanTask } from 'app/entities/kanban-task/kanban-task.model';
import { KanbanTaskService } from 'app/entities/kanban-task/service/kanban-task.service';

@Component({
  selector: 'jhi-kanban-task-comment-update',
  templateUrl: './kanban-task-comment-update.component.html',
})
export class KanbanTaskCommentUpdateComponent implements OnInit {
  isSaving = false;
  kanbanTaskComment: IKanbanTaskComment | null = null;

  applicationUsersSharedCollection: IApplicationUser[] = [];
  kanbanTasksSharedCollection: IKanbanTask[] = [];

  editForm: KanbanTaskCommentFormGroup = this.kanbanTaskCommentFormService.createKanbanTaskCommentFormGroup();

  constructor(
    protected kanbanTaskCommentService: KanbanTaskCommentService,
    protected kanbanTaskCommentFormService: KanbanTaskCommentFormService,
    protected applicationUserService: ApplicationUserService,
    protected kanbanTaskService: KanbanTaskService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  compareKanbanTask = (o1: IKanbanTask | null, o2: IKanbanTask | null): boolean => this.kanbanTaskService.compareKanbanTask(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kanbanTaskComment }) => {
      this.kanbanTaskComment = kanbanTaskComment;
      if (kanbanTaskComment) {
        this.updateForm(kanbanTaskComment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const kanbanTaskComment = this.kanbanTaskCommentFormService.getKanbanTaskComment(this.editForm);
    if (kanbanTaskComment.id !== null) {
      this.subscribeToSaveResponse(this.kanbanTaskCommentService.update(kanbanTaskComment));
    } else {
      this.subscribeToSaveResponse(this.kanbanTaskCommentService.create(kanbanTaskComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKanbanTaskComment>>): void {
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

  protected updateForm(kanbanTaskComment: IKanbanTaskComment): void {
    this.kanbanTaskComment = kanbanTaskComment;
    this.kanbanTaskCommentFormService.resetForm(this.editForm, kanbanTaskComment);

    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      kanbanTaskComment.author
    );
    this.kanbanTasksSharedCollection = this.kanbanTaskService.addKanbanTaskToCollectionIfMissing<IKanbanTask>(
      this.kanbanTasksSharedCollection,
      kanbanTaskComment.kanbanTask
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
            this.kanbanTaskComment?.author
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.kanbanTaskService
      .query()
      .pipe(map((res: HttpResponse<IKanbanTask[]>) => res.body ?? []))
      .pipe(
        map((kanbanTasks: IKanbanTask[]) =>
          this.kanbanTaskService.addKanbanTaskToCollectionIfMissing<IKanbanTask>(kanbanTasks, this.kanbanTaskComment?.kanbanTask)
        )
      )
      .subscribe((kanbanTasks: IKanbanTask[]) => (this.kanbanTasksSharedCollection = kanbanTasks));
  }
}
