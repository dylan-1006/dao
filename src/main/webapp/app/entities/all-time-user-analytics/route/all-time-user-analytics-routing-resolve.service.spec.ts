import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAllTimeUserAnalytics } from '../all-time-user-analytics.model';
import { AllTimeUserAnalyticsService } from '../service/all-time-user-analytics.service';

import { AllTimeUserAnalyticsRoutingResolveService } from './all-time-user-analytics-routing-resolve.service';

describe('AllTimeUserAnalytics routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AllTimeUserAnalyticsRoutingResolveService;
  let service: AllTimeUserAnalyticsService;
  let resultAllTimeUserAnalytics: IAllTimeUserAnalytics | null | undefined;

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
    routingResolveService = TestBed.inject(AllTimeUserAnalyticsRoutingResolveService);
    service = TestBed.inject(AllTimeUserAnalyticsService);
    resultAllTimeUserAnalytics = undefined;
  });

  describe('resolve', () => {
    it('should return IAllTimeUserAnalytics returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAllTimeUserAnalytics = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAllTimeUserAnalytics).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAllTimeUserAnalytics = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAllTimeUserAnalytics).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IAllTimeUserAnalytics>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAllTimeUserAnalytics = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAllTimeUserAnalytics).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
