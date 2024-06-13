import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKanbanBoard, NewKanbanBoard } from '../kanban-board.model';

export type PartialUpdateKanbanBoard = Partial<IKanbanBoard> & Pick<IKanbanBoard, 'id'>;

export type EntityResponseType = HttpResponse<IKanbanBoard>;
export type EntityArrayResponseType = HttpResponse<IKanbanBoard[]>;

@Injectable({ providedIn: 'root' })
export class KanbanBoardService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/kanban-boards');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(kanbanBoard: NewKanbanBoard): Observable<EntityResponseType> {
    return this.http.post<IKanbanBoard>(this.resourceUrl, kanbanBoard, { observe: 'response' });
  }

  update(kanbanBoard: IKanbanBoard): Observable<EntityResponseType> {
    return this.http.put<IKanbanBoard>(`${this.resourceUrl}/${this.getKanbanBoardIdentifier(kanbanBoard)}`, kanbanBoard, {
      observe: 'response',
    });
  }

  partialUpdate(kanbanBoard: PartialUpdateKanbanBoard): Observable<EntityResponseType> {
    return this.http.patch<IKanbanBoard>(`${this.resourceUrl}/${this.getKanbanBoardIdentifier(kanbanBoard)}`, kanbanBoard, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IKanbanBoard>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IKanbanBoard[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getKanbanBoardIdentifier(kanbanBoard: Pick<IKanbanBoard, 'id'>): number {
    return kanbanBoard.id;
  }

  compareKanbanBoard(o1: Pick<IKanbanBoard, 'id'> | null, o2: Pick<IKanbanBoard, 'id'> | null): boolean {
    return o1 && o2 ? this.getKanbanBoardIdentifier(o1) === this.getKanbanBoardIdentifier(o2) : o1 === o2;
  }

  addKanbanBoardToCollectionIfMissing<Type extends Pick<IKanbanBoard, 'id'>>(
    kanbanBoardCollection: Type[],
    ...kanbanBoardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const kanbanBoards: Type[] = kanbanBoardsToCheck.filter(isPresent);
    if (kanbanBoards.length > 0) {
      const kanbanBoardCollectionIdentifiers = kanbanBoardCollection.map(
        kanbanBoardItem => this.getKanbanBoardIdentifier(kanbanBoardItem)!
      );
      const kanbanBoardsToAdd = kanbanBoards.filter(kanbanBoardItem => {
        const kanbanBoardIdentifier = this.getKanbanBoardIdentifier(kanbanBoardItem);
        if (kanbanBoardCollectionIdentifiers.includes(kanbanBoardIdentifier)) {
          return false;
        }
        kanbanBoardCollectionIdentifiers.push(kanbanBoardIdentifier);
        return true;
      });
      return [...kanbanBoardsToAdd, ...kanbanBoardCollection];
    }
    return kanbanBoardCollection;
  }
}
