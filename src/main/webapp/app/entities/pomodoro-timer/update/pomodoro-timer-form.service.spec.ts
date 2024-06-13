import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pomodoro-timer.test-samples';

import { PomodoroTimerFormService } from './pomodoro-timer-form.service';

describe('PomodoroTimer Form Service', () => {
  let service: PomodoroTimerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PomodoroTimerFormService);
  });

  describe('Service methods', () => {
    describe('createPomodoroTimerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPomodoroTimerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            state: expect.any(Object),
            type: expect.any(Object),
            duration: expect.any(Object),
          })
        );
      });

      it('passing IPomodoroTimer should create a new form with FormGroup', () => {
        const formGroup = service.createPomodoroTimerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            state: expect.any(Object),
            type: expect.any(Object),
            duration: expect.any(Object),
          })
        );
      });
    });

    describe('getPomodoroTimer', () => {
      it('should return NewPomodoroTimer for default PomodoroTimer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPomodoroTimerFormGroup(sampleWithNewData);

        const pomodoroTimer = service.getPomodoroTimer(formGroup) as any;

        expect(pomodoroTimer).toMatchObject(sampleWithNewData);
      });

      it('should return NewPomodoroTimer for empty PomodoroTimer initial value', () => {
        const formGroup = service.createPomodoroTimerFormGroup();

        const pomodoroTimer = service.getPomodoroTimer(formGroup) as any;

        expect(pomodoroTimer).toMatchObject({});
      });

      it('should return IPomodoroTimer', () => {
        const formGroup = service.createPomodoroTimerFormGroup(sampleWithRequiredData);

        const pomodoroTimer = service.getPomodoroTimer(formGroup) as any;

        expect(pomodoroTimer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPomodoroTimer should not enable id FormControl', () => {
        const formGroup = service.createPomodoroTimerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPomodoroTimer should disable id FormControl', () => {
        const formGroup = service.createPomodoroTimerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
