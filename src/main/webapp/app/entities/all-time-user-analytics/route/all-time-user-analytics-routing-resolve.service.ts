import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAllTimeUserAnalytics } from '../all-time-user-analytics.model';
import { AllTimeUserAnalyticsService } from '../service/all-time-user-analytics.service';

@Injectable({ providedIn: 'root' })
export class AllTimeUserAnalyticsRoutingResolveService implements Resolve<IAllTimeUserAnalytics | null> {
  constructor(protected service: AllTimeUserAnalyticsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAllTimeUserAnalytics | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((allTimeUserAnalytics: HttpResponse<IAllTimeUserAnalytics>) => {
          if (allTimeUserAnalytics.body) {
            return of(allTimeUserAnalytics.body);
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
