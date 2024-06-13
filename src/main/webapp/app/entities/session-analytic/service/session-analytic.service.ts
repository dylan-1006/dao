import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISessionAnalytic, NewSessionAnalytic } from '../session-analytic.model';

export type PartialUpdateSessionAnalytic = Partial<ISessionAnalytic> & Pick<ISessionAnalytic, 'id'>;

export type EntityResponseType = HttpResponse<ISessionAnalytic>;
export type EntityArrayResponseType = HttpResponse<ISessionAnalytic[]>;

@Injectable({ providedIn: 'root' })
export class SessionAnalyticService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/session-analytics');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sessionAnalytic: NewSessionAnalytic): Observable<EntityResponseType> {
    return this.http.post<ISessionAnalytic>(this.resourceUrl, sessionAnalytic, { observe: 'response' });
  }

  update(sessionAnalytic: ISessionAnalytic): Observable<EntityResponseType> {
    return this.http.put<ISessionAnalytic>(`${this.resourceUrl}/${this.getSessionAnalyticIdentifier(sessionAnalytic)}`, sessionAnalytic, {
      observe: 'response',
    });
  }

  partialUpdate(sessionAnalytic: PartialUpdateSessionAnalytic): Observable<EntityResponseType> {
    return this.http.patch<ISessionAnalytic>(`${this.resourceUrl}/${this.getSessionAnalyticIdentifier(sessionAnalytic)}`, sessionAnalytic, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISessionAnalytic>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISessionAnalytic[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSessionAnalyticIdentifier(sessionAnalytic: Pick<ISessionAnalytic, 'id'>): number {
    return sessionAnalytic.id;
  }

  compareSessionAnalytic(o1: Pick<ISessionAnalytic, 'id'> | null, o2: Pick<ISessionAnalytic, 'id'> | null): boolean {
    return o1 && o2 ? this.getSessionAnalyticIdentifier(o1) === this.getSessionAnalyticIdentifier(o2) : o1 === o2;
  }

  addSessionAnalyticToCollectionIfMissing<Type extends Pick<ISessionAnalytic, 'id'>>(
    sessionAnalyticCollection: Type[],
    ...sessionAnalyticsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sessionAnalytics: Type[] = sessionAnalyticsToCheck.filter(isPresent);
    if (sessionAnalytics.length > 0) {
      const sessionAnalyticCollectionIdentifiers = sessionAnalyticCollection.map(
        sessionAnalyticItem => this.getSessionAnalyticIdentifier(sessionAnalyticItem)!
      );
      const sessionAnalyticsToAdd = sessionAnalytics.filter(sessionAnalyticItem => {
        const sessionAnalyticIdentifier = this.getSessionAnalyticIdentifier(sessionAnalyticItem);
        if (sessionAnalyticCollectionIdentifiers.includes(sessionAnalyticIdentifier)) {
          return false;
        }
        sessionAnalyticCollectionIdentifiers.push(sessionAnalyticIdentifier);
        return true;
      });
      return [...sessionAnalyticsToAdd, ...sessionAnalyticCollection];
    }
    return sessionAnalyticCollection;
  }
}
