import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PraiseService } from '../service/praise.service';

import { PraiseComponent } from './praise.component';

describe('Praise Management Component', () => {
  let comp: PraiseComponent;
  let fixture: ComponentFixture<PraiseComponent>;
  let service: PraiseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'praise', component: PraiseComponent }]), HttpClientTestingModule],
      declarations: [PraiseComponent],
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
      .overrideTemplate(PraiseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PraiseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PraiseService);

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
    expect(comp.praises?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to praiseService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPraiseIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPraiseIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
