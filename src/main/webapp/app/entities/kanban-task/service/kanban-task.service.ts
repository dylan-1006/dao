import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKanbanTask, NewKanbanTask } from '../kanban-task.model';

export type PartialUpdateKanbanTask = Partial<IKanbanTask> & Pick<IKanbanTask, 'id'>;

type RestOf<T extends IKanbanTask | NewKanbanTask> = Omit<T, 'dueDate'> & {
  dueDate?: string | null;
};

export type RestKanbanTask = RestOf<IKanbanTask>;

export type NewRestKanbanTask = RestOf<NewKanbanTask>;

export type PartialUpdateRestKanbanTask = RestOf<PartialUpdateKanbanTask>;

export type EntityResponseType = HttpResponse<IKanbanTask>;
export type EntityArrayResponseType = HttpResponse<IKanbanTask[]>;

@Injectable({ providedIn: 'root' })
export class KanbanTaskService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/kanban-tasks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(kanbanTask: NewKanbanTask): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kanbanTask);
    return this.http
      .post<RestKanbanTask>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(kanbanTask: IKanbanTask): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kanbanTask);
    return this.http
      .put<RestKanbanTask>(`${this.resourceUrl}/${this.getKanbanTaskIdentifier(kanbanTask)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(kanbanTask: PartialUpdateKanbanTask): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kanbanTask);
    return this.http
      .patch<RestKanbanTask>(`${this.resourceUrl}/${this.getKanbanTaskIdentifier(kanbanTask)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestKanbanTask>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestKanbanTask[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getKanbanTaskIdentifier(kanbanTask: Pick<IKanbanTask, 'id'>): number {
    return kanbanTask.id;
  }

  compareKanbanTask(o1: Pick<IKanbanTask, 'id'> | null, o2: Pick<IKanbanTask, 'id'> | null): boolean {
    return o1 && o2 ? this.getKanbanTaskIdentifier(o1) === this.getKanbanTaskIdentifier(o2) : o1 === o2;
  }

  addKanbanTaskToCollectionIfMissing<Type extends Pick<IKanbanTask, 'id'>>(
    kanbanTaskCollection: Type[],
    ...kanbanTasksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const kanbanTasks: Type[] = kanbanTasksToCheck.filter(isPresent);
    if (kanbanTasks.length > 0) {
      const kanbanTaskCollectionIdentifiers = kanbanTaskCollection.map(kanbanTaskItem => this.getKanbanTaskIdentifier(kanbanTaskItem)!);
      const kanbanTasksToAdd = kanbanTasks.filter(kanbanTaskItem => {
        const kanbanTaskIdentifier = this.getKanbanTaskIdentifier(kanbanTaskItem);
        if (kanbanTaskCollectionIdentifiers.includes(kanbanTaskIdentifier)) {
          return false;
        }
        kanbanTaskCollectionIdentifiers.push(kanbanTaskIdentifier);
        return true;
      });
      return [...kanbanTasksToAdd, ...kanbanTaskCollection];
    }
    return kanbanTaskCollection;
  }

  protected convertDateFromClient<T extends IKanbanTask | NewKanbanTask | PartialUpdateKanbanTask>(kanbanTask: T): RestOf<T> {
    return {
      ...kanbanTask,
      dueDate: kanbanTask.dueDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restKanbanTask: RestKanbanTask): IKanbanTask {
    return {
      ...restKanbanTask,
      dueDate: restKanbanTask.dueDate ? dayjs(restKanbanTask.dueDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestKanbanTask>): HttpResponse<IKanbanTask> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestKanbanTask[]>): HttpResponse<IKanbanTask[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
