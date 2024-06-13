import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { KanbanLabelService } from '../service/kanban-label.service';

import { KanbanLabelComponent } from './kanban-label.component';

describe('KanbanLabel Management Component', () => {
  let comp: KanbanLabelComponent;
  let fixture: ComponentFixture<KanbanLabelComponent>;
  let service: KanbanLabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'kanban-label', component: KanbanLabelComponent }]), HttpClientTestingModule],
      declarations: [KanbanLabelComponent],
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
      .overrideTemplate(KanbanLabelComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KanbanLabelComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(KanbanLabelService);

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
    expect(comp.kanbanLabels?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to kanbanLabelService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getKanbanLabelIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getKanbanLabelIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
