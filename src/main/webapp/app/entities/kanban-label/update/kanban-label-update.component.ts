import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { KanbanLabelFormService, KanbanLabelFormGroup } from './kanban-label-form.service';
import { IKanbanLabel } from '../kanban-label.model';
import { KanbanLabelService } from '../service/kanban-label.service';
import { IKanbanBoard } from 'app/entities/kanban-board/kanban-board.model';
import { KanbanBoardService } from 'app/entities/kanban-board/service/kanban-board.service';

@Component({
  selector: 'jhi-kanban-label-update',
  templateUrl: './kanban-label-update.component.html',
})
export class KanbanLabelUpdateComponent implements OnInit {
  isSaving = false;
  kanbanLabel: IKanbanLabel | null = null;

  kanbanBoardsSharedCollection: IKanbanBoard[] = [];

  editForm: KanbanLabelFormGroup = this.kanbanLabelFormService.createKanbanLabelFormGroup();

  constructor(
    protected kanbanLabelService: KanbanLabelService,
    protected kanbanLabelFormService: KanbanLabelFormService,
    protected kanbanBoardService: KanbanBoardService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareKanbanBoard = (o1: IKanbanBoard | null, o2: IKanbanBoard | null): boolean => this.kanbanBoardService.compareKanbanBoard(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kanbanLabel }) => {
      this.kanbanLabel = kanbanLabel;
      if (kanbanLabel) {
        this.updateForm(kanbanLabel);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const kanbanLabel = this.kanbanLabelFormService.getKanbanLabel(this.editForm);
    if (kanbanLabel.id !== null) {
      this.subscribeToSaveResponse(this.kanbanLabelService.update(kanbanLabel));
    } else {
      this.subscribeToSaveResponse(this.kanbanLabelService.create(kanbanLabel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKanbanLabel>>): void {
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

  protected updateForm(kanbanLabel: IKanbanLabel): void {
    this.kanbanLabel = kanbanLabel;
    this.kanbanLabelFormService.resetForm(this.editForm, kanbanLabel);

    this.kanbanBoardsSharedCollection = this.kanbanBoardService.addKanbanBoardToCollectionIfMissing<IKanbanBoard>(
      this.kanbanBoardsSharedCollection,
      ...(kanbanLabel.boards ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.kanbanBoardService
      .query()
      .pipe(map((res: HttpResponse<IKanbanBoard[]>) => res.body ?? []))
      .pipe(
        map((kanbanBoards: IKanbanBoard[]) =>
          this.kanbanBoardService.addKanbanBoardToCollectionIfMissing<IKanbanBoard>(kanbanBoards, ...(this.kanbanLabel?.boards ?? []))
        )
      )
      .subscribe((kanbanBoards: IKanbanBoard[]) => (this.kanbanBoardsSharedCollection = kanbanBoards));
  }
}
