import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IApplicationUser } from '../entities/application-user/application-user.model';
import { Account } from '../core/auth/account.model';
import { SessionStorageService } from 'ngx-webstorage';
import { Injectable } from '@angular/core';
import { IMessage } from '../entities/message/message.model';
import { IAllTimeUserAnalytics } from '../entities/all-time-user-analytics/all-time-user-analytics.model';
import { IKanbanTask } from '../entities/kanban-task/kanban-task.model';
import { ISession } from '../entities/session/session.model';
import { WelcomeMessageComponent } from './welcome-message/welcome-message.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ApplicationUserManager {
  account: Account | null = null;
  appUser: IApplicationUser | null = null;
  fetchedAppUser: IApplicationUser | null = null;
  loggedInUserId: number = 0;

  constructor(private sessionStorageService: SessionStorageService, private http: HttpClient, public dialog: MatDialog) {}

  AppUserIDKey: string = 'currentApplicationUserID';

  dealWithApplicationUser(inAccount: Account | null = null): void {
    this.account = inAccount;

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
    );
    const withCredentials = true;

    if (this.account != null) {
      this.http
        .post<IApplicationUser>(`/api/application-users/get-application-user-by-internal-user/`, this.account, { headers, withCredentials })
        .subscribe(data => {
          this.appUser = data;
          //this.createAllTimeAnalyticsForUser(data);
          this.sessionStorageService.store(this.AppUserIDKey, this.appUser.id);
          if (this.loggedInUserId != this.getCurrentApplicationUserID()) {
            this.loggedInUserId = this.getCurrentApplicationUserID();
            this.openWelcomePopUp();
          }
        });
    } else {
      if (this.sessionStorageService.retrieve(this.AppUserIDKey) == null) {
        this.http
          .post<IApplicationUser>('/api/application-users/new-application-user', null, { headers, withCredentials })
          .subscribe(data => {
            this.appUser = data;
            // this.createAllTimeAnalyticsForUser(data);
            if (this.appUser != null) {
              this.sessionStorageService.store(this.AppUserIDKey, this.appUser.id);
            }
          });
      }
    }
  }

  openWelcomePopUp() {
    const dialogRef = this.dialog.open(WelcomeMessageComponent, {
      height: '87%',
      width: '100%',

      data: { loggedInUserId: this.loggedInUserId },
    });
  }

  createAllTimeAnalyticsForUser(createdNewApplicationUser: IApplicationUser) {
    let allTimeUserAnalyticsId: number = 0;
    console.log(this.appUser?.id);

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
    );

    const newAllTimeUserAnalytics = {
      allTimeUserAnalyticsId: '',
    };

    this.http.post<IAllTimeUserAnalytics>('api/all-time-user-analytics', newAllTimeUserAnalytics, { headers }).subscribe(
      response => {
        console.log('Message sent successfully:', response);
        allTimeUserAnalyticsId = response.id;

        const updatedApplicationUser = {
          id: createdNewApplicationUser.id,
          internalUser: createdNewApplicationUser.internalUser,
          allTimeAnalytics: { id: allTimeUserAnalyticsId },
        };

        this.http
          .put<IApplicationUser>(`/api/application-users/${createdNewApplicationUser.id}`, updatedApplicationUser, { headers })
          .subscribe(
            data => {
              console.log('Message sent successfully:', data);
              this.appUser = data;
            },
            error => {
              console.error('Error editing application user:', error);
            }
          );
      },
      error => {
        console.error('Error adding all time user analytics:', error);
      }
    );
  }

  wipeApplicationUser(): void {
    this.sessionStorageService.store(this.AppUserIDKey, null);
  }

  getCurrentApplicationUserID(): number {
    return this.sessionStorageService.retrieve(this.AppUserIDKey);
  }

  getCurrentApplicationUser(): IApplicationUser {
    const currentUserId = this.sessionStorageService.retrieve(this.AppUserIDKey);
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDE4NzYyMH0.KmaFFRyIJsssVtVaSkjbLKCeWHkIyIj4bWUqCXM5CrQAQjL6LH2ydNYaXGZ2mwIsgb3u955wWt4q9nUeZ9PYwQ'
    );

    this.http.get<IApplicationUser>(`/api/application-users/${currentUserId}`, { headers }).subscribe(user => {
      this.fetchedAppUser = user;
    });
    return <IApplicationUser>this.fetchedAppUser;
  }

  deleteApplicationUser(id: number): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
    );
    const withCredentials = true;

    this.http.delete(`/api/application-users/${id}`, { headers, withCredentials }).subscribe();
  }
}
