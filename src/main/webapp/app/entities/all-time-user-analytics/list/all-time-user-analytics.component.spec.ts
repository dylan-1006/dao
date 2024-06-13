import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AllTimeUserAnalyticsService } from '../service/all-time-user-analytics.service';

import { AllTimeUserAnalyticsComponent } from './all-time-user-analytics.component';

describe('AllTimeUserAnalytics Management Component', () => {
  let comp: AllTimeUserAnalyticsComponent;
  let fixture: ComponentFixture<AllTimeUserAnalyticsComponent>;
  let service: AllTimeUserAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'all-time-user-analytics', component: AllTimeUserAnalyticsComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [AllTimeUserAnalyticsComponent],
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
      .overrideTemplate(AllTimeUserAnalyticsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AllTimeUserAnalyticsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AllTimeUserAnalyticsService);

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
    expect(comp.allTimeUserAnalytics?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to allTimeUserAnalyticsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAllTimeUserAnalyticsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAllTimeUserAnalyticsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
