import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPomodoroTimer, NewPomodoroTimer } from '../pomodoro-timer.model';

export type PartialUpdatePomodoroTimer = Partial<IPomodoroTimer> & Pick<IPomodoroTimer, 'id'>;

type RestOf<T extends IPomodoroTimer | NewPomodoroTimer> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

export type RestPomodoroTimer = RestOf<IPomodoroTimer>;

export type NewRestPomodoroTimer = RestOf<NewPomodoroTimer>;

export type PartialUpdateRestPomodoroTimer = RestOf<PartialUpdatePomodoroTimer>;

export type EntityResponseType = HttpResponse<IPomodoroTimer>;
export type EntityArrayResponseType = HttpResponse<IPomodoroTimer[]>;

@Injectable({ providedIn: 'root' })
export class PomodoroTimerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pomodoro-timers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pomodoroTimer: NewPomodoroTimer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pomodoroTimer);
    return this.http
      .post<RestPomodoroTimer>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pomodoroTimer: IPomodoroTimer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pomodoroTimer);
    return this.http
      .put<RestPomodoroTimer>(`${this.resourceUrl}/${this.getPomodoroTimerIdentifier(pomodoroTimer)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pomodoroTimer: PartialUpdatePomodoroTimer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pomodoroTimer);
    return this.http
      .patch<RestPomodoroTimer>(`${this.resourceUrl}/${this.getPomodoroTimerIdentifier(pomodoroTimer)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPomodoroTimer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPomodoroTimer[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPomodoroTimerIdentifier(pomodoroTimer: Pick<IPomodoroTimer, 'id'>): number {
    return pomodoroTimer.id;
  }

  comparePomodoroTimer(o1: Pick<IPomodoroTimer, 'id'> | null, o2: Pick<IPomodoroTimer, 'id'> | null): boolean {
    return o1 && o2 ? this.getPomodoroTimerIdentifier(o1) === this.getPomodoroTimerIdentifier(o2) : o1 === o2;
  }

  addPomodoroTimerToCollectionIfMissing<Type extends Pick<IPomodoroTimer, 'id'>>(
    pomodoroTimerCollection: Type[],
    ...pomodoroTimersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pomodoroTimers: Type[] = pomodoroTimersToCheck.filter(isPresent);
    if (pomodoroTimers.length > 0) {
      const pomodoroTimerCollectionIdentifiers = pomodoroTimerCollection.map(
        pomodoroTimerItem => this.getPomodoroTimerIdentifier(pomodoroTimerItem)!
      );
      const pomodoroTimersToAdd = pomodoroTimers.filter(pomodoroTimerItem => {
        const pomodoroTimerIdentifier = this.getPomodoroTimerIdentifier(pomodoroTimerItem);
        if (pomodoroTimerCollectionIdentifiers.includes(pomodoroTimerIdentifier)) {
          return false;
        }
        pomodoroTimerCollectionIdentifiers.push(pomodoroTimerIdentifier);
        return true;
      });
      return [...pomodoroTimersToAdd, ...pomodoroTimerCollection];
    }
    return pomodoroTimerCollection;
  }

  protected convertDateFromClient<T extends IPomodoroTimer | NewPomodoroTimer | PartialUpdatePomodoroTimer>(pomodoroTimer: T): RestOf<T> {
    return {
      ...pomodoroTimer,
      startTime: pomodoroTimer.startTime?.toJSON() ?? null,
      endTime: pomodoroTimer.endTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPomodoroTimer: RestPomodoroTimer): IPomodoroTimer {
    return {
      ...restPomodoroTimer,
      startTime: restPomodoroTimer.startTime ? dayjs(restPomodoroTimer.startTime) : undefined,
      endTime: restPomodoroTimer.endTime ? dayjs(restPomodoroTimer.endTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPomodoroTimer>): HttpResponse<IPomodoroTimer> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPomodoroTimer[]>): HttpResponse<IPomodoroTimer[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
