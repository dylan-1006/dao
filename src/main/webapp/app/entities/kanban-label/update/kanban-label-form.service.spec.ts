import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../kanban-label.test-samples';

import { KanbanLabelFormService } from './kanban-label-form.service';

describe('KanbanLabel Form Service', () => {
  let service: KanbanLabelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanLabelFormService);
  });

  describe('Service methods', () => {
    describe('createKanbanLabelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createKanbanLabelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            colour: expect.any(Object),
            boards: expect.any(Object),
            tasks: expect.any(Object),
          })
        );
      });

      it('passing IKanbanLabel should create a new form with FormGroup', () => {
        const formGroup = service.createKanbanLabelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            colour: expect.any(Object),
            boards: expect.any(Object),
            tasks: expect.any(Object),
          })
        );
      });
    });

    describe('getKanbanLabel', () => {
      it('should return NewKanbanLabel for default KanbanLabel initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createKanbanLabelFormGroup(sampleWithNewData);

        const kanbanLabel = service.getKanbanLabel(formGroup) as any;

        expect(kanbanLabel).toMatchObject(sampleWithNewData);
      });

      it('should return NewKanbanLabel for empty KanbanLabel initial value', () => {
        const formGroup = service.createKanbanLabelFormGroup();

        const kanbanLabel = service.getKanbanLabel(formGroup) as any;

        expect(kanbanLabel).toMatchObject({});
      });

      it('should return IKanbanLabel', () => {
        const formGroup = service.createKanbanLabelFormGroup(sampleWithRequiredData);

        const kanbanLabel = service.getKanbanLabel(formGroup) as any;

        expect(kanbanLabel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IKanbanLabel should not enable id FormControl', () => {
        const formGroup = service.createKanbanLabelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewKanbanLabel should disable id FormControl', () => {
        const formGroup = service.createKanbanLabelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
