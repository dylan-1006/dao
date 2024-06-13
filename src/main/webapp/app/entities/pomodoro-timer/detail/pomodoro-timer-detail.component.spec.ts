import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PomodoroTimerDetailComponent } from './pomodoro-timer-detail.component';

describe('PomodoroTimer Management Detail Component', () => {
  let comp: PomodoroTimerDetailComponent;
  let fixture: ComponentFixture<PomodoroTimerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PomodoroTimerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pomodoroTimer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PomodoroTimerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PomodoroTimerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pomodoroTimer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pomodoroTimer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
