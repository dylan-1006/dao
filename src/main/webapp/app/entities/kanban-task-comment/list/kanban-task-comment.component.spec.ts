import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { KanbanTaskCommentService } from '../service/kanban-task-comment.service';

import { KanbanTaskCommentComponent } from './kanban-task-comment.component';

describe('KanbanTaskComment Management Component', () => {
  let comp: KanbanTaskCommentComponent;
  let fixture: ComponentFixture<KanbanTaskCommentComponent>;
  let service: KanbanTaskCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'kanban-task-comment', component: KanbanTaskCommentComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [KanbanTaskCommentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(KanbanTaskCommentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KanbanTaskCommentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(KanbanTaskCommentService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.kanbanTaskComments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to kanbanTaskCommentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getKanbanTaskCommentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getKanbanTaskCommentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
