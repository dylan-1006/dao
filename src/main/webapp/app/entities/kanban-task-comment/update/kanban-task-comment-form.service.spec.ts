import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../kanban-task-comment.test-samples';

import { KanbanTaskCommentFormService } from './kanban-task-comment-form.service';

describe('KanbanTaskComment Form Service', () => {
  let service: KanbanTaskCommentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanTaskCommentFormService);
  });

  describe('Service methods', () => {
    describe('createKanbanTaskCommentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createKanbanTaskCommentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            content: expect.any(Object),
            timeStamp: expect.any(Object),
            author: expect.any(Object),
            kanbanTask: expect.any(Object),
          })
        );
      });

      it('passing IKanbanTaskComment should create a new form with FormGroup', () => {
        const formGroup = service.createKanbanTaskCommentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            content: expect.any(Object),
            timeStamp: expect.any(Object),
            author: expect.any(Object),
            kanbanTask: expect.any(Object),
          })
        );
      });
    });

    describe('getKanbanTaskComment', () => {
      it('should return NewKanbanTaskComment for default KanbanTaskComment initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createKanbanTaskCommentFormGroup(sampleWithNewData);

        const kanbanTaskComment = service.getKanbanTaskComment(formGroup) as any;

        expect(kanbanTaskComment).toMatchObject(sampleWithNewData);
      });

      it('should return NewKanbanTaskComment for empty KanbanTaskComment initial value', () => {
        const formGroup = service.createKanbanTaskCommentFormGroup();

        const kanbanTaskComment = service.getKanbanTaskComment(formGroup) as any;

        expect(kanbanTaskComment).toMatchObject({});
      });

      it('should return IKanbanTaskComment', () => {
        const formGroup = service.createKanbanTaskCommentFormGroup(sampleWithRequiredData);

        const kanbanTaskComment = service.getKanbanTaskComment(formGroup) as any;

        expect(kanbanTaskComment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IKanbanTaskComment should not enable id FormControl', () => {
        const formGroup = service.createKanbanTaskCommentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewKanbanTaskComment should disable id FormControl', () => {
        const formGroup = service.createKanbanTaskCommentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
