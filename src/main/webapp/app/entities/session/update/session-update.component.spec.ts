import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SessionFormService } from './session-form.service';
import { SessionService } from '../service/session.service';
import { ISession } from '../session.model';
import { ISessionAnalytic } from 'app/entities/session-analytic/session-analytic.model';
import { SessionAnalyticService } from 'app/entities/session-analytic/service/session-analytic.service';
import { IKanbanBoard } from 'app/entities/kanban-board/kanban-board.model';
import { KanbanBoardService } from 'app/entities/kanban-board/service/kanban-board.service';
import { IPomodoroTimer } from 'app/entities/pomodoro-timer/pomodoro-timer.model';
import { PomodoroTimerService } from 'app/entities/pomodoro-timer/service/pomodoro-timer.service';
import { IPlaylist } from 'app/entities/playlist/playlist.model';
import { PlaylistService } from 'app/entities/playlist/service/playlist.service';

import { SessionUpdateComponent } from './session-update.component';

describe('Session Management Update Component', () => {
  let comp: SessionUpdateComponent;
  let fixture: ComponentFixture<SessionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sessionFormService: SessionFormService;
  let sessionService: SessionService;
  let sessionAnalyticService: SessionAnalyticService;
  let kanbanBoardService: KanbanBoardService;
  let pomodoroTimerService: PomodoroTimerService;
  let playlistService: PlaylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SessionUpdateComponent],
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
      .overrideTemplate(SessionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SessionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sessionFormService = TestBed.inject(SessionFormService);
    sessionService = TestBed.inject(SessionService);
    sessionAnalyticService = TestBed.inject(SessionAnalyticService);
    kanbanBoardService = TestBed.inject(KanbanBoardService);
    pomodoroTimerService = TestBed.inject(PomodoroTimerService);
    playlistService = TestBed.inject(PlaylistService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call sessionAnalytic query and add missing value', () => {
      const session: ISession = { id: 456 };
      const sessionAnalytic: ISessionAnalytic = { id: 68824 };
      session.sessionAnalytic = sessionAnalytic;

      const sessionAnalyticCollection: ISessionAnalytic[] = [{ id: 71192 }];
      jest.spyOn(sessionAnalyticService, 'query').mockReturnValue(of(new HttpResponse({ body: sessionAnalyticCollection })));
      const expectedCollection: ISessionAnalytic[] = [sessionAnalytic, ...sessionAnalyticCollection];
      jest.spyOn(sessionAnalyticService, 'addSessionAnalyticToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ session });
      comp.ngOnInit();

      expect(sessionAnalyticService.query).toHaveBeenCalled();
      expect(sessionAnalyticService.addSessionAnalyticToCollectionIfMissing).toHaveBeenCalledWith(
        sessionAnalyticCollection,
        sessionAnalytic
      );
      expect(comp.sessionAnalyticsCollection).toEqual(expectedCollection);
    });

    it('Should call KanbanBoard query and add missing value', () => {
      const session: ISession = { id: 456 };
      const kanbanBoard: IKanbanBoard = { id: 53567 };
      session.kanbanBoard = kanbanBoard;

      const kanbanBoardCollection: IKanbanBoard[] = [{ id: 65952 }];
      jest.spyOn(kanbanBoardService, 'query').mockReturnValue(of(new HttpResponse({ body: kanbanBoardCollection })));
      const additionalKanbanBoards = [kanbanBoard];
      const expectedCollection: IKanbanBoard[] = [...additionalKanbanBoards, ...kanbanBoardCollection];
      jest.spyOn(kanbanBoardService, 'addKanbanBoardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ session });
      comp.ngOnInit();

      expect(kanbanBoardService.query).toHaveBeenCalled();
      expect(kanbanBoardService.addKanbanBoardToCollectionIfMissing).toHaveBeenCalledWith(
        kanbanBoardCollection,
        ...additionalKanbanBoards.map(expect.objectContaining)
      );
      expect(comp.kanbanBoardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PomodoroTimer query and add missing value', () => {
      const session: ISession = { id: 456 };
      const pomodoroTimer: IPomodoroTimer = { id: 49963 };
      session.pomodoroTimer = pomodoroTimer;

      const pomodoroTimerCollection: IPomodoroTimer[] = [{ id: 38180 }];
      jest.spyOn(pomodoroTimerService, 'query').mockReturnValue(of(new HttpResponse({ body: pomodoroTimerCollection })));
      const additionalPomodoroTimers = [pomodoroTimer];
      const expectedCollection: IPomodoroTimer[] = [...additionalPomodoroTimers, ...pomodoroTimerCollection];
      jest.spyOn(pomodoroTimerService, 'addPomodoroTimerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ session });
      comp.ngOnInit();

      expect(pomodoroTimerService.query).toHaveBeenCalled();
      expect(pomodoroTimerService.addPomodoroTimerToCollectionIfMissing).toHaveBeenCalledWith(
        pomodoroTimerCollection,
        ...additionalPomodoroTimers.map(expect.objectContaining)
      );
      expect(comp.pomodoroTimersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Playlist query and add missing value', () => {
      const session: ISession = { id: 456 };
      const playlist: IPlaylist = { id: 7670 };
      session.playlist = playlist;

      const playlistCollection: IPlaylist[] = [{ id: 39054 }];
      jest.spyOn(playlistService, 'query').mockReturnValue(of(new HttpResponse({ body: playlistCollection })));
      const additionalPlaylists = [playlist];
      const expectedCollection: IPlaylist[] = [...additionalPlaylists, ...playlistCollection];
      jest.spyOn(playlistService, 'addPlaylistToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ session });
      comp.ngOnInit();

      expect(playlistService.query).toHaveBeenCalled();
      expect(playlistService.addPlaylistToCollectionIfMissing).toHaveBeenCalledWith(
        playlistCollection,
        ...additionalPlaylists.map(expect.objectContaining)
      );
      expect(comp.playlistsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const session: ISession = { id: 456 };
      const sessionAnalytic: ISessionAnalytic = { id: 6604 };
      session.sessionAnalytic = sessionAnalytic;
      const kanbanBoard: IKanbanBoard = { id: 952 };
      session.kanbanBoard = kanbanBoard;
      const pomodoroTimer: IPomodoroTimer = { id: 8694 };
      session.pomodoroTimer = pomodoroTimer;
      const playlist: IPlaylist = { id: 19910 };
      session.playlist = playlist;

      activatedRoute.data = of({ session });
      comp.ngOnInit();

      expect(comp.sessionAnalyticsCollection).toContain(sessionAnalytic);
      expect(comp.kanbanBoardsSharedCollection).toContain(kanbanBoard);
      expect(comp.pomodoroTimersSharedCollection).toContain(pomodoroTimer);
      expect(comp.playlistsSharedCollection).toContain(playlist);
      expect(comp.session).toEqual(session);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISession>>();
      const session = { id: 123 };
      jest.spyOn(sessionFormService, 'getSession').mockReturnValue(session);
      jest.spyOn(sessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ session });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: session }));
      saveSubject.complete();

      // THEN
      expect(sessionFormService.getSession).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sessionService.update).toHaveBeenCalledWith(expect.objectContaining(session));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISession>>();
      const session = { id: 123 };
      jest.spyOn(sessionFormService, 'getSession').mockReturnValue({ id: null });
      jest.spyOn(sessionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ session: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: session }));
      saveSubject.complete();

      // THEN
      expect(sessionFormService.getSession).toHaveBeenCalled();
      expect(sessionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISession>>();
      const session = { id: 123 };
      jest.spyOn(sessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ session });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sessionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSessionAnalytic', () => {
      it('Should forward to sessionAnalyticService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sessionAnalyticService, 'compareSessionAnalytic');
        comp.compareSessionAnalytic(entity, entity2);
        expect(sessionAnalyticService.compareSessionAnalytic).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareKanbanBoard', () => {
      it('Should forward to kanbanBoardService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(kanbanBoardService, 'compareKanbanBoard');
        comp.compareKanbanBoard(entity, entity2);
        expect(kanbanBoardService.compareKanbanBoard).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePomodoroTimer', () => {
      it('Should forward to pomodoroTimerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(pomodoroTimerService, 'comparePomodoroTimer');
        comp.comparePomodoroTimer(entity, entity2);
        expect(pomodoroTimerService.comparePomodoroTimer).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePlaylist', () => {
      it('Should forward to playlistService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(playlistService, 'comparePlaylist');
        comp.comparePlaylist(entity, entity2);
        expect(playlistService.comparePlaylist).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
