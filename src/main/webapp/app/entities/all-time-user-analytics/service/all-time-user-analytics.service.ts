import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAllTimeUserAnalytics, NewAllTimeUserAnalytics } from '../all-time-user-analytics.model';

export type PartialUpdateAllTimeUserAnalytics = Partial<IAllTimeUserAnalytics> & Pick<IAllTimeUserAnalytics, 'id'>;

type RestOf<T extends IAllTimeUserAnalytics | NewAllTimeUserAnalytics> = Omit<T, 'mostFocusedPeriod'> & {
  mostFocusedPeriod?: string | null;
};

export type RestAllTimeUserAnalytics = RestOf<IAllTimeUserAnalytics>;

export type NewRestAllTimeUserAnalytics = RestOf<NewAllTimeUserAnalytics>;

export type PartialUpdateRestAllTimeUserAnalytics = RestOf<PartialUpdateAllTimeUserAnalytics>;

export type EntityResponseType = HttpResponse<IAllTimeUserAnalytics>;
export type EntityArrayResponseType = HttpResponse<IAllTimeUserAnalytics[]>;

@Injectable({ providedIn: 'root' })
export class AllTimeUserAnalyticsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/all-time-user-analytics');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(allTimeUserAnalytics: NewAllTimeUserAnalytics): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(allTimeUserAnalytics);
    return this.http
      .post<RestAllTimeUserAnalytics>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(allTimeUserAnalytics: IAllTimeUserAnalytics): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(allTimeUserAnalytics);
    return this.http
      .put<RestAllTimeUserAnalytics>(`${this.resourceUrl}/${this.getAllTimeUserAnalyticsIdentifier(allTimeUserAnalytics)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(allTimeUserAnalytics: PartialUpdateAllTimeUserAnalytics): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(allTimeUserAnalytics);
    return this.http
      .patch<RestAllTimeUserAnalytics>(`${this.resourceUrl}/${this.getAllTimeUserAnalyticsIdentifier(allTimeUserAnalytics)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAllTimeUserAnalytics>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAllTimeUserAnalytics[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAllTimeUserAnalyticsIdentifier(allTimeUserAnalytics: Pick<IAllTimeUserAnalytics, 'id'>): number {
    return allTimeUserAnalytics.id;
  }

  compareAllTimeUserAnalytics(o1: Pick<IAllTimeUserAnalytics, 'id'> | null, o2: Pick<IAllTimeUserAnalytics, 'id'> | null): boolean {
    return o1 && o2 ? this.getAllTimeUserAnalyticsIdentifier(o1) === this.getAllTimeUserAnalyticsIdentifier(o2) : o1 === o2;
  }

  addAllTimeUserAnalyticsToCollectionIfMissing<Type extends Pick<IAllTimeUserAnalytics, 'id'>>(
    allTimeUserAnalyticsCollection: Type[],
    ...allTimeUserAnalyticsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const allTimeUserAnalytics: Type[] = allTimeUserAnalyticsToCheck.filter(isPresent);
    if (allTimeUserAnalytics.length > 0) {
      const allTimeUserAnalyticsCollectionIdentifiers = allTimeUserAnalyticsCollection.map(
        allTimeUserAnalyticsItem => this.getAllTimeUserAnalyticsIdentifier(allTimeUserAnalyticsItem)!
      );
      const allTimeUserAnalyticsToAdd = allTimeUserAnalytics.filter(allTimeUserAnalyticsItem => {
        const allTimeUserAnalyticsIdentifier = this.getAllTimeUserAnalyticsIdentifier(allTimeUserAnalyticsItem);
        if (allTimeUserAnalyticsCollectionIdentifiers.includes(allTimeUserAnalyticsIdentifier)) {
          return false;
        }
        allTimeUserAnalyticsCollectionIdentifiers.push(allTimeUserAnalyticsIdentifier);
        return true;
      });
      return [...allTimeUserAnalyticsToAdd, ...allTimeUserAnalyticsCollection];
    }
    return allTimeUserAnalyticsCollection;
  }

  protected convertDateFromClient<T extends IAllTimeUserAnalytics | NewAllTimeUserAnalytics | PartialUpdateAllTimeUserAnalytics>(
    allTimeUserAnalytics: T
  ): RestOf<T> {
    return {
      ...allTimeUserAnalytics,
      mostFocusedPeriod: allTimeUserAnalytics.mostFocusedPeriod?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAllTimeUserAnalytics: RestAllTimeUserAnalytics): IAllTimeUserAnalytics {
    return {
      ...restAllTimeUserAnalytics,
      mostFocusedPeriod: restAllTimeUserAnalytics.mostFocusedPeriod ? dayjs(restAllTimeUserAnalytics.mostFocusedPeriod) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAllTimeUserAnalytics>): HttpResponse<IAllTimeUserAnalytics> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAllTimeUserAnalytics[]>): HttpResponse<IAllTimeUserAnalytics[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
