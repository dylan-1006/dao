import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AllTimeUserAnalyticsFormService } from './all-time-user-analytics-form.service';
import { AllTimeUserAnalyticsService } from '../service/all-time-user-analytics.service';
import { IAllTimeUserAnalytics } from '../all-time-user-analytics.model';

import { AllTimeUserAnalyticsUpdateComponent } from './all-time-user-analytics-update.component';

describe('AllTimeUserAnalytics Management Update Component', () => {
  let comp: AllTimeUserAnalyticsUpdateComponent;
  let fixture: ComponentFixture<AllTimeUserAnalyticsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let allTimeUserAnalyticsFormService: AllTimeUserAnalyticsFormService;
  let allTimeUserAnalyticsService: AllTimeUserAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AllTimeUserAnalyticsUpdateComponent],
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
      .overrideTemplate(AllTimeUserAnalyticsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AllTimeUserAnalyticsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    allTimeUserAnalyticsFormService = TestBed.inject(AllTimeUserAnalyticsFormService);
    allTimeUserAnalyticsService = TestBed.inject(AllTimeUserAnalyticsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const allTimeUserAnalytics: IAllTimeUserAnalytics = { id: 456 };

      activatedRoute.data = of({ allTimeUserAnalytics });
      comp.ngOnInit();

      expect(comp.allTimeUserAnalytics).toEqual(allTimeUserAnalytics);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAllTimeUserAnalytics>>();
      const allTimeUserAnalytics = { id: 123 };
      jest.spyOn(allTimeUserAnalyticsFormService, 'getAllTimeUserAnalytics').mockReturnValue(allTimeUserAnalytics);
      jest.spyOn(allTimeUserAnalyticsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ allTimeUserAnalytics });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: allTimeUserAnalytics }));
      saveSubject.complete();

      // THEN
      expect(allTimeUserAnalyticsFormService.getAllTimeUserAnalytics).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(allTimeUserAnalyticsService.update).toHaveBeenCalledWith(expect.objectContaining(allTimeUserAnalytics));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAllTimeUserAnalytics>>();
      const allTimeUserAnalytics = { id: 123 };
      jest.spyOn(allTimeUserAnalyticsFormService, 'getAllTimeUserAnalytics').mockReturnValue({ id: null });
      jest.spyOn(allTimeUserAnalyticsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ allTimeUserAnalytics: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: allTimeUserAnalytics }));
      saveSubject.complete();

      // THEN
      expect(allTimeUserAnalyticsFormService.getAllTimeUserAnalytics).toHaveBeenCalled();
      expect(allTimeUserAnalyticsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAllTimeUserAnalytics>>();
      const allTimeUserAnalytics = { id: 123 };
      jest.spyOn(allTimeUserAnalyticsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ allTimeUserAnalytics });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(allTimeUserAnalyticsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
