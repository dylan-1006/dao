import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PomodoroTimerService } from '../service/pomodoro-timer.service';

import { PomodoroTimerComponent } from './pomodoro-timer.component';

describe('PomodoroTimer Management Component', () => {
  let comp: PomodoroTimerComponent;
  let fixture: ComponentFixture<PomodoroTimerComponent>;
  let service: PomodoroTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pomodoro-timer', component: PomodoroTimerComponent }]), HttpClientTestingModule],
      declarations: [PomodoroTimerComponent],
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
      .overrideTemplate(PomodoroTimerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PomodoroTimerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PomodoroTimerService);

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
    expect(comp.pomodoroTimers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pomodoroTimerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPomodoroTimerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPomodoroTimerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
