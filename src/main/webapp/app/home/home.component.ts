import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { joinCode } from './joinCode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ISession } from '../entities/session/session.model';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { IKanbanBoard } from '../entities/kanban-board/kanban-board.model';
import { IPomodoroTimer } from '../entities/pomodoro-timer/pomodoro-timer.model';
import { IPlaylist } from '../entities/playlist/playlist.model';
import { ApplicationUserManager } from './applicationUserManager';
import { FontSizeService } from '../shared/font-size.service';
import { ExpandedKanbanViewComponent } from '../focus-session/kanban-side-bar/expanded-kanban-view/expanded-kanban-view.component';
import { WelcomeMessageComponent } from './welcome-message/welcome-message.component';

import { NewSessionFormComponent } from './new-session-form/new-session-form-component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  session: ISession | null = null;
  fsValue = 'fs-1';
  loggedInUserId: number = 0;
  errorJoining: boolean = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private http: HttpClient,
    private applicationUserManager: ApplicationUserManager,
    private fontSizeService: FontSizeService,
    public dialog: MatDialog
  ) {
    this.fontSizeService.fsSubject.subscribe((fontSize: string) => {
      this.fsValue = fontSize; // Update the font size value
    });
  }

  ngOnInit(): void {
    console.log('Home Screen Initiated');
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        this.applicationUserManager.dealWithApplicationUser(this.account);
      });
    this.applicationUserManager.dealWithApplicationUser(this.account);
  }

  openWelcomePopUp() {
    const dialogRef = this.dialog.open(WelcomeMessageComponent, {
      height: '87%',
      width: '100%',

      data: { loggedInUserId: this.loggedInUserId },
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createNewSession() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
    );

    this.http.post<ISession>('/api/sessions/newSession', null, { headers }).subscribe(data => {
      this.session = data;
      this.createSessionRelevantEntities(data);
    });
  }

  createSessionRelevantEntities(createdNewSession: ISession) {
    let kanbanBoardId = 0;
    let pomodoroTimerId = 0;
    let playlistId = 0;

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
    );

    const newKanbanBoard = {
      title: 'New Kanban Board',
      description: 'No description',
    };

    const newPomodoroTimer = {
      pomodoroTimerId: ' ',
    };

    const newPlaylist = {
      playlistURL: 'https://open.spotify.com/embed/playlist/5CXNRTt3lnMBZ4UzmhoVi7?utm_source=generator&theme=0',
    };

    this.http.post<IKanbanBoard>('/api/kanban-boards', newKanbanBoard, { headers }).subscribe(
      response => {
        console.log('Message sent successfully:', response);
        kanbanBoardId = response.id;
        this.http.post<IPomodoroTimer>('/api/pomodoro-timers', newPomodoroTimer, { headers }).subscribe(
          response => {
            console.log('Message sent successfully:', response);
            pomodoroTimerId = response.id;
            this.http.post<IPlaylist>('/api/playlists', newPlaylist, { headers }).subscribe(
              response => {
                console.log('Message sent successfully:', response);
                playlistId = response.id;

                const updatedSession = {
                  id: createdNewSession.id,
                  title: createdNewSession.title,
                  joinCode: createdNewSession.joinCode,
                  kanbanBoard: { id: kanbanBoardId },
                  pomodoroTimer: { id: pomodoroTimerId },
                  playlist: { id: playlistId },
                };

                this.http.put<ISession>(`/api/sessions/${createdNewSession.id}`, updatedSession, { headers }).subscribe(
                  data => {
                    console.log('Message sent successfully:', data);
                    this.session = data;

                    const dialogRef = this.dialog.open(NewSessionFormComponent, {
                      height: 'auto',
                      width: 'auto',
                      minWidth: '30%',
                      disableClose: true,

                      data: { session: this.session },
                    });
                  },
                  error => {
                    console.error('Error editing session:', error);
                  }
                );
              },
              error => {
                console.error('Error creating playlist:', error);
              }
            );
          },
          error => {
            console.error('Error creating timer:', error);
          }
        );
      },
      error => {
        console.error('Error creating kanbanboard:', error);
      }
    );
  }

  code = new joinCode('');

  joinExistingSession(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
    );

    const withCredentials = true;
    this.http.get<ISession>(`/api/sessions/getSessionFromJoinCode/${this.code.code}`, { headers, withCredentials }).subscribe(
      data => {
        this.session = data;
        this.router.navigate(['/focus-session'], { queryParams: { code: this.session?.joinCode } });
      },
      error => {
        this.errorJoining = true;
        this.code.code = '';
        console.error('Error getting session: ', error);
      }
    );
  }
}
