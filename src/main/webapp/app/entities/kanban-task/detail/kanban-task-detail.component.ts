import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKanbanTask } from '../kanban-task.model';

@Component({
  selector: 'jhi-kanban-task-detail',
  templateUrl: './kanban-task-detail.component.html',
})
export class KanbanTaskDetailComponent implements OnInit {
  kanbanTask: IKanbanTask | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kanbanTask }) => {
      this.kanbanTask = kanbanTask;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
