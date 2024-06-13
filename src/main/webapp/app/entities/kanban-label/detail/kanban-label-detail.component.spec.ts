import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KanbanLabelDetailComponent } from './kanban-label-detail.component';

describe('KanbanLabel Management Detail Component', () => {
  let comp: KanbanLabelDetailComponent;
  let fixture: ComponentFixture<KanbanLabelDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KanbanLabelDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ kanbanLabel: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(KanbanLabelDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KanbanLabelDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load kanbanLabel on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.kanbanLabel).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
