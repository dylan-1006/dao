import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KanbanTaskFormService } from './kanban-task-form.service';
import { KanbanTaskService } from '../service/kanban-task.service';
import { IKanbanTask } from '../kanban-task.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { IKanbanLabel } from 'app/entities/kanban-label/kanban-label.model';
import { KanbanLabelService } from 'app/entities/kanban-label/service/kanban-label.service';
import { IKanbanBoard } from 'app/entities/kanban-board/kanban-board.model';
import { KanbanBoardService } from 'app/entities/kanban-board/service/kanban-board.service';

import { KanbanTaskUpdateComponent } from './kanban-task-update.component';

describe('KanbanTask Management Update Component', () => {
  let comp: KanbanTaskUpdateComponent;
  let fixture: ComponentFixture<KanbanTaskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let kanbanTaskFormService: KanbanTaskFormService;
  let kanbanTaskService: KanbanTaskService;
  let applicationUserService: ApplicationUserService;
  let kanbanLabelService: KanbanLabelService;
  let kanbanBoardService: KanbanBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KanbanTaskUpdateComponent],
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
      .overrideTemplate(KanbanTaskUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KanbanTaskUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    kanbanTaskFormService = TestBed.inject(KanbanTaskFormService);
    kanbanTaskService = TestBed.inject(KanbanTaskService);
    applicationUserService = TestBed.inject(ApplicationUserService);
    kanbanLabelService = TestBed.inject(KanbanLabelService);
    kanbanBoardService = TestBed.inject(KanbanBoardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUser query and add missing value', () => {
      const kanbanTask: IKanbanTask = { id: 456 };
      const author: IApplicationUser = { id: 20589 };
      kanbanTask.author = author;

      const applicationUserCollection: IApplicationUser[] = [{ id: 24921 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [author];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ kanbanTask });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call KanbanLabel query and add missing value', () => {
      const kanbanTask: IKanbanTask = { id: 456 };
      const labels: IKanbanLabel[] = [{ id: 74248 }];
      kanbanTask.labels = labels;

      const kanbanLabelCollection: IKanbanLabel[] = [{ id: 20809 }];
      jest.spyOn(kanbanLabelService, 'query').mockReturnValue(of(new HttpResponse({ body: kanbanLabelCollection })));
      const additionalKanbanLabels = [...labels];
      const expectedCollection: IKanbanLabel[] = [...additionalKanbanLabels, ...kanbanLabelCollection];
      jest.spyOn(kanbanLabelService, 'addKanbanLabelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ kanbanTask });
      comp.ngOnInit();

      expect(kanbanLabelService.query).toHaveBeenCalled();
      expect(kanbanLabelService.addKanbanLabelToCollectionIfMissing).toHaveBeenCalledWith(
        kanbanLabelCollection,
        ...additionalKanbanLabels.map(expect.objectContaining)
      );
      expect(comp.kanbanLabelsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call KanbanBoard query and add missing value', () => {
      const kanbanTask: IKanbanTask = { id: 456 };
      const kanbanBoard: IKanbanBoard = { id: 18796 };
      kanbanTask.kanbanBoard = kanbanBoard;

      const kanbanBoardCollection: IKanbanBoard[] = [{ id: 17552 }];
      jest.spyOn(kanbanBoardService, 'query').mockReturnValue(of(new HttpResponse({ body: kanbanBoardCollection })));
      const additionalKanbanBoards = [kanbanBoard];
      const expectedCollection: IKanbanBoard[] = [...additionalKanbanBoards, ...kanbanBoardCollection];
      jest.spyOn(kanbanBoardService, 'addKanbanBoardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ kanbanTask });
      comp.ngOnInit();

      expect(kanbanBoardService.query).toHaveBeenCalled();
      expect(kanbanBoardService.addKanbanBoardToCollectionIfMissing).toHaveBeenCalledWith(
        kanbanBoardCollection,
        ...additionalKanbanBoards.map(expect.objectContaining)
      );
      expect(comp.kanbanBoardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const kanbanTask: IKanbanTask = { id: 456 };
      const author: IApplicationUser = { id: 34687 };
      kanbanTask.author = author;
      const labels: IKanbanLabel = { id: 84387 };
      kanbanTask.labels = [labels];
      const kanbanBoard: IKanbanBoard = { id: 62375 };
      kanbanTask.kanbanBoard = kanbanBoard;

      activatedRoute.data = of({ kanbanTask });
      comp.ngOnInit();

      expect(comp.applicationUsersSharedCollection).toContain(author);
      expect(comp.kanbanLabelsSharedCollection).toContain(labels);
      expect(comp.kanbanBoardsSharedCollection).toContain(kanbanBoard);
      expect(comp.kanbanTask).toEqual(kanbanTask);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanTask>>();
      const kanbanTask = { id: 123 };
      jest.spyOn(kanbanTaskFormService, 'getKanbanTask').mockReturnValue(kanbanTask);
      jest.spyOn(kanbanTaskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanTask });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kanbanTask }));
      saveSubject.complete();

      // THEN
      expect(kanbanTaskFormService.getKanbanTask).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(kanbanTaskService.update).toHaveBeenCalledWith(expect.objectContaining(kanbanTask));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanTask>>();
      const kanbanTask = { id: 123 };
      jest.spyOn(kanbanTaskFormService, 'getKanbanTask').mockReturnValue({ id: null });
      jest.spyOn(kanbanTaskService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanTask: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kanbanTask }));
      saveSubject.complete();

      // THEN
      expect(kanbanTaskFormService.getKanbanTask).toHaveBeenCalled();
      expect(kanbanTaskService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanTask>>();
      const kanbanTask = { id: 123 };
      jest.spyOn(kanbanTaskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanTask });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(kanbanTaskService.update).toHaveBeenCalled();
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

    describe('compareKanbanLabel', () => {
      it('Should forward to kanbanLabelService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(kanbanLabelService, 'compareKanbanLabel');
        comp.compareKanbanLabel(entity, entity2);
        expect(kanbanLabelService.compareKanbanLabel).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareKanbanBoard', () => {
      it('Should forward to kanbanBoardService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(kanbanBoardService, 'compareKanbanBoard');
        comp.compareKanbanBoard(entity, entity2);
        expect(kanbanBoardService.compareKanbanBoard).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
