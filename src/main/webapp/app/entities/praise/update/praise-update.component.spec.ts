import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PraiseFormService } from './praise-form.service';
import { PraiseService } from '../service/praise.service';
import { IPraise } from '../praise.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';

import { PraiseUpdateComponent } from './praise-update.component';

describe('Praise Management Update Component', () => {
  let comp: PraiseUpdateComponent;
  let fixture: ComponentFixture<PraiseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let praiseFormService: PraiseFormService;
  let praiseService: PraiseService;
  let applicationUserService: ApplicationUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PraiseUpdateComponent],
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
      .overrideTemplate(PraiseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PraiseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    praiseFormService = TestBed.inject(PraiseFormService);
    praiseService = TestBed.inject(PraiseService);
    applicationUserService = TestBed.inject(ApplicationUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUser query and add missing value', () => {
      const praise: IPraise = { id: 456 };
      const sender: IApplicationUser = { id: 74179 };
      praise.sender = sender;
      const receiver: IApplicationUser = { id: 51166 };
      praise.receiver = receiver;

      const applicationUserCollection: IApplicationUser[] = [{ id: 68122 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [sender, receiver];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ praise });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const praise: IPraise = { id: 456 };
      const sender: IApplicationUser = { id: 1091 };
      praise.sender = sender;
      const receiver: IApplicationUser = { id: 4850 };
      praise.receiver = receiver;

      activatedRoute.data = of({ praise });
      comp.ngOnInit();

      expect(comp.applicationUsersSharedCollection).toContain(sender);
      expect(comp.applicationUsersSharedCollection).toContain(receiver);
      expect(comp.praise).toEqual(praise);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPraise>>();
      const praise = { id: 123 };
      jest.spyOn(praiseFormService, 'getPraise').mockReturnValue(praise);
      jest.spyOn(praiseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ praise });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: praise }));
      saveSubject.complete();

      // THEN
      expect(praiseFormService.getPraise).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(praiseService.update).toHaveBeenCalledWith(expect.objectContaining(praise));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPraise>>();
      const praise = { id: 123 };
      jest.spyOn(praiseFormService, 'getPraise').mockReturnValue({ id: null });
      jest.spyOn(praiseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ praise: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: praise }));
      saveSubject.complete();

      // THEN
      expect(praiseFormService.getPraise).toHaveBeenCalled();
      expect(praiseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPraise>>();
      const praise = { id: 123 };
      jest.spyOn(praiseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ praise });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(praiseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareApplicationUser', () => {
      it('Should forward to applicationUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicationUserService, 'compareApplicationUser');
        comp.compareApplicationUser(entity, entity2);
        expect(applicationUserService.compareApplicationUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
