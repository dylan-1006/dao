import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MilestoneFormService } from './milestone-form.service';
import { MilestoneService } from '../service/milestone.service';
import { IMilestone } from '../milestone.model';

import { MilestoneUpdateComponent } from './milestone-update.component';

describe('Milestone Management Update Component', () => {
  let comp: MilestoneUpdateComponent;
  let fixture: ComponentFixture<MilestoneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let milestoneFormService: MilestoneFormService;
  let milestoneService: MilestoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MilestoneUpdateComponent],
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
      .overrideTemplate(MilestoneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MilestoneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    milestoneFormService = TestBed.inject(MilestoneFormService);
    milestoneService = TestBed.inject(MilestoneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const milestone: IMilestone = { id: 456 };

      activatedRoute.data = of({ milestone });
      comp.ngOnInit();

      expect(comp.milestone).toEqual(milestone);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMilestone>>();
      const milestone = { id: 123 };
      jest.spyOn(milestoneFormService, 'getMilestone').mockReturnValue(milestone);
      jest.spyOn(milestoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ milestone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: milestone }));
      saveSubject.complete();

      // THEN
      expect(milestoneFormService.getMilestone).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(milestoneService.update).toHaveBeenCalledWith(expect.objectContaining(milestone));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMilestone>>();
      const milestone = { id: 123 };
      jest.spyOn(milestoneFormService, 'getMilestone').mockReturnValue({ id: null });
      jest.spyOn(milestoneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ milestone: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: milestone }));
      saveSubject.complete();

      // THEN
      expect(milestoneFormService.getMilestone).toHaveBeenCalled();
      expect(milestoneService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMilestone>>();
      const milestone = { id: 123 };
      jest.spyOn(milestoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ milestone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(milestoneService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
