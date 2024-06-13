import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { KanbanTaskService } from '../service/kanban-task.service';

import { KanbanTaskComponent } from './kanban-task.component';

describe('KanbanTask Management Component', () => {
  let comp: KanbanTaskComponent;
  let fixture: ComponentFixture<KanbanTaskComponent>;
  let service: KanbanTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'kanban-task', component: KanbanTaskComponent }]), HttpClientTestingModule],
      declarations: [KanbanTaskComponent],
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
      .overrideTemplate(KanbanTaskComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KanbanTaskComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(KanbanTaskService);

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
    expect(comp.kanbanTasks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to kanbanTaskService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getKanbanTaskIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getKanbanTaskIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
