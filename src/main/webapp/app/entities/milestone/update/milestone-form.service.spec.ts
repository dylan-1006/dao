import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../milestone.test-samples';

import { MilestoneFormService } from './milestone-form.service';

describe('Milestone Form Service', () => {
  let service: MilestoneFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilestoneFormService);
  });

  describe('Service methods', () => {
    describe('createMilestoneFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMilestoneFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            requiredHours: expect.any(Object),
            achievements: expect.any(Object),
          })
        );
      });

      it('passing IMilestone should create a new form with FormGroup', () => {
        const formGroup = service.createMilestoneFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            requiredHours: expect.any(Object),
            achievements: expect.any(Object),
          })
        );
      });
    });

    describe('getMilestone', () => {
      it('should return NewMilestone for default Milestone initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMilestoneFormGroup(sampleWithNewData);

        const milestone = service.getMilestone(formGroup) as any;

        expect(milestone).toMatchObject(sampleWithNewData);
      });

      it('should return NewMilestone for empty Milestone initial value', () => {
        const formGroup = service.createMilestoneFormGroup();

        const milestone = service.getMilestone(formGroup) as any;

        expect(milestone).toMatchObject({});
      });

      it('should return IMilestone', () => {
        const formGroup = service.createMilestoneFormGroup(sampleWithRequiredData);

        const milestone = service.getMilestone(formGroup) as any;

        expect(milestone).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMilestone should not enable id FormControl', () => {
        const formGroup = service.createMilestoneFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMilestone should disable id FormControl', () => {
        const formGroup = service.createMilestoneFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
