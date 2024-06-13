import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKanbanTaskComment, NewKanbanTaskComment } from '../kanban-task-comment.model';

export type PartialUpdateKanbanTaskComment = Partial<IKanbanTaskComment> & Pick<IKanbanTaskComment, 'id'>;

type RestOf<T extends IKanbanTaskComment | NewKanbanTaskComment> = Omit<T, 'timeStamp'> & {
  timeStamp?: string | null;
};

export type RestKanbanTaskComment = RestOf<IKanbanTaskComment>;

export type NewRestKanbanTaskComment = RestOf<NewKanbanTaskComment>;

export type PartialUpdateRestKanbanTaskComment = RestOf<PartialUpdateKanbanTaskComment>;

export type EntityResponseType = HttpResponse<IKanbanTaskComment>;
export type EntityArrayResponseType = HttpResponse<IKanbanTaskComment[]>;

@Injectable({ providedIn: 'root' })
export class KanbanTaskCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/kanban-task-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(kanbanTaskComment: NewKanbanTaskComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kanbanTaskComment);
    return this.http
      .post<RestKanbanTaskComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(kanbanTaskComment: IKanbanTaskComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kanbanTaskComment);
    return this.http
      .put<RestKanbanTaskComment>(`${this.resourceUrl}/${this.getKanbanTaskCommentIdentifier(kanbanTaskComment)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(kanbanTaskComment: PartialUpdateKanbanTaskComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kanbanTaskComment);
    return this.http
      .patch<RestKanbanTaskComment>(`${this.resourceUrl}/${this.getKanbanTaskCommentIdentifier(kanbanTaskComment)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestKanbanTaskComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestKanbanTaskComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getKanbanTaskCommentIdentifier(kanbanTaskComment: Pick<IKanbanTaskComment, 'id'>): number {
    return kanbanTaskComment.id;
  }

  compareKanbanTaskComment(o1: Pick<IKanbanTaskComment, 'id'> | null, o2: Pick<IKanbanTaskComment, 'id'> | null): boolean {
    return o1 && o2 ? this.getKanbanTaskCommentIdentifier(o1) === this.getKanbanTaskCommentIdentifier(o2) : o1 === o2;
  }

  addKanbanTaskCommentToCollectionIfMissing<Type extends Pick<IKanbanTaskComment, 'id'>>(
    kanbanTaskCommentCollection: Type[],
    ...kanbanTaskCommentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const kanbanTaskComments: Type[] = kanbanTaskCommentsToCheck.filter(isPresent);
    if (kanbanTaskComments.length > 0) {
      const kanbanTaskCommentCollectionIdentifiers = kanbanTaskCommentCollection.map(
        kanbanTaskCommentItem => this.getKanbanTaskCommentIdentifier(kanbanTaskCommentItem)!
      );
      const kanbanTaskCommentsToAdd = kanbanTaskComments.filter(kanbanTaskCommentItem => {
        const kanbanTaskCommentIdentifier = this.getKanbanTaskCommentIdentifier(kanbanTaskCommentItem);
        if (kanbanTaskCommentCollectionIdentifiers.includes(kanbanTaskCommentIdentifier)) {
          return false;
        }
        kanbanTaskCommentCollectionIdentifiers.push(kanbanTaskCommentIdentifier);
        return true;
      });
      return [...kanbanTaskCommentsToAdd, ...kanbanTaskCommentCollection];
    }
    return kanbanTaskCommentCollection;
  }

  protected convertDateFromClient<T extends IKanbanTaskComment | NewKanbanTaskComment | PartialUpdateKanbanTaskComment>(
    kanbanTaskComment: T
  ): RestOf<T> {
    return {
      ...kanbanTaskComment,
      timeStamp: kanbanTaskComment.timeStamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restKanbanTaskComment: RestKanbanTaskComment): IKanbanTaskComment {
    return {
      ...restKanbanTaskComment,
      timeStamp: restKanbanTaskComment.timeStamp ? dayjs(restKanbanTaskComment.timeStamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestKanbanTaskComment>): HttpResponse<IKanbanTaskComment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestKanbanTaskComment[]>): HttpResponse<IKanbanTaskComment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
