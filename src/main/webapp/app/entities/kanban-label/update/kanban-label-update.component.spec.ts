import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KanbanLabelFormService } from './kanban-label-form.service';
import { KanbanLabelService } from '../service/kanban-label.service';
import { IKanbanLabel } from '../kanban-label.model';
import { IKanbanBoard } from 'app/entities/kanban-board/kanban-board.model';
import { KanbanBoardService } from 'app/entities/kanban-board/service/kanban-board.service';

import { KanbanLabelUpdateComponent } from './kanban-label-update.component';

describe('KanbanLabel Management Update Component', () => {
  let comp: KanbanLabelUpdateComponent;
  let fixture: ComponentFixture<KanbanLabelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let kanbanLabelFormService: KanbanLabelFormService;
  let kanbanLabelService: KanbanLabelService;
  let kanbanBoardService: KanbanBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KanbanLabelUpdateComponent],
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
      .overrideTemplate(KanbanLabelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KanbanLabelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    kanbanLabelFormService = TestBed.inject(KanbanLabelFormService);
    kanbanLabelService = TestBed.inject(KanbanLabelService);
    kanbanBoardService = TestBed.inject(KanbanBoardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call KanbanBoard query and add missing value', () => {
      const kanbanLabel: IKanbanLabel = { id: 456 };
      const boards: IKanbanBoard[] = [{ id: 11578 }];
      kanbanLabel.boards = boards;

      const kanbanBoardCollection: IKanbanBoard[] = [{ id: 5901 }];
      jest.spyOn(kanbanBoardService, 'query').mockReturnValue(of(new HttpResponse({ body: kanbanBoardCollection })));
      const additionalKanbanBoards = [...boards];
      const expectedCollection: IKanbanBoard[] = [...additionalKanbanBoards, ...kanbanBoardCollection];
      jest.spyOn(kanbanBoardService, 'addKanbanBoardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ kanbanLabel });
      comp.ngOnInit();

      expect(kanbanBoardService.query).toHaveBeenCalled();
      expect(kanbanBoardService.addKanbanBoardToCollectionIfMissing).toHaveBeenCalledWith(
        kanbanBoardCollection,
        ...additionalKanbanBoards.map(expect.objectContaining)
      );
      expect(comp.kanbanBoardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const kanbanLabel: IKanbanLabel = { id: 456 };
      const board: IKanbanBoard = { id: 72006 };
      kanbanLabel.boards = [board];

      activatedRoute.data = of({ kanbanLabel });
      comp.ngOnInit();

      expect(comp.kanbanBoardsSharedCollection).toContain(board);
      expect(comp.kanbanLabel).toEqual(kanbanLabel);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanLabel>>();
      const kanbanLabel = { id: 123 };
      jest.spyOn(kanbanLabelFormService, 'getKanbanLabel').mockReturnValue(kanbanLabel);
      jest.spyOn(kanbanLabelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanLabel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kanbanLabel }));
      saveSubject.complete();

      // THEN
      expect(kanbanLabelFormService.getKanbanLabel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(kanbanLabelService.update).toHaveBeenCalledWith(expect.objectContaining(kanbanLabel));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanLabel>>();
      const kanbanLabel = { id: 123 };
      jest.spyOn(kanbanLabelFormService, 'getKanbanLabel').mockReturnValue({ id: null });
      jest.spyOn(kanbanLabelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanLabel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kanbanLabel }));
      saveSubject.complete();

      // THEN
      expect(kanbanLabelFormService.getKanbanLabel).toHaveBeenCalled();
      expect(kanbanLabelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanLabel>>();
      const kanbanLabel = { id: 123 };
      jest.spyOn(kanbanLabelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanLabel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(kanbanLabelService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
