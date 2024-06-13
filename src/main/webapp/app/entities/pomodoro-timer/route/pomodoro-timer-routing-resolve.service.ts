import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPomodoroTimer } from '../pomodoro-timer.model';
import { PomodoroTimerService } from '../service/pomodoro-timer.service';

@Injectable({ providedIn: 'root' })
export class PomodoroTimerRoutingResolveService implements Resolve<IPomodoroTimer | null> {
  constructor(protected service: PomodoroTimerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPomodoroTimer | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pomodoroTimer: HttpResponse<IPomodoroTimer>) => {
          if (pomodoroTimer.body) {
            return of(pomodoroTimer.body);
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
