import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISessionAnalytic } from '../session-analytic.model';
import { SessionAnalyticService } from '../service/session-analytic.service';

@Injectable({ providedIn: 'root' })
export class SessionAnalyticRoutingResolveService implements Resolve<ISessionAnalytic | null> {
  constructor(protected service: SessionAnalyticService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISessionAnalytic | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sessionAnalytic: HttpResponse<ISessionAnalytic>) => {
          if (sessionAnalytic.body) {
            return of(sessionAnalytic.body);
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
