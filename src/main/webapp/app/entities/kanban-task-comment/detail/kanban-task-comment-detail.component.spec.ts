import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KanbanTaskCommentDetailComponent } from './kanban-task-comment-detail.component';

describe('KanbanTaskComment Management Detail Component', () => {
  let comp: KanbanTaskCommentDetailComponent;
  let fixture: ComponentFixture<KanbanTaskCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KanbanTaskCommentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ kanbanTaskComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(KanbanTaskCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KanbanTaskCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load kanbanTaskComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.kanbanTaskComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
