import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ApplicationUserFormService } from './application-user-form.service';
import { ApplicationUserService } from '../service/application-user.service';
import { IApplicationUser } from '../application-user.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IAllTimeUserAnalytics } from 'app/entities/all-time-user-analytics/all-time-user-analytics.model';
import { AllTimeUserAnalyticsService } from 'app/entities/all-time-user-analytics/service/all-time-user-analytics.service';
import { IMilestone } from 'app/entities/milestone/milestone.model';
import { MilestoneService } from 'app/entities/milestone/service/milestone.service';
import { IKanbanTask } from 'app/entities/kanban-task/kanban-task.model';
import { KanbanTaskService } from 'app/entities/kanban-task/service/kanban-task.service';
import { ISession } from 'app/entities/session/session.model';
import { SessionService } from 'app/entities/session/service/session.service';

import { ApplicationUserUpdateComponent } from './application-user-update.component';

describe('ApplicationUser Management Update Component', () => {
  let comp: ApplicationUserUpdateComponent;
  let fixture: ComponentFixture<ApplicationUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let applicationUserFormService: ApplicationUserFormService;
  let applicationUserService: ApplicationUserService;
  let userService: UserService;
  let allTimeUserAnalyticsService: AllTimeUserAnalyticsService;
  let milestoneService: MilestoneService;
  let kanbanTaskService: KanbanTaskService;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ApplicationUserUpdateComponent],
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
      .overrideTemplate(ApplicationUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    applicationUserFormService = TestBed.inject(ApplicationUserFormService);
    applicationUserService = TestBed.inject(ApplicationUserService);
    userService = TestBed.inject(UserService);
    allTimeUserAnalyticsService = TestBed.inject(AllTimeUserAnalyticsService);
    milestoneService = TestBed.inject(MilestoneService);
    kanbanTaskService = TestBed.inject(KanbanTaskService);
    sessionService = TestBed.inject(SessionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const applicationUser: IApplicationUser = { id: 456 };
      const internalUser: IUser = { id: 32396 };
      applicationUser.internalUser = internalUser;

      const userCollection: IUser[] = [{ id: 67663 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [internalUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call allTimeAnalytics query and add missing value', () => {
      const applicationUser: IApplicationUser = { id: 456 };
      const allTimeAnalytics: IAllTimeUserAnalytics = { id: 28301 };
      applicationUser.allTimeAnalytics = allTimeAnalytics;

      const allTimeAnalyticsCollection: IAllTimeUserAnalytics[] = [{ id: 66952 }];
      jest.spyOn(allTimeUserAnalyticsService, 'query').mockReturnValue(of(new HttpResponse({ body: allTimeAnalyticsCollection })));
      const expectedCollection: IAllTimeUserAnalytics[] = [allTimeAnalytics, ...allTimeAnalyticsCollection];
      jest.spyOn(allTimeUserAnalyticsService, 'addAllTimeUserAnalyticsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      expect(allTimeUserAnalyticsService.query).toHaveBeenCalled();
      expect(allTimeUserAnalyticsService.addAllTimeUserAnalyticsToCollectionIfMissing).toHaveBeenCalledWith(
        allTimeAnalyticsCollection,
        allTimeAnalytics
      );
      expect(comp.allTimeAnalyticsCollection).toEqual(expectedCollection);
    });

    it('Should call Milestone query and add missing value', () => {
      const applicationUser: IApplicationUser = { id: 456 };
      const currentMilestone: IMilestone = { id: 6199 };
      applicationUser.currentMilestone = currentMilestone;

      const milestoneCollection: IMilestone[] = [{ id: 3405 }];
      jest.spyOn(milestoneService, 'query').mockReturnValue(of(new HttpResponse({ body: milestoneCollection })));
      const additionalMilestones = [currentMilestone];
      const expectedCollection: IMilestone[] = [...additionalMilestones, ...milestoneCollection];
      jest.spyOn(milestoneService, 'addMilestoneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      expect(milestoneService.query).toHaveBeenCalled();
      expect(milestoneService.addMilestoneToCollectionIfMissing).toHaveBeenCalledWith(
        milestoneCollection,
        ...additionalMilestones.map(expect.objectContaining)
      );
      expect(comp.milestonesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call KanbanTask query and add missing value', () => {
      const applicationUser: IApplicationUser = { id: 456 };
      const kanbanTask: IKanbanTask = { id: 85205 };
      applicationUser.kanbanTask = kanbanTask;

      const kanbanTaskCollection: IKanbanTask[] = [{ id: 73091 }];
      jest.spyOn(kanbanTaskService, 'query').mockReturnValue(of(new HttpResponse({ body: kanbanTaskCollection })));
      const additionalKanbanTasks = [kanbanTask];
      const expectedCollection: IKanbanTask[] = [...additionalKanbanTasks, ...kanbanTaskCollection];
      jest.spyOn(kanbanTaskService, 'addKanbanTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      expect(kanbanTaskService.query).toHaveBeenCalled();
      expect(kanbanTaskService.addKanbanTaskToCollectionIfMissing).toHaveBeenCalledWith(
        kanbanTaskCollection,
        ...additionalKanbanTasks.map(expect.objectContaining)
      );
      expect(comp.kanbanTasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Session query and add missing value', () => {
      const applicationUser: IApplicationUser = { id: 456 };
      const session: ISession = { id: 7098 };
      applicationUser.session = session;

      const sessionCollection: ISession[] = [{ id: 2185 }];
      jest.spyOn(sessionService, 'query').mockReturnValue(of(new HttpResponse({ body: sessionCollection })));
      const additionalSessions = [session];
      const expectedCollection: ISession[] = [...additionalSessions, ...sessionCollection];
      jest.spyOn(sessionService, 'addSessionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      expect(sessionService.query).toHaveBeenCalled();
      expect(sessionService.addSessionToCollectionIfMissing).toHaveBeenCalledWith(
        sessionCollection,
        ...additionalSessions.map(expect.objectContaining)
      );
      expect(comp.sessionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const applicationUser: IApplicationUser = { id: 456 };
      const internalUser: IUser = { id: 45793 };
      applicationUser.internalUser = internalUser;
      const allTimeAnalytics: IAllTimeUserAnalytics = { id: 40675 };
      applicationUser.allTimeAnalytics = allTimeAnalytics;
      const currentMilestone: IMilestone = { id: 60873 };
      applicationUser.currentMilestone = currentMilestone;
      const kanbanTask: IKanbanTask = { id: 60365 };
      applicationUser.kanbanTask = kanbanTask;
      const session: ISession = { id: 32642 };
      applicationUser.session = session;

      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(internalUser);
      expect(comp.allTimeAnalyticsCollection).toContain(allTimeAnalytics);
      expect(comp.milestonesSharedCollection).toContain(currentMilestone);
      expect(comp.kanbanTasksSharedCollection).toContain(kanbanTask);
      expect(comp.sessionsSharedCollection).toContain(session);
      expect(comp.applicationUser).toEqual(applicationUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUser>>();
      const applicationUser = { id: 123 };
      jest.spyOn(applicationUserFormService, 'getApplicationUser').mockReturnValue(applicationUser);
      jest.spyOn(applicationUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applicationUser }));
      saveSubject.complete();

      // THEN
      expect(applicationUserFormService.getApplicationUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(applicationUserService.update).toHaveBeenCalledWith(expect.objectContaining(applicationUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUser>>();
      const applicationUser = { id: 123 };
      jest.spyOn(applicationUserFormService, 'getApplicationUser').mockReturnValue({ id: null });
      jest.spyOn(applicationUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applicationUser }));
      saveSubject.complete();

      // THEN
      expect(applicationUserFormService.getApplicationUser).toHaveBeenCalled();
      expect(applicationUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUser>>();
      const applicationUser = { id: 123 };
      jest.spyOn(applicationUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(applicationUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAllTimeUserAnalytics', () => {
      it('Should forward to allTimeUserAnalyticsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(allTimeUserAnalyticsService, 'compareAllTimeUserAnalytics');
        comp.compareAllTimeUserAnalytics(entity, entity2);
        expect(allTimeUserAnalyticsService.compareAllTimeUserAnalytics).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMilestone', () => {
      it('Should forward to milestoneService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(milestoneService, 'compareMilestone');
        comp.compareMilestone(entity, entity2);
        expect(milestoneService.compareMilestone).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareKanbanTask', () => {
      it('Should forward to kanbanTaskService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(kanbanTaskService, 'compareKanbanTask');
        comp.compareKanbanTask(entity, entity2);
        expect(kanbanTaskService.compareKanbanTask).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSession', () => {
      it('Should forward to sessionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sessionService, 'compareSession');
        comp.compareSession(entity, entity2);
        expect(sessionService.compareSession).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
