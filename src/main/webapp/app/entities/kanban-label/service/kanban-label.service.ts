import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKanbanLabel, NewKanbanLabel } from '../kanban-label.model';

export type PartialUpdateKanbanLabel = Partial<IKanbanLabel> & Pick<IKanbanLabel, 'id'>;

export type EntityResponseType = HttpResponse<IKanbanLabel>;
export type EntityArrayResponseType = HttpResponse<IKanbanLabel[]>;

@Injectable({ providedIn: 'root' })
export class KanbanLabelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/kanban-labels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(kanbanLabel: NewKanbanLabel): Observable<EntityResponseType> {
    return this.http.post<IKanbanLabel>(this.resourceUrl, kanbanLabel, { observe: 'response' });
  }

  update(kanbanLabel: IKanbanLabel): Observable<EntityResponseType> {
    return this.http.put<IKanbanLabel>(`${this.resourceUrl}/${this.getKanbanLabelIdentifier(kanbanLabel)}`, kanbanLabel, {
      observe: 'response',
    });
  }

  partialUpdate(kanbanLabel: PartialUpdateKanbanLabel): Observable<EntityResponseType> {
    return this.http.patch<IKanbanLabel>(`${this.resourceUrl}/${this.getKanbanLabelIdentifier(kanbanLabel)}`, kanbanLabel, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IKanbanLabel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IKanbanLabel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getKanbanLabelIdentifier(kanbanLabel: Pick<IKanbanLabel, 'id'>): number {
    return kanbanLabel.id;
  }

  compareKanbanLabel(o1: Pick<IKanbanLabel, 'id'> | null, o2: Pick<IKanbanLabel, 'id'> | null): boolean {
    return o1 && o2 ? this.getKanbanLabelIdentifier(o1) === this.getKanbanLabelIdentifier(o2) : o1 === o2;
  }

  addKanbanLabelToCollectionIfMissing<Type extends Pick<IKanbanLabel, 'id'>>(
    kanbanLabelCollection: Type[],
    ...kanbanLabelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const kanbanLabels: Type[] = kanbanLabelsToCheck.filter(isPresent);
    if (kanbanLabels.length > 0) {
      const kanbanLabelCollectionIdentifiers = kanbanLabelCollection.map(
        kanbanLabelItem => this.getKanbanLabelIdentifier(kanbanLabelItem)!
      );
      const kanbanLabelsToAdd = kanbanLabels.filter(kanbanLabelItem => {
        const kanbanLabelIdentifier = this.getKanbanLabelIdentifier(kanbanLabelItem);
        if (kanbanLabelCollectionIdentifiers.includes(kanbanLabelIdentifier)) {
          return false;
        }
        kanbanLabelCollectionIdentifiers.push(kanbanLabelIdentifier);
        return true;
      });
      return [...kanbanLabelsToAdd, ...kanbanLabelCollection];
    }
    return kanbanLabelCollection;
  }
}
