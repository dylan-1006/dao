import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SessionAnalyticDetailComponent } from './session-analytic-detail.component';

describe('SessionAnalytic Management Detail Component', () => {
  let comp: SessionAnalyticDetailComponent;
  let fixture: ComponentFixture<SessionAnalyticDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionAnalyticDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sessionAnalytic: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SessionAnalyticDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SessionAnalyticDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sessionAnalytic on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sessionAnalytic).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
