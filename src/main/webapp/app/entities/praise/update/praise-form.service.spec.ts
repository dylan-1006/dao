import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../praise.test-samples';

import { PraiseFormService } from './praise-form.service';

describe('Praise Form Service', () => {
  let service: PraiseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PraiseFormService);
  });

  describe('Service methods', () => {
    describe('createPraiseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPraiseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            praiseMessage: expect.any(Object),
            sender: expect.any(Object),
            receiver: expect.any(Object),
          })
        );
      });

      it('passing IPraise should create a new form with FormGroup', () => {
        const formGroup = service.createPraiseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            praiseMessage: expect.any(Object),
            sender: expect.any(Object),
            receiver: expect.any(Object),
          })
        );
      });
    });

    describe('getPraise', () => {
      it('should return NewPraise for default Praise initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPraiseFormGroup(sampleWithNewData);

        const praise = service.getPraise(formGroup) as any;

        expect(praise).toMatchObject(sampleWithNewData);
      });

      it('should return NewPraise for empty Praise initial value', () => {
        const formGroup = service.createPraiseFormGroup();

        const praise = service.getPraise(formGroup) as any;

        expect(praise).toMatchObject({});
      });

      it('should return IPraise', () => {
        const formGroup = service.createPraiseFormGroup(sampleWithRequiredData);

        const praise = service.getPraise(formGroup) as any;

        expect(praise).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPraise should not enable id FormControl', () => {
        const formGroup = service.createPraiseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPraise should disable id FormControl', () => {
        const formGroup = service.createPraiseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
