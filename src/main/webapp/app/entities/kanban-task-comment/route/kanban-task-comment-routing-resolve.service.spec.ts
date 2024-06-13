import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IKanbanTaskComment } from '../kanban-task-comment.model';
import { KanbanTaskCommentService } from '../service/kanban-task-comment.service';

import { KanbanTaskCommentRoutingResolveService } from './kanban-task-comment-routing-resolve.service';

describe('KanbanTaskComment routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: KanbanTaskCommentRoutingResolveService;
  let service: KanbanTaskCommentService;
  let resultKanbanTaskComment: IKanbanTaskComment | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(KanbanTaskCommentRoutingResolveService);
    service = TestBed.inject(KanbanTaskCommentService);
    resultKanbanTaskComment = undefined;
  });

  describe('resolve', () => {
    it('should return IKanbanTaskComment returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultKanbanTaskComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultKanbanTaskComment).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultKanbanTaskComment = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultKanbanTaskComment).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IKanbanTaskComment>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultKanbanTaskComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultKanbanTaskComment).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
