import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { KanbanTaskFormService, KanbanTaskFormGroup } from './kanban-task-form.service';
import { IKanbanTask } from '../kanban-task.model';
import { KanbanTaskService } from '../service/kanban-task.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { IKanbanLabel } from 'app/entities/kanban-label/kanban-label.model';
import { KanbanLabelService } from 'app/entities/kanban-label/service/kanban-label.service';
import { IKanbanBoard } from 'app/entities/kanban-board/kanban-board.model';
import { KanbanBoardService } from 'app/entities/kanban-board/service/kanban-board.service';
import { TaskStatus } from 'app/entities/enumerations/task-status.model';

@Component({
  selector: 'jhi-kanban-task-update',
  templateUrl: './kanban-task-update.component.html',
})
export class KanbanTaskUpdateComponent implements OnInit {
  isSaving = false;
  kanbanTask: IKanbanTask | null = null;
  taskStatusValues = Object.keys(TaskStatus);

  applicationUsersSharedCollection: IApplicationUser[] = [];
  kanbanLabelsSharedCollection: IKanbanLabel[] = [];
  kanbanBoardsSharedCollection: IKanbanBoard[] = [];

  editForm: KanbanTaskFormGroup = this.kanbanTaskFormService.createKanbanTaskFormGroup();

  constructor(
    protected kanbanTaskService: KanbanTaskService,
    protected kanbanTaskFormService: KanbanTaskFormService,
    protected applicationUserService: ApplicationUserService,
    protected kanbanLabelService: KanbanLabelService,
    protected kanbanBoardService: KanbanBoardService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  compareKanbanLabel = (o1: IKanbanLabel | null, o2: IKanbanLabel | null): boolean => this.kanbanLabelService.compareKanbanLabel(o1, o2);

  compareKanbanBoard = (o1: IKanbanBoard | null, o2: IKanbanBoard | null): boolean => this.kanbanBoardService.compareKanbanBoard(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kanbanTask }) => {
      this.kanbanTask = kanbanTask;
      if (kanbanTask) {
        this.updateForm(kanbanTask);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const kanbanTask = this.kanbanTaskFormService.getKanbanTask(this.editForm);
    if (kanbanTask.id !== null) {
      this.subscribeToSaveResponse(this.kanbanTaskService.update(kanbanTask));
    } else {
      this.subscribeToSaveResponse(this.kanbanTaskService.create(kanbanTask));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKanbanTask>>): void {
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

  protected updateForm(kanbanTask: IKanbanTask): void {
    this.kanbanTask = kanbanTask;
    this.kanbanTaskFormService.resetForm(this.editForm, kanbanTask);

    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      kanbanTask.author
    );
    this.kanbanLabelsSharedCollection = this.kanbanLabelService.addKanbanLabelToCollectionIfMissing<IKanbanLabel>(
      this.kanbanLabelsSharedCollection,
      ...(kanbanTask.labels ?? [])
    );
    this.kanbanBoardsSharedCollection = this.kanbanBoardService.addKanbanBoardToCollectionIfMissing<IKanbanBoard>(
      this.kanbanBoardsSharedCollection,
      kanbanTask.kanbanBoard
    );
  }

  protected loadRelationshipsOptions(): void {
    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(applicationUsers, this.kanbanTask?.author)
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.kanbanLabelService
      .query()
      .pipe(map((res: HttpResponse<IKanbanLabel[]>) => res.body ?? []))
      .pipe(
        map((kanbanLabels: IKanbanLabel[]) =>
          this.kanbanLabelService.addKanbanLabelToCollectionIfMissing<IKanbanLabel>(kanbanLabels, ...(this.kanbanTask?.labels ?? []))
        )
      )
      .subscribe((kanbanLabels: IKanbanLabel[]) => (this.kanbanLabelsSharedCollection = kanbanLabels));

    this.kanbanBoardService
      .query()
      .pipe(map((res: HttpResponse<IKanbanBoard[]>) => res.body ?? []))
      .pipe(
        map((kanbanBoards: IKanbanBoard[]) =>
          this.kanbanBoardService.addKanbanBoardToCollectionIfMissing<IKanbanBoard>(kanbanBoards, this.kanbanTask?.kanbanBoard)
        )
      )
      .subscribe((kanbanBoards: IKanbanBoard[]) => (this.kanbanBoardsSharedCollection = kanbanBoards));
  }
}
