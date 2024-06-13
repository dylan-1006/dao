import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SessionAnalyticFormService } from './session-analytic-form.service';
import { SessionAnalyticService } from '../service/session-analytic.service';
import { ISessionAnalytic } from '../session-analytic.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { IAllTimeUserAnalytics } from 'app/entities/all-time-user-analytics/all-time-user-analytics.model';
import { AllTimeUserAnalyticsService } from 'app/entities/all-time-user-analytics/service/all-time-user-analytics.service';

import { SessionAnalyticUpdateComponent } from './session-analytic-update.component';

describe('SessionAnalytic Management Update Component', () => {
  let comp: SessionAnalyticUpdateComponent;
  let fixture: ComponentFixture<SessionAnalyticUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sessionAnalyticFormService: SessionAnalyticFormService;
  let sessionAnalyticService: SessionAnalyticService;
  let applicationUserService: ApplicationUserService;
  let allTimeUserAnalyticsService: AllTimeUserAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SessionAnalyticUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SessionAnalyticUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SessionAnalyticUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sessionAnalyticFormService = TestBed.inject(SessionAnalyticFormService);
    sessionAnalyticService = TestBed.inject(SessionAnalyticService);
    applicationUserService = TestBed.inject(ApplicationUserService);
    allTimeUserAnalyticsService = TestBed.inject(AllTimeUserAnalyticsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUser query and add missing value', () => {
      const sessionAnalytic: ISessionAnalytic = { id: 456 };
      const user: IApplicationUser = { id: 85237 };
      sessionAnalytic.user = user;

      const applicationUserCollection: IApplicationUser[] = [{ id: 67358 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [user];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sessionAnalytic });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AllTimeUserAnalytics query and add missing value', () => {
      const sessionAnalytic: ISessionAnalytic = { id: 456 };
      const allTimeUserAnalytics: IAllTimeUserAnalytics = { id: 55433 };
      sessionAnalytic.allTimeUserAnalytics = allTimeUserAnalytics;

      const allTimeUserAnalyticsCollection: IAllTimeUserAnalytics[] = [{ id: 18815 }];
      jest.spyOn(allTimeUserAnalyticsService, 'query').mockReturnValue(of(new HttpResponse({ body: allTimeUserAnalyticsCollection })));
      const additionalAllTimeUserAnalytics = [allTimeUserAnalytics];
      const expectedCollection: IAllTimeUserAnalytics[] = [...additionalAllTimeUserAnalytics, ...allTimeUserAnalyticsCollection];
      jest.spyOn(allTimeUserAnalyticsService, 'addAllTimeUserAnalyticsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sessionAnalytic });
      comp.ngOnInit();

      expect(allTimeUserAnalyticsService.query).toHaveBeenCalled();
      expect(allTimeUserAnalyticsService.addAllTimeUserAnalyticsToCollectionIfMissing).toHaveBeenCalledWith(
        allTimeUserAnalyticsCollection,
        ...additionalAllTimeUserAnalytics.map(expect.objectContaining)
      );
      expect(comp.allTimeUserAnalyticsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sessionAnalytic: ISessionAnalytic = { id: 456 };
      const user: IApplicationUser = { id: 78650 };
      sessionAnalytic.user = user;
      const allTimeUserAnalytics: IAllTimeUserAnalytics = { id: 25356 };
      sessionAnalytic.allTimeUserAnalytics = allTimeUserAnalytics;

      activatedRoute.data = of({ sessionAnalytic });
      comp.ngOnInit();

      expect(comp.applicationUsersSharedCollection).toContain(user);
      expect(comp.allTimeUserAnalyticsSharedCollection).toContain(allTimeUserAnalytics);
      expect(comp.sessionAnalytic).toEqual(sessionAnalytic);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISessionAnalytic>>();
      const sessionAnalytic = { id: 123 };
      jest.spyOn(sessionAnalyticFormService, 'getSessionAnalytic').mockReturnValue(sessionAnalytic);
      jest.spyOn(sessionAnalyticService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sessionAnalytic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sessionAnalytic }));
      saveSubject.complete();

      // THEN
      expect(sessionAnalyticFormService.getSessionAnalytic).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sessionAnalyticService.update).toHaveBeenCalledWith(expect.objectContaining(sessionAnalytic));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISessionAnalytic>>();
      const sessionAnalytic = { id: 123 };
      jest.spyOn(sessionAnalyticFormService, 'getSessionAnalytic').mockReturnValue({ id: null });
      jest.spyOn(sessionAnalyticService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sessionAnalytic: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sessionAnalytic }));
      saveSubject.complete();

      // THEN
      expect(sessionAnalyticFormService.getSessionAnalytic).toHaveBeenCalled();
      expect(sessionAnalyticService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISessionAnalytic>>();
      const sessionAnalytic = { id: 123 };
      jest.spyOn(sessionAnalyticService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sessionAnalytic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sessionAnalyticService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareApplicationUser', () => {
      it('Should forward to applicationUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicationUserService, 'compareApplicationUser');
        comp.compareApplicationUser(entity, entity2);
        expect(applicationUserService.compareApplicationUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAllTimeUserAnalytics', () => {
      it('Should forward to allTimeUserAnalyticsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(allTimeUserAnalyticsService, 'compareAllTimeUserAnalytics');
        comp.compareAllTimeUserAnalytics(entity, entity2);
        expect(allTimeUserAnalyticsService.compareAllTimeUserAnalytics).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
