import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKanbanBoard } from '../kanban-board.model';

@Component({
  selector: 'jhi-kanban-board-detail',
  templateUrl: './kanban-board-detail.component.html',
})
export class KanbanBoardDetailComponent implements OnInit {
  kanbanBoard: IKanbanBoard | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kanbanBoard }) => {
      this.kanbanBoard = kanbanBoard;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
