import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RewardFormService } from './reward-form.service';
import { RewardService } from '../service/reward.service';
import { IReward } from '../reward.model';
import { IMilestone } from 'app/entities/milestone/milestone.model';
import { MilestoneService } from 'app/entities/milestone/service/milestone.service';

import { RewardUpdateComponent } from './reward-update.component';

describe('Reward Management Update Component', () => {
  let comp: RewardUpdateComponent;
  let fixture: ComponentFixture<RewardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rewardFormService: RewardFormService;
  let rewardService: RewardService;
  let milestoneService: MilestoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RewardUpdateComponent],
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
      .overrideTemplate(RewardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RewardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rewardFormService = TestBed.inject(RewardFormService);
    rewardService = TestBed.inject(RewardService);
    milestoneService = TestBed.inject(MilestoneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Milestone query and add missing value', () => {
      const reward: IReward = { id: 456 };
      const milestone: IMilestone = { id: 11666 };
      reward.milestone = milestone;

      const milestoneCollection: IMilestone[] = [{ id: 82425 }];
      jest.spyOn(milestoneService, 'query').mockReturnValue(of(new HttpResponse({ body: milestoneCollection })));
      const additionalMilestones = [milestone];
      const expectedCollection: IMilestone[] = [...additionalMilestones, ...milestoneCollection];
      jest.spyOn(milestoneService, 'addMilestoneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reward });
      comp.ngOnInit();

      expect(milestoneService.query).toHaveBeenCalled();
      expect(milestoneService.addMilestoneToCollectionIfMissing).toHaveBeenCalledWith(
        milestoneCollection,
        ...additionalMilestones.map(expect.objectContaining)
      );
      expect(comp.milestonesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reward: IReward = { id: 456 };
      const milestone: IMilestone = { id: 19496 };
      reward.milestone = milestone;

      activatedRoute.data = of({ reward });
      comp.ngOnInit();

      expect(comp.milestonesSharedCollection).toContain(milestone);
      expect(comp.reward).toEqual(reward);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReward>>();
      const reward = { id: 123 };
      jest.spyOn(rewardFormService, 'getReward').mockReturnValue(reward);
      jest.spyOn(rewardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reward });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reward }));
      saveSubject.complete();

      // THEN
      expect(rewardFormService.getReward).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rewardService.update).toHaveBeenCalledWith(expect.objectContaining(reward));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReward>>();
      const reward = { id: 123 };
      jest.spyOn(rewardFormService, 'getReward').mockReturnValue({ id: null });
      jest.spyOn(rewardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reward: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reward }));
      saveSubject.complete();

      // THEN
      expect(rewardFormService.getReward).toHaveBeenCalled();
      expect(rewardService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReward>>();
      const reward = { id: 123 };
      jest.spyOn(rewardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reward });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rewardService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMilestone', () => {
      it('Should forward to milestoneService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(milestoneService, 'compareMilestone');
        comp.compareMilestone(entity, entity2);
        expect(milestoneService.compareMilestone).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
