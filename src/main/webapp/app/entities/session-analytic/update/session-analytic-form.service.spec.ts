import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../session-analytic.test-samples';

import { SessionAnalyticFormService } from './session-analytic-form.service';

describe('SessionAnalytic Form Service', () => {
  let service: SessionAnalyticFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionAnalyticFormService);
  });

  describe('Service methods', () => {
    describe('createSessionAnalyticFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSessionAnalyticFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sessionDuration: expect.any(Object),
            taskTotal: expect.any(Object),
            taskCompleted: expect.any(Object),
            pointsGained: expect.any(Object),
            numOfPomodoroFinished: expect.any(Object),
            praiseCount: expect.any(Object),
            user: expect.any(Object),
            allTimeUserAnalytics: expect.any(Object),
          })
        );
      });

      it('passing ISessionAnalytic should create a new form with FormGroup', () => {
        const formGroup = service.createSessionAnalyticFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sessionDuration: expect.any(Object),
            taskTotal: expect.any(Object),
            taskCompleted: expect.any(Object),
            pointsGained: expect.any(Object),
            numOfPomodoroFinished: expect.any(Object),
            praiseCount: expect.any(Object),
            user: expect.any(Object),
            allTimeUserAnalytics: expect.any(Object),
          })
        );
      });
    });

    describe('getSessionAnalytic', () => {
      it('should return NewSessionAnalytic for default SessionAnalytic initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSessionAnalyticFormGroup(sampleWithNewData);

        const sessionAnalytic = service.getSessionAnalytic(formGroup) as any;

        expect(sessionAnalytic).toMatchObject(sampleWithNewData);
      });

      it('should return NewSessionAnalytic for empty SessionAnalytic initial value', () => {
        const formGroup = service.createSessionAnalyticFormGroup();

        const sessionAnalytic = service.getSessionAnalytic(formGroup) as any;

        expect(sessionAnalytic).toMatchObject({});
      });

      it('should return ISessionAnalytic', () => {
        const formGroup = service.createSessionAnalyticFormGroup(sampleWithRequiredData);

        const sessionAnalytic = service.getSessionAnalytic(formGroup) as any;

        expect(sessionAnalytic).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISessionAnalytic should not enable id FormControl', () => {
        const formGroup = service.createSessionAnalyticFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSessionAnalytic should disable id FormControl', () => {
        const formGroup = service.createSessionAnalyticFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
