import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPraise, NewPraise } from '../praise.model';

export type PartialUpdatePraise = Partial<IPraise> & Pick<IPraise, 'id'>;

export type EntityResponseType = HttpResponse<IPraise>;
export type EntityArrayResponseType = HttpResponse<IPraise[]>;

@Injectable({ providedIn: 'root' })
export class PraiseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/praises');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(praise: NewPraise): Observable<EntityResponseType> {
    return this.http.post<IPraise>(this.resourceUrl, praise, { observe: 'response' });
  }

  update(praise: IPraise): Observable<EntityResponseType> {
    return this.http.put<IPraise>(`${this.resourceUrl}/${this.getPraiseIdentifier(praise)}`, praise, { observe: 'response' });
  }

  partialUpdate(praise: PartialUpdatePraise): Observable<EntityResponseType> {
    return this.http.patch<IPraise>(`${this.resourceUrl}/${this.getPraiseIdentifier(praise)}`, praise, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPraise>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPraise[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPraiseIdentifier(praise: Pick<IPraise, 'id'>): number {
    return praise.id;
  }

  comparePraise(o1: Pick<IPraise, 'id'> | null, o2: Pick<IPraise, 'id'> | null): boolean {
    return o1 && o2 ? this.getPraiseIdentifier(o1) === this.getPraiseIdentifier(o2) : o1 === o2;
  }

  addPraiseToCollectionIfMissing<Type extends Pick<IPraise, 'id'>>(
    praiseCollection: Type[],
    ...praisesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const praises: Type[] = praisesToCheck.filter(isPresent);
    if (praises.length > 0) {
      const praiseCollectionIdentifiers = praiseCollection.map(praiseItem => this.getPraiseIdentifier(praiseItem)!);
      const praisesToAdd = praises.filter(praiseItem => {
        const praiseIdentifier = this.getPraiseIdentifier(praiseItem);
        if (praiseCollectionIdentifiers.includes(praiseIdentifier)) {
          return false;
        }
        praiseCollectionIdentifiers.push(praiseIdentifier);
        return true;
      });
      return [...praisesToAdd, ...praiseCollection];
    }
    return praiseCollection;
  }
}
