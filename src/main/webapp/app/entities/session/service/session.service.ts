import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISession, NewSession } from '../session.model';

export type PartialUpdateSession = Partial<ISession> & Pick<ISession, 'id'>;

type RestOf<T extends ISession | NewSession> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

export type RestSession = RestOf<ISession>;

export type NewRestSession = RestOf<NewSession>;

export type PartialUpdateRestSession = RestOf<PartialUpdateSession>;

export type EntityResponseType = HttpResponse<ISession>;
export type EntityArrayResponseType = HttpResponse<ISession[]>;

@Injectable({ providedIn: 'root' })
export class SessionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sessions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(session: NewSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(session);
    return this.http
      .post<RestSession>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(session: ISession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(session);
    return this.http
      .put<RestSession>(`${this.resourceUrl}/${this.getSessionIdentifier(session)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(session: PartialUpdateSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(session);
    return this.http
      .patch<RestSession>(`${this.resourceUrl}/${this.getSessionIdentifier(session)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSession>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSession[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSessionIdentifier(session: Pick<ISession, 'id'>): number {
    return session.id;
  }

  compareSession(o1: Pick<ISession, 'id'> | null, o2: Pick<ISession, 'id'> | null): boolean {
    return o1 && o2 ? this.getSessionIdentifier(o1) === this.getSessionIdentifier(o2) : o1 === o2;
  }

  addSessionToCollectionIfMissing<Type extends Pick<ISession, 'id'>>(
    sessionCollection: Type[],
    ...sessionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sessions: Type[] = sessionsToCheck.filter(isPresent);
    if (sessions.length > 0) {
      const sessionCollectionIdentifiers = sessionCollection.map(sessionItem => this.getSessionIdentifier(sessionItem)!);
      const sessionsToAdd = sessions.filter(sessionItem => {
        const sessionIdentifier = this.getSessionIdentifier(sessionItem);
        if (sessionCollectionIdentifiers.includes(sessionIdentifier)) {
          return false;
        }
        sessionCollectionIdentifiers.push(sessionIdentifier);
        return true;
      });
      return [...sessionsToAdd, ...sessionCollection];
    }
    return sessionCollection;
  }

  protected convertDateFromClient<T extends ISession | NewSession | PartialUpdateSession>(session: T): RestOf<T> {
    return {
      ...session,
      startTime: session.startTime?.toJSON() ?? null,
      endTime: session.endTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSession: RestSession): ISession {
    return {
      ...restSession,
      startTime: restSession.startTime ? dayjs(restSession.startTime) : undefined,
      endTime: restSession.endTime ? dayjs(restSession.endTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSession>): HttpResponse<ISession> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSession[]>): HttpResponse<ISession[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
