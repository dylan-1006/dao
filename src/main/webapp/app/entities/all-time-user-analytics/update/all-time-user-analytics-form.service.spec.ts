import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../all-time-user-analytics.test-samples';

import { AllTimeUserAnalyticsFormService } from './all-time-user-analytics-form.service';

describe('AllTimeUserAnalytics Form Service', () => {
  let service: AllTimeUserAnalyticsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllTimeUserAnalyticsFormService);
  });

  describe('Service methods', () => {
    describe('createAllTimeUserAnalyticsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAllTimeUserAnalyticsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalStudyTime: expect.any(Object),
            totalPomodoroSession: expect.any(Object),
            dailyStreaks: expect.any(Object),
            mostFocusedPeriod: expect.any(Object),
            taskCompletionRate: expect.any(Object),
            averageFocusDuration: expect.any(Object),
            focusCount: expect.any(Object),
            totalFocusDuration: expect.any(Object),
            sessionRecord: expect.any(Object),
            totalBreakTime: expect.any(Object),
            averageBreakDuration: expect.any(Object),
          })
        );
      });

      it('passing IAllTimeUserAnalytics should create a new form with FormGroup', () => {
        const formGroup = service.createAllTimeUserAnalyticsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalStudyTime: expect.any(Object),
            totalPomodoroSession: expect.any(Object),
            dailyStreaks: expect.any(Object),
            mostFocusedPeriod: expect.any(Object),
            taskCompletionRate: expect.any(Object),
            averageFocusDuration: expect.any(Object),
            focusCount: expect.any(Object),
            totalFocusDuration: expect.any(Object),
            sessionRecord: expect.any(Object),
            totalBreakTime: expect.any(Object),
            averageBreakDuration: expect.any(Object),
          })
        );
      });
    });

    describe('getAllTimeUserAnalytics', () => {
      it('should return NewAllTimeUserAnalytics for default AllTimeUserAnalytics initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAllTimeUserAnalyticsFormGroup(sampleWithNewData);

        const allTimeUserAnalytics = service.getAllTimeUserAnalytics(formGroup) as any;

        expect(allTimeUserAnalytics).toMatchObject(sampleWithNewData);
      });

      it('should return NewAllTimeUserAnalytics for empty AllTimeUserAnalytics initial value', () => {
        const formGroup = service.createAllTimeUserAnalyticsFormGroup();

        const allTimeUserAnalytics = service.getAllTimeUserAnalytics(formGroup) as any;

        expect(allTimeUserAnalytics).toMatchObject({});
      });

      it('should return IAllTimeUserAnalytics', () => {
        const formGroup = service.createAllTimeUserAnalyticsFormGroup(sampleWithRequiredData);

        const allTimeUserAnalytics = service.getAllTimeUserAnalytics(formGroup) as any;

        expect(allTimeUserAnalytics).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAllTimeUserAnalytics should not enable id FormControl', () => {
        const formGroup = service.createAllTimeUserAnalyticsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAllTimeUserAnalytics should disable id FormControl', () => {
        const formGroup = service.createAllTimeUserAnalyticsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
