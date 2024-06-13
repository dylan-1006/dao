import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKanbanTaskComment } from '../kanban-task-comment.model';

@Component({
  selector: 'jhi-kanban-task-comment-detail',
  templateUrl: './kanban-task-comment-detail.component.html',
})
export class KanbanTaskCommentDetailComponent implements OnInit {
  kanbanTaskComment: IKanbanTaskComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kanbanTaskComment }) => {
      this.kanbanTaskComment = kanbanTaskComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
