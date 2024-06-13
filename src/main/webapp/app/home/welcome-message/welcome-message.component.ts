import { Component, Inject, OnInit } from '@angular/core';
import { ApplicationUserManager } from '../applicationUserManager';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IKanbanTask } from '../../entities/kanban-task/kanban-task.model';
import { TaskStatus } from '../../entities/enumerations/task-status.model';
import { IApplicationUser } from '../../entities/application-user/application-user.model';
import { IUser } from '../../admin/user-management/user-management.model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-welcome-message',
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.scss'],
})
export class WelcomeMessageComponent implements OnInit {
  loggedInApplicationUser!: IApplicationUser;
  constructor(private http: HttpClient, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: { loggedInUserId: number }) {}

  ngOnInit(): void {
    this.fetchLoggedInUser();
  }

  fetchLoggedInUser() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
    );

    this.http.get<IApplicationUser>(`api/application-users/${this.data.loggedInUserId}`, { headers }).subscribe(
      loggedInApplicationUser => {
        this.loggedInApplicationUser = loggedInApplicationUser;
        console.log('this is the application user ' + this.loggedInApplicationUser.id);
      },
      error => {
        console.error('Error getting application user:', error);
      }
    );
  }
}
