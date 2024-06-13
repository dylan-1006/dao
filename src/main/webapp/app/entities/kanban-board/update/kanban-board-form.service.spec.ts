import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../kanban-board.test-samples';

import { KanbanBoardFormService } from './kanban-board-form.service';

describe('KanbanBoard Form Service', () => {
  let service: KanbanBoardFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanBoardFormService);
  });

  describe('Service methods', () => {
    describe('createKanbanBoardFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createKanbanBoardFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            labels: expect.any(Object),
          })
        );
      });

      it('passing IKanbanBoard should create a new form with FormGroup', () => {
        const formGroup = service.createKanbanBoardFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            labels: expect.any(Object),
          })
        );
      });
    });

    describe('getKanbanBoard', () => {
      it('should return NewKanbanBoard for default KanbanBoard initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createKanbanBoardFormGroup(sampleWithNewData);

        const kanbanBoard = service.getKanbanBoard(formGroup) as any;

        expect(kanbanBoard).toMatchObject(sampleWithNewData);
      });

      it('should return NewKanbanBoard for empty KanbanBoard initial value', () => {
        const formGroup = service.createKanbanBoardFormGroup();

        const kanbanBoard = service.getKanbanBoard(formGroup) as any;

        expect(kanbanBoard).toMatchObject({});
      });

      it('should return IKanbanBoard', () => {
        const formGroup = service.createKanbanBoardFormGroup(sampleWithRequiredData);

        const kanbanBoard = service.getKanbanBoard(formGroup) as any;

        expect(kanbanBoard).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IKanbanBoard should not enable id FormControl', () => {
        const formGroup = service.createKanbanBoardFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewKanbanBoard should disable id FormControl', () => {
        const formGroup = service.createKanbanBoardFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
