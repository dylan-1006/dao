import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ISession } from '../../entities/session/session.model';
import { IMessage } from '../../entities/message/message.model';
import { IKanbanTask } from '../../entities/kanban-task/kanban-task.model';
import { TaskStatus } from '../../entities/enumerations/task-status.model';
import { IKanbanBoard } from '../../entities/kanban-board/kanban-board.model';
import { IApplicationUser } from '../../entities/application-user/application-user.model';
import { isPresent } from '../../core/util/operators';

@Component({
  selector: 'jhi-analytics',
  templateUrl: './session-analytics.component.html',
  styleUrls: ['./session-analytics.component.scss'],
})
export class SessionAnalyticsComponent implements OnInit {
  @Input() currentSession: ISession | null = null;
  sessionId = this.currentSession?.id.toString();
  kanbanBoardId = this.currentSession?.kanbanBoard?.id.toString();
  messages: IMessage[] = [];
  pinnedMessages: IMessage[] = [];
  kanbanBoard!: IKanbanBoard;
  kanbanTask: IKanbanTask[] = [];
  inProgressTasks: IKanbanTask[] = [];
  toDoTasks: IKanbanTask[] = [];
  doneTasks: IKanbanTask[] = [];

  loggedInApplicationUser: IApplicationUser[] = [];
  loggedInUserNames: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.currentSession) {
      this.sessionId = this.currentSession.id.toString();
      this.kanbanBoardId = this.currentSession?.kanbanBoard?.id.toString();
      this.fetchMainAnalytics();
      this.pollForNewData();
    }
  }

  @ViewChild('sessionAnalytics') analytics!: ElementRef;

  pollForNewData() {
    setInterval(() => {
      this.fetchMainAnalytics();
    }, 5000);
  }

  fetchMessages() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDE4NzYyMH0.KmaFFRyIJsssVtVaSkjbLKCeWHkIyIj4bWUqCXM5CrQAQjL6LH2ydNYaXGZ2mwIsgb3u955wWt4q9nUeZ9PYwQ'
    );

    this.http.get<IMessage[]>(`/api/in-session-messages/${this.sessionId}`, { headers }).subscribe(messages => {
      messages.sort((a, b) => a.id - b.id);
      this.messages = messages;
      this.pinnedMessages = messages.filter(message => message.isPinned);
    });
  }

  fetchMembers() {
    this.loggedInUserNames = [];
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
    );
    this.http
      .post<IApplicationUser[]>(`api/application-users/get-application-users-by-session-id-post/`, this.currentSession, { headers })
      .subscribe(applicationUsers => {
        this.loggedInApplicationUser = applicationUsers;
      });
    for (let loggedInApplicationUserList of this.loggedInApplicationUser) {
      if (isPresent(loggedInApplicationUserList.internalUser)) {
        if (isPresent(loggedInApplicationUserList.internalUser.login)) {
          this.loggedInUserNames.push(loggedInApplicationUserList.internalUser.login);
        }
      } else {
        this.loggedInUserNames.push('Guest #' + loggedInApplicationUserList.id);
      }
    }
  }

  fetchKanbanTasks() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI5NjA1OH0._I9LvG0nrRF0tU9xoahRgPwpa1UQJWFKKgeh3bD7qklwDAyA1UxE7vB_d8l6gzMSPzEU9TzzSIxp2Qau7e_q_w'
    );

    this.http.get<IKanbanTask[]>(`api/in-kanban-board-kanban-tasks/${this.kanbanBoardId}`, { headers }).subscribe(kanbanTask => {
      this.kanbanTask = kanbanTask;
      console.log(this.kanbanTask);
      this.kanbanTask = kanbanTask.slice();
      this.inProgressTasks = this.kanbanTask.filter(task => task.taskStatus === TaskStatus.IN_PROGRESS);
      this.toDoTasks = this.kanbanTask.filter(task => task.taskStatus === TaskStatus.TODO);
      this.doneTasks = this.kanbanTask.filter(task => task.taskStatus === TaskStatus.DONE);
    });
  }

  fetchMainAnalytics() {
    this.fetchMessages();
    this.fetchKanbanTasks();
    this.fetchMembers();
  }
}
