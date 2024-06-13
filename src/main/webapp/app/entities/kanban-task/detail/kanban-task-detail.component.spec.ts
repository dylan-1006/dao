import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KanbanTaskDetailComponent } from './kanban-task-detail.component';

describe('KanbanTask Management Detail Component', () => {
  let comp: KanbanTaskDetailComponent;
  let fixture: ComponentFixture<KanbanTaskDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KanbanTaskDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ kanbanTask: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(KanbanTaskDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KanbanTaskDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load kanbanTask on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.kanbanTask).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
