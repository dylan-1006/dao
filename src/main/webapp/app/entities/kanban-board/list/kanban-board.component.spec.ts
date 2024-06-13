import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { KanbanBoardService } from '../service/kanban-board.service';

import { KanbanBoardComponent } from './kanban-board.component';

describe('KanbanBoard Management Component', () => {
  let comp: KanbanBoardComponent;
  let fixture: ComponentFixture<KanbanBoardComponent>;
  let service: KanbanBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'kanban-board', component: KanbanBoardComponent }]), HttpClientTestingModule],
      declarations: [KanbanBoardComponent],
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
      .overrideTemplate(KanbanBoardComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KanbanBoardComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(KanbanBoardService);

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
    expect(comp.kanbanBoards?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to kanbanBoardService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getKanbanBoardIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getKanbanBoardIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
