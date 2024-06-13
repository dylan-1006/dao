import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KanbanBoardFormService } from './kanban-board-form.service';
import { KanbanBoardService } from '../service/kanban-board.service';
import { IKanbanBoard } from '../kanban-board.model';

import { KanbanBoardUpdateComponent } from './kanban-board-update.component';

describe('KanbanBoard Management Update Component', () => {
  let comp: KanbanBoardUpdateComponent;
  let fixture: ComponentFixture<KanbanBoardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let kanbanBoardFormService: KanbanBoardFormService;
  let kanbanBoardService: KanbanBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KanbanBoardUpdateComponent],
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
      .overrideTemplate(KanbanBoardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KanbanBoardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    kanbanBoardFormService = TestBed.inject(KanbanBoardFormService);
    kanbanBoardService = TestBed.inject(KanbanBoardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const kanbanBoard: IKanbanBoard = { id: 456 };

      activatedRoute.data = of({ kanbanBoard });
      comp.ngOnInit();

      expect(comp.kanbanBoard).toEqual(kanbanBoard);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanBoard>>();
      const kanbanBoard = { id: 123 };
      jest.spyOn(kanbanBoardFormService, 'getKanbanBoard').mockReturnValue(kanbanBoard);
      jest.spyOn(kanbanBoardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanBoard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kanbanBoard }));
      saveSubject.complete();

      // THEN
      expect(kanbanBoardFormService.getKanbanBoard).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(kanbanBoardService.update).toHaveBeenCalledWith(expect.objectContaining(kanbanBoard));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanBoard>>();
      const kanbanBoard = { id: 123 };
      jest.spyOn(kanbanBoardFormService, 'getKanbanBoard').mockReturnValue({ id: null });
      jest.spyOn(kanbanBoardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanBoard: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kanbanBoard }));
      saveSubject.complete();

      // THEN
      expect(kanbanBoardFormService.getKanbanBoard).toHaveBeenCalled();
      expect(kanbanBoardService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKanbanBoard>>();
      const kanbanBoard = { id: 123 };
      jest.spyOn(kanbanBoardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kanbanBoard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(kanbanBoardService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
