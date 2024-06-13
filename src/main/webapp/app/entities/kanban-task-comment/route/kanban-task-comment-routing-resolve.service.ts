import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKanbanTaskComment } from '../kanban-task-comment.model';
import { KanbanTaskCommentService } from '../service/kanban-task-comment.service';

@Injectable({ providedIn: 'root' })
export class KanbanTaskCommentRoutingResolveService implements Resolve<IKanbanTaskComment | null> {
  constructor(protected service: KanbanTaskCommentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKanbanTaskComment | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((kanbanTaskComment: HttpResponse<IKanbanTaskComment>) => {
          if (kanbanTaskComment.body) {
            return of(kanbanTaskComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
