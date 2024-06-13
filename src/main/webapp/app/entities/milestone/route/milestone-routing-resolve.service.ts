import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMilestone } from '../milestone.model';
import { MilestoneService } from '../service/milestone.service';

@Injectable({ providedIn: 'root' })
export class MilestoneRoutingResolveService implements Resolve<IMilestone | null> {
  constructor(protected service: MilestoneService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMilestone | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((milestone: HttpResponse<IMilestone>) => {
          if (milestone.body) {
            return of(milestone.body);
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
