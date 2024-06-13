import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPraise } from '../praise.model';
import { PraiseService } from '../service/praise.service';

@Injectable({ providedIn: 'root' })
export class PraiseRoutingResolveService implements Resolve<IPraise | null> {
  constructor(protected service: PraiseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPraise | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((praise: HttpResponse<IPraise>) => {
          if (praise.body) {
            return of(praise.body);
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
