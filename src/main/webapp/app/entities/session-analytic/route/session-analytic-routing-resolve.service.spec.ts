import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISessionAnalytic } from '../session-analytic.model';
import { SessionAnalyticService } from '../service/session-analytic.service';

import { SessionAnalyticRoutingResolveService } from './session-analytic-routing-resolve.service';

describe('SessionAnalytic routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SessionAnalyticRoutingResolveService;
  let service: SessionAnalyticService;
  let resultSessionAnalytic: ISessionAnalytic | null | undefined;

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
    routingResolveService = TestBed.inject(SessionAnalyticRoutingResolveService);
    service = TestBed.inject(SessionAnalyticService);
    resultSessionAnalytic = undefined;
  });

  describe('resolve', () => {
    it('should return ISessionAnalytic returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSessionAnalytic = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSessionAnalytic).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSessionAnalytic = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSessionAnalytic).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ISessionAnalytic>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSessionAnalytic = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSessionAnalytic).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
