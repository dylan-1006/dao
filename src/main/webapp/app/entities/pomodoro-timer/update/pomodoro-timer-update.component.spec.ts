import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PomodoroTimerFormService } from './pomodoro-timer-form.service';
import { PomodoroTimerService } from '../service/pomodoro-timer.service';
import { IPomodoroTimer } from '../pomodoro-timer.model';

import { PomodoroTimerUpdateComponent } from './pomodoro-timer-update.component';

describe('PomodoroTimer Management Update Component', () => {
  let comp: PomodoroTimerUpdateComponent;
  let fixture: ComponentFixture<PomodoroTimerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pomodoroTimerFormService: PomodoroTimerFormService;
  let pomodoroTimerService: PomodoroTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PomodoroTimerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PomodoroTimerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PomodoroTimerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pomodoroTimerFormService = TestBed.inject(PomodoroTimerFormService);
    pomodoroTimerService = TestBed.inject(PomodoroTimerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const pomodoroTimer: IPomodoroTimer = { id: 456 };

      activatedRoute.data = of({ pomodoroTimer });
      comp.ngOnInit();

      expect(comp.pomodoroTimer).toEqual(pomodoroTimer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPomodoroTimer>>();
      const pomodoroTimer = { id: 123 };
      jest.spyOn(pomodoroTimerFormService, 'getPomodoroTimer').mockReturnValue(pomodoroTimer);
      jest.spyOn(pomodoroTimerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pomodoroTimer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pomodoroTimer }));
      saveSubject.complete();

      // THEN
      expect(pomodoroTimerFormService.getPomodoroTimer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pomodoroTimerService.update).toHaveBeenCalledWith(expect.objectContaining(pomodoroTimer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPomodoroTimer>>();
      const pomodoroTimer = { id: 123 };
      jest.spyOn(pomodoroTimerFormService, 'getPomodoroTimer').mockReturnValue({ id: null });
      jest.spyOn(pomodoroTimerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pomodoroTimer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pomodoroTimer }));
      saveSubject.complete();

      // THEN
      expect(pomodoroTimerFormService.getPomodoroTimer).toHaveBeenCalled();
      expect(pomodoroTimerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPomodoroTimer>>();
      const pomodoroTimer = { id: 123 };
      jest.spyOn(pomodoroTimerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pomodoroTimer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pomodoroTimerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
