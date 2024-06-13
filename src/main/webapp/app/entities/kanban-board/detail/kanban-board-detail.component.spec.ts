import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KanbanBoardDetailComponent } from './kanban-board-detail.component';

describe('KanbanBoard Management Detail Component', () => {
  let comp: KanbanBoardDetailComponent;
  let fixture: ComponentFixture<KanbanBoardDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KanbanBoardDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ kanbanBoard: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(KanbanBoardDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KanbanBoardDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load kanbanBoard on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.kanbanBoard).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
