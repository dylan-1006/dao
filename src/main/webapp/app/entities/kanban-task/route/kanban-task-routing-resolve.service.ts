import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKanbanTask } from '../kanban-task.model';
import { KanbanTaskService } from '../service/kanban-task.service';

@Injectable({ providedIn: 'root' })
export class KanbanTaskRoutingResolveService implements Resolve<IKanbanTask | null> {
  constructor(protected service: KanbanTaskService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKanbanTask | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((kanbanTask: HttpResponse<IKanbanTask>) => {
          if (kanbanTask.body) {
            return of(kanbanTask.body);
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
