import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKanbanLabel } from '../kanban-label.model';

@Component({
  selector: 'jhi-kanban-label-detail',
  templateUrl: './kanban-label-detail.component.html',
})
export class KanbanLabelDetailComponent implements OnInit {
  kanbanLabel: IKanbanLabel | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kanbanLabel }) => {
      this.kanbanLabel = kanbanLabel;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
