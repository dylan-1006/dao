import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SessionFormService, SessionFormGroup } from './session-form.service';
import { ISession } from '../session.model';
import { SessionService } from '../service/session.service';
import { ISessionAnalytic } from 'app/entities/session-analytic/session-analytic.model';
import { SessionAnalyticService } from 'app/entities/session-analytic/service/session-analytic.service';
import { IKanbanBoard } from 'app/entities/kanban-board/kanban-board.model';
import { KanbanBoardService } from 'app/entities/kanban-board/service/kanban-board.service';
import { IPomodoroTimer } from 'app/entities/pomodoro-timer/pomodoro-timer.model';
import { PomodoroTimerService } from 'app/entities/pomodoro-timer/service/pomodoro-timer.service';
import { IPlaylist } from 'app/entities/playlist/playlist.model';
import { PlaylistService } from 'app/entities/playlist/service/playlist.service';

@Component({
  selector: 'jhi-session-update',
  templateUrl: './session-update.component.html',
})
export class SessionUpdateComponent implements OnInit {
  isSaving = false;
  session: ISession | null = null;

  sessionAnalyticsCollection: ISessionAnalytic[] = [];
  kanbanBoardsSharedCollection: IKanbanBoard[] = [];
  pomodoroTimersSharedCollection: IPomodoroTimer[] = [];
  playlistsSharedCollection: IPlaylist[] = [];

  editForm: SessionFormGroup = this.sessionFormService.createSessionFormGroup();

  constructor(
    protected sessionService: SessionService,
    protected sessionFormService: SessionFormService,
    protected sessionAnalyticService: SessionAnalyticService,
    protected kanbanBoardService: KanbanBoardService,
    protected pomodoroTimerService: PomodoroTimerService,
    protected playlistService: PlaylistService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSessionAnalytic = (o1: ISessionAnalytic | null, o2: ISessionAnalytic | null): boolean =>
    this.sessionAnalyticService.compareSessionAnalytic(o1, o2);

  compareKanbanBoard = (o1: IKanbanBoard | null, o2: IKanbanBoard | null): boolean => this.kanbanBoardService.compareKanbanBoard(o1, o2);

  comparePomodoroTimer = (o1: IPomodoroTimer | null, o2: IPomodoroTimer | null): boolean =>
    this.pomodoroTimerService.comparePomodoroTimer(o1, o2);

  comparePlaylist = (o1: IPlaylist | null, o2: IPlaylist | null): boolean => this.playlistService.comparePlaylist(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ session }) => {
      this.session = session;
      if (session) {
        this.updateForm(session);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const session = this.sessionFormService.getSession(this.editForm);
    if (session.id !== null) {
      this.subscribeToSaveResponse(this.sessionService.update(session));
    } else {
      this.subscribeToSaveResponse(this.sessionService.create(session));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISession>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(session: ISession): void {
    this.session = session;
    this.sessionFormService.resetForm(this.editForm, session);

    this.sessionAnalyticsCollection = this.sessionAnalyticService.addSessionAnalyticToCollectionIfMissing<ISessionAnalytic>(
      this.sessionAnalyticsCollection,
      session.sessionAnalytic
    );
    this.kanbanBoardsSharedCollection = this.kanbanBoardService.addKanbanBoardToCollectionIfMissing<IKanbanBoard>(
      this.kanbanBoardsSharedCollection,
      session.kanbanBoard
    );
    this.pomodoroTimersSharedCollection = this.pomodoroTimerService.addPomodoroTimerToCollectionIfMissing<IPomodoroTimer>(
      this.pomodoroTimersSharedCollection,
      session.pomodoroTimer
    );
    this.playlistsSharedCollection = this.playlistService.addPlaylistToCollectionIfMissing<IPlaylist>(
      this.playlistsSharedCollection,
      session.playlist
    );
  }

  protected loadRelationshipsOptions(): void {
    this.sessionAnalyticService
      .query({ filter: 'session-is-null' })
      .pipe(map((res: HttpResponse<ISessionAnalytic[]>) => res.body ?? []))
      .pipe(
        map((sessionAnalytics: ISessionAnalytic[]) =>
          this.sessionAnalyticService.addSessionAnalyticToCollectionIfMissing<ISessionAnalytic>(
            sessionAnalytics,
            this.session?.sessionAnalytic
          )
        )
      )
      .subscribe((sessionAnalytics: ISessionAnalytic[]) => (this.sessionAnalyticsCollection = sessionAnalytics));

    this.kanbanBoardService
      .query()
      .pipe(map((res: HttpResponse<IKanbanBoard[]>) => res.body ?? []))
      .pipe(
        map((kanbanBoards: IKanbanBoard[]) =>
          this.kanbanBoardService.addKanbanBoardToCollectionIfMissing<IKanbanBoard>(kanbanBoards, this.session?.kanbanBoard)
        )
      )
      .subscribe((kanbanBoards: IKanbanBoard[]) => (this.kanbanBoardsSharedCollection = kanbanBoards));

    this.pomodoroTimerService
      .query()
      .pipe(map((res: HttpResponse<IPomodoroTimer[]>) => res.body ?? []))
      .pipe(
        map((pomodoroTimers: IPomodoroTimer[]) =>
          this.pomodoroTimerService.addPomodoroTimerToCollectionIfMissing<IPomodoroTimer>(pomodoroTimers, this.session?.pomodoroTimer)
        )
      )
      .subscribe((pomodoroTimers: IPomodoroTimer[]) => (this.pomodoroTimersSharedCollection = pomodoroTimers));

    this.playlistService
      .query()
      .pipe(map((res: HttpResponse<IPlaylist[]>) => res.body ?? []))
      .pipe(
        map((playlists: IPlaylist[]) => this.playlistService.addPlaylistToCollectionIfMissing<IPlaylist>(playlists, this.session?.playlist))
      )
      .subscribe((playlists: IPlaylist[]) => (this.playlistsSharedCollection = playlists));
  }
}
