import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AllTimeUserAnalyticsDetailComponent } from './all-time-user-analytics-detail.component';

describe('AllTimeUserAnalytics Management Detail Component', () => {
  let comp: AllTimeUserAnalyticsDetailComponent;
  let fixture: ComponentFixture<AllTimeUserAnalyticsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllTimeUserAnalyticsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ allTimeUserAnalytics: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AllTimeUserAnalyticsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AllTimeUserAnalyticsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load allTimeUserAnalytics on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.allTimeUserAnalytics).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
