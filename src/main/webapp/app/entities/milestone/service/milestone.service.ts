import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMilestone, NewMilestone } from '../milestone.model';

export type PartialUpdateMilestone = Partial<IMilestone> & Pick<IMilestone, 'id'>;

export type EntityResponseType = HttpResponse<IMilestone>;
export type EntityArrayResponseType = HttpResponse<IMilestone[]>;

@Injectable({ providedIn: 'root' })
export class MilestoneService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/milestones');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(milestone: NewMilestone): Observable<EntityResponseType> {
    return this.http.post<IMilestone>(this.resourceUrl, milestone, { observe: 'response' });
  }

  update(milestone: IMilestone): Observable<EntityResponseType> {
    return this.http.put<IMilestone>(`${this.resourceUrl}/${this.getMilestoneIdentifier(milestone)}`, milestone, { observe: 'response' });
  }

  partialUpdate(milestone: PartialUpdateMilestone): Observable<EntityResponseType> {
    return this.http.patch<IMilestone>(`${this.resourceUrl}/${this.getMilestoneIdentifier(milestone)}`, milestone, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMilestone>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMilestone[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMilestoneIdentifier(milestone: Pick<IMilestone, 'id'>): number {
    return milestone.id;
  }

  compareMilestone(o1: Pick<IMilestone, 'id'> | null, o2: Pick<IMilestone, 'id'> | null): boolean {
    return o1 && o2 ? this.getMilestoneIdentifier(o1) === this.getMilestoneIdentifier(o2) : o1 === o2;
  }

  addMilestoneToCollectionIfMissing<Type extends Pick<IMilestone, 'id'>>(
    milestoneCollection: Type[],
    ...milestonesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const milestones: Type[] = milestonesToCheck.filter(isPresent);
    if (milestones.length > 0) {
      const milestoneCollectionIdentifiers = milestoneCollection.map(milestoneItem => this.getMilestoneIdentifier(milestoneItem)!);
      const milestonesToAdd = milestones.filter(milestoneItem => {
        const milestoneIdentifier = this.getMilestoneIdentifier(milestoneItem);
        if (milestoneCollectionIdentifiers.includes(milestoneIdentifier)) {
          return false;
        }
        milestoneCollectionIdentifiers.push(milestoneIdentifier);
        return true;
      });
      return [...milestonesToAdd, ...milestoneCollection];
    }
    return milestoneCollection;
  }
}
