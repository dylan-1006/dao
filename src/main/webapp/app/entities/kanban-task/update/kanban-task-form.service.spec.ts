import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../kanban-task.test-samples';

import { KanbanTaskFormService } from './kanban-task-form.service';

describe('KanbanTask Form Service', () => {
  let service: KanbanTaskFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanTaskFormService);
  });

  describe('Service methods', () => {
    describe('createKanbanTaskFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createKanbanTaskFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            taskStatus: expect.any(Object),
            dueDate: expect.any(Object),
            author: expect.any(Object),
            labels: expect.any(Object),
            kanbanBoard: expect.any(Object),
          })
        );
      });

      it('passing IKanbanTask should create a new form with FormGroup', () => {
        const formGroup = service.createKanbanTaskFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            taskStatus: expect.any(Object),
            dueDate: expect.any(Object),
            author: expect.any(Object),
            labels: expect.any(Object),
            kanbanBoard: expect.any(Object),
          })
        );
      });
    });

    describe('getKanbanTask', () => {
      it('should return NewKanbanTask for default KanbanTask initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createKanbanTaskFormGroup(sampleWithNewData);

        const kanbanTask = service.getKanbanTask(formGroup) as any;

        expect(kanbanTask).toMatchObject(sampleWithNewData);
      });

      it('should return NewKanbanTask for empty KanbanTask initial value', () => {
        const formGroup = service.createKanbanTaskFormGroup();

        const kanbanTask = service.getKanbanTask(formGroup) as any;

        expect(kanbanTask).toMatchObject({});
      });

      it('should return IKanbanTask', () => {
        const formGroup = service.createKanbanTaskFormGroup(sampleWithRequiredData);

        const kanbanTask = service.getKanbanTask(formGroup) as any;

        expect(kanbanTask).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IKanbanTask should not enable id FormControl', () => {
        const formGroup = service.createKanbanTaskFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewKanbanTask should disable id FormControl', () => {
        const formGroup = service.createKanbanTaskFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
