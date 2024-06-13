import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKanbanBoard } from '../kanban-board.model';
import { KanbanBoardService } from '../service/kanban-board.service';

@Injectable({ providedIn: 'root' })
export class KanbanBoardRoutingResolveService implements Resolve<IKanbanBoard | null> {
  constructor(protected service: KanbanBoardService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKanbanBoard | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((kanbanBoard: HttpResponse<IKanbanBoard>) => {
          if (kanbanBoard.body) {
            return of(kanbanBoard.body);
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
