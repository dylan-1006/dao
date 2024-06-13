import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISession } from '../../entities/session/session.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationUserManager } from '../../home/applicationUserManager';
import { IApplicationUser } from '../../entities/application-user/application-user.model';
import { isPresent } from '../../core/util/operators';

@Component({
  selector: 'jhi-focus-session-main-screen',
  templateUrl: './focus-session-main-screen.component.html',
  styleUrls: ['./focus-session-main-screen.component.scss'],
})
export class FocusSessionMainScreenComponent implements OnInit, OnDestroy {
  currentSession: ISession | null = null;
  isLoading: boolean = true;
  sessionSet: boolean = false;
  currentUser: IApplicationUser | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private applicationUserManager: ApplicationUserManager
  ) {}

  ngOnInit(): void {
    // Get the query parameters from the activated route
    this.activatedRoute.queryParams.subscribe(params => {
      const joinCode = params['code']; // Get the joinCode query parameter
      this.getSessionFromJoinCode(Number(joinCode));
      this.setApplicationUserCurrentSession();
      this.retrySettingSession();
      this.pollTitle(Number(joinCode));
    });
  }

  ngOnDestroy(): void {
    this.clearApplicationUserCurrentSession();
  }

  getSessionFromJoinCode(joinCode: number): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDE4NzYyMH0.KmaFFRyIJsssVtVaSkjbLKCeWHkIyIj4bWUqCXM5CrQAQjL6LH2ydNYaXGZ2mwIsgb3u955wWt4q9nUeZ9PYwQ'
    );
    this.http.get<ISession>(`/api/sessions/getSessionFromJoinCode/${joinCode}`, { headers }).subscribe(
      (session: ISession | null) => {
        this.currentSession = session;
        this.isLoading = false;
      },
      error => {
        // Handle error here, e.g., display an error message
        console.error('Error fetching session:', error);
        this.isLoading = false;
      }
    );
  }

  displayKanBanSideBar(isKanBanSideBarVisible: boolean): void {
    const kanbanElement1 = document.getElementById('kanban-side-bar') as HTMLElement;
    const chatElement1 = document.getElementById('chat-side-bar') as HTMLElement;
    const playlistElement1 = document.getElementById('playlist') as HTMLElement;
    const analyticsElement1 = document.getElementById('analytics') as HTMLElement;
    chatElement1.style.display = 'none';
    playlistElement1.style.display = 'none';
    kanbanElement1.style.display = isKanBanSideBarVisible ? 'flex' : 'none';
    analyticsElement1.style.display = 'none';
  }
  displayChatSideBar(isChatSideBarVisible: boolean): void {
    const kanbanElement2 = document.getElementById('kanban-side-bar') as HTMLElement;
    const chatElement2 = document.getElementById('chat-side-bar') as HTMLElement;
    const playlistElement2 = document.getElementById('playlist') as HTMLElement;
    const analyticsElement2 = document.getElementById('analytics') as HTMLElement;
    kanbanElement2.style.display = 'none';
    playlistElement2.style.display = 'none';
    chatElement2.style.display = isChatSideBarVisible ? 'flex' : 'none';
    analyticsElement2.style.display = 'none';
  }

  displayTimer(isTimerVisible: boolean): void {
    const timerElement = document.getElementById('timer') as HTMLElement;
    timerElement.style.display = isTimerVisible ? 'block' : 'none';
  }

  displayPlaylist(isPlaylistVisible: boolean): void {
    const kanbanElement3 = document.getElementById('kanban-side-bar') as HTMLElement;
    const chatElement3 = document.getElementById('chat-side-bar') as HTMLElement;
    const playlistElement3 = document.getElementById('playlist') as HTMLElement;
    const analyticsElement3 = document.getElementById('analytics') as HTMLElement;
    kanbanElement3.style.display = 'none';
    chatElement3.style.display = 'none';
    playlistElement3.style.display = isPlaylistVisible ? 'flex' : 'none';
    analyticsElement3.style.display = 'none';
  }

  displayAnalytics(isAnalyticsVisible: boolean): void {
    const kanbanElement4 = document.getElementById('kanban-side-bar') as HTMLElement;
    const chatElement4 = document.getElementById('chat-side-bar') as HTMLElement;
    const playlistElement4 = document.getElementById('playlist') as HTMLElement;
    const analyticsElement4 = document.getElementById('analytics') as HTMLElement;
    kanbanElement4.style.display = 'none';
    chatElement4.style.display = 'none';
    playlistElement4.style.display = 'none';
    analyticsElement4.style.display = isAnalyticsVisible ? 'flex' : 'none';
  }

  endSession(): void {
    // Show confirmation dialog before navigating back
    const confirmNavigation = confirm('Are you sure you want to leave the focus session?');

    if (confirmNavigation) {
      // Navigate back to the home screen
      this.router.navigate(['']);
    }
  }

  setApplicationUserCurrentSession(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDE4NzYyMH0.KmaFFRyIJsssVtVaSkjbLKCeWHkIyIj4bWUqCXM5CrQAQjL6LH2ydNYaXGZ2mwIsgb3u955wWt4q9nUeZ9PYwQ'
    );

    let currentUserID = this.applicationUserManager.getCurrentApplicationUserID();
    this.http.get<IApplicationUser>(`/api/application-users/${currentUserID}`, { headers }).subscribe(
      data => {
        let currentUser = data;
        currentUser.session = this.currentSession;
        this.currentUser = currentUser;
        if (this.currentSession != null) {
          this.sessionSet = true;
        }

        this.http.put<IApplicationUser>(`/api/application-users/${currentUserID}`, currentUser, { headers }).subscribe(
          next => {},
          error => {
            console.error('Error saving current session to application user: ', error);
          }
        );
      },
      error => {
        console.error('Error getting application user: ', error);
      }
    );
  }

  retrySettingSession(): void {
    setInterval(() => {
      if (!this.sessionSet) {
        this.setApplicationUserCurrentSession();
      }
    }, 100);
  }

  clearApplicationUserCurrentSession(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDE4NzYyMH0.KmaFFRyIJsssVtVaSkjbLKCeWHkIyIj4bWUqCXM5CrQAQjL6LH2ydNYaXGZ2mwIsgb3u955wWt4q9nUeZ9PYwQ'
    );
    if (isPresent(this.currentUser)) {
      this.currentUser.session = null;
      this.http.put<IApplicationUser>(`/api/application-users/${this.currentUser.id}`, this.currentUser, { headers }).subscribe(
        next => {},
        error => {
          console.error('Error wiping current session from application user: ', error);
        }
      );
    }
  }

  pollTitle(joinCode: number): void {
    setInterval(() => this.updateSessionTitle(joinCode), 1000);
  }

  updateSessionTitle(joinCode: number): void {
    if (!isPresent(this.currentSession?.title) || this.currentSession?.title == 'No title') {
      const headers = new HttpHeaders().set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDE4NzYyMH0.KmaFFRyIJsssVtVaSkjbLKCeWHkIyIj4bWUqCXM5CrQAQjL6LH2ydNYaXGZ2mwIsgb3u955wWt4q9nUeZ9PYwQ'
      );
      this.http.get<ISession>(`/api/sessions/getSessionFromJoinCode/${joinCode}`, { headers }).subscribe(
        (session: ISession | null) => {
          if (isPresent(this.currentSession) && isPresent(session)) {
            this.currentSession.title = session.title;
          }
        },
        error => {
          // Handle error here, e.g., display an error message
          console.error('Error fetching session:', error);
        }
      );
    }
  }
}
