import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { KanbanBoardFormService, KanbanBoardFormGroup } from './kanban-board-form.service';
import { IKanbanBoard } from '../kanban-board.model';
import { KanbanBoardService } from '../service/kanban-board.service';

@Component({
  selector: 'jhi-kanban-board-update',
  templateUrl: './kanban-board-update.component.html',
})
export class KanbanBoardUpdateComponent implements OnInit {
  isSaving = false;
  kanbanBoard: IKanbanBoard | null = null;

  editForm: KanbanBoardFormGroup = this.kanbanBoardFormService.createKanbanBoardFormGroup();

  constructor(
    protected kanbanBoardService: KanbanBoardService,
    protected kanbanBoardFormService: KanbanBoardFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kanbanBoard }) => {
      this.kanbanBoard = kanbanBoard;
      if (kanbanBoard) {
        this.updateForm(kanbanBoard);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const kanbanBoard = this.kanbanBoardFormService.getKanbanBoard(this.editForm);
    if (kanbanBoard.id !== null) {
      this.subscribeToSaveResponse(this.kanbanBoardService.update(kanbanBoard));
    } else {
      this.subscribeToSaveResponse(this.kanbanBoardService.create(kanbanBoard));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKanbanBoard>>): void {
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

  protected updateForm(kanbanBoard: IKanbanBoard): void {
    this.kanbanBoard = kanbanBoard;
    this.kanbanBoardFormService.resetForm(this.editForm, kanbanBoard);
  }
}
