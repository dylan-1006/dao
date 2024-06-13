import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SessionAnalyticService } from '../service/session-analytic.service';

import { SessionAnalyticComponent } from './session-analytic.component';

describe('SessionAnalytic Management Component', () => {
  let comp: SessionAnalyticComponent;
  let fixture: ComponentFixture<SessionAnalyticComponent>;
  let service: SessionAnalyticService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'session-analytic', component: SessionAnalyticComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [SessionAnalyticComponent],
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
      .overrideTemplate(SessionAnalyticComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SessionAnalyticComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SessionAnalyticService);

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
    expect(comp.sessionAnalytics?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to sessionAnalyticService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSessionAnalyticIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSessionAnalyticIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
