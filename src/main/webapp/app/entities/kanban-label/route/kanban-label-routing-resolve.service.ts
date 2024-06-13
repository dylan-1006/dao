import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKanbanLabel } from '../kanban-label.model';
import { KanbanLabelService } from '../service/kanban-label.service';

@Injectable({ providedIn: 'root' })
export class KanbanLabelRoutingResolveService implements Resolve<IKanbanLabel | null> {
  constructor(protected service: KanbanLabelService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKanbanLabel | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((kanbanLabel: HttpResponse<IKanbanLabel>) => {
          if (kanbanLabel.body) {
            return of(kanbanLabel.body);
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
