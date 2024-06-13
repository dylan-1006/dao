import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KanbanTaskCommentFormService } from './kanban-task-comment-form.service';
import { KanbanTaskCommentService } from '../service/kanban-task-comment.service';
import { IKanbanTaskComment } from '../kanban-task-comment.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { IKanbanTask } from 'app/entities/kanban-task/kanban-task.model';
import { KanbanTaskService } from 'app/entities/kanban-task/service/kanban-task.service';

import { KanbanTaskCommentUpdateComponent } from './kanban-task-comment-update.component';

describe('KanbanTaskComment Management Update Component', () => {
  let comp: KanbanTaskCommentUpdateComponent;
  let fixture: ComponentFixture<KanbanTaskCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let kanbanTaskCommentFormService: KanbanTaskCommentFormService;
  let kanbanTaskCommentService: KanbanTaskCommentService;
  let applicationUserService: ApplicationUserService;
  let kanbanTaskService: KanbanTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KanbanTaskCommentUpdateComponent],
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
      .overrideTemplate(KanbanTaskCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KanbanTaskCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    kanbanTaskCommentFormService = TestBed.inject(KanbanTaskCommentFormService);
    kanbanTaskCommentService = TestBed.inject(KanbanTaskCommentService);
    applicationUserService = TestBed.inject(ApplicationUserService);
    kanbanTaskService = TestBed.inject(KanbanTaskService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUser query and add missing value', () => {
      const kanbanTaskComment: IKanbanTaskComment = { id: 456 };
      const author: IApplicationUser = { id: 19549 };
      kanbanTaskComment.author = author;

      const applicationUserCollection: IApplicationUser[] = [{ id: 29608 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [author];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ kanbanTaskComment });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call KanbanTask query and add missing value', () => {
      const kanbanTaskComment: IKanbanTaskComment = { id: 456 };
      const kanbanTask: IKanbanTask = { id: 51681 };
      kanbanTaskComment.kanbanTask = kanbanTask;

      const kanbanTaskCollection: IKanbanTask[] = [{ id: 57644 }];
      jest.spyOn(kanbanTaskService, 'query').mockReturnValue(of(new HttpResponse({ body: kanbanTaskCollection })));
      const additionalKanbanTasks = [kanbanTask];
      const expectedCollection: IKanbanTask[] = [...additionalKanbanTasks, ...kanbanTaskCollection];
      jest.spyOn(kanbanTaskService, 'addKanbanTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ kanbanTaskComment });
      comp.ngOnInit();

      expect(kanbanTaskService.query).toHaveBeenCalled();
      expect(kanbanTaskService.addKanbanTaskToCollectionIfMissing).toHaveBeenCalledWith(
        kanbanTaskCollection,
        ...additionalKanbanTasks.map(expect.objectContaining)
      );
      expect(comp.kanbanTasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const kanbanTaskComment: IKanbanTaskComment = { id: 456 };
      const author: IApplicationUser = { id: 3987 };
      kanbanTaskComment.author = author;
      const kanbanTask: IKanbanTask = { id: 83767 };
      kanbanTaskComment.kanbanTask = kanbanTask;

      activatedRoute.data = of({ kanbanTaskComment });
      comp.ngOnInit();

      expect(comp.applicationUsersSharedCollection).toContain(author);
      expect(comp.kanbanTasksSharedCollection).toContain(kanbanTask);
      expect(comp.kanbanTaskComment).toEqual(kanbanTaskComment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanTaskComment>>();
      const kanbanTaskComment = { id: 123 };
      jest.spyOn(kanbanTaskCommentFormService, 'getKanbanTaskComment').mockReturnValue(kanbanTaskComment);
      jest.spyOn(kanbanTaskCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanTaskComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kanbanTaskComment }));
      saveSubject.complete();

      // THEN
      expect(kanbanTaskCommentFormService.getKanbanTaskComment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(kanbanTaskCommentService.update).toHaveBeenCalledWith(expect.objectContaining(kanbanTaskComment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanTaskComment>>();
      const kanbanTaskComment = { id: 123 };
      jest.spyOn(kanbanTaskCommentFormService, 'getKanbanTaskComment').mockReturnValue({ id: null });
      jest.spyOn(kanbanTaskCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanTaskComment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kanbanTaskComment }));
      saveSubject.complete();

      // THEN
      expect(kanbanTaskCommentFormService.getKanbanTaskComment).toHaveBeenCalled();
      expect(kanbanTaskCommentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanTaskComment>>();
      const kanbanTaskComment = { id: 123 };
      jest.spyOn(kanbanTaskCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanTaskComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(kanbanTaskCommentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareApplicationUser', () => {
      it('Should forward to applicationUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicationUserService, 'compareApplicationUser');
        comp.compareApplicationUser(entity, entity2);
        expect(applicationUserService.compareApplicationUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareKanbanTask', () => {
      it('Should forward to kanbanTaskService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(kanbanTaskService, 'compareKanbanTask');
        comp.compareKanbanTask(entity, entity2);
        expect(kanbanTaskService.compareKanbanTask).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
