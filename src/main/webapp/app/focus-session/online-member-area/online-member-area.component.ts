import { Component, OnInit, Input } from '@angular/core';
import { FontSizeService } from '../../shared/font-size.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ISession } from '../../entities/session/session.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-online-member-area',
  templateUrl: './online-member-area.component.html',
  styleUrls: ['./online-member-area.component.scss'],
})
export class OnlineMemberAreaComponent implements OnInit {
  fsValue = 'fs-1';
  @Input() currentSession: ISession | null = null;
  SessionJoinCode: string | null | undefined;
  NumberOfPeersOnline = 0;

  constructor(private fontSizeService: FontSizeService, private activatedRoute: ActivatedRoute, private http: HttpClient) {
    this.fontSizeService.fsSubject.subscribe((fontSize: string) => {
      this.fsValue = fontSize; // Update the font size value
    });
  }

  ngOnInit(): void {
    if (this.currentSession != null) {
      this.SessionJoinCode = this.currentSession.joinCode;
    }
    this.updateOnlineNumber();
    this.pollForNewOnlineNumber();
  }

  pollForNewOnlineNumber(): void {
    setInterval(() => this.updateOnlineNumber(), 4000);
  }

  updateOnlineNumber(): void {
    if (this.SessionJoinCode != null && this.SessionJoinCode != undefined) {
      const headers = new HttpHeaders().set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
      );

      const withCredentials = true;
      this.http.get<ISession>(`/api/sessions/getSessionFromJoinCode/${this.SessionJoinCode}`, { headers, withCredentials }).subscribe(
        session => {
          this.http
            .post<number>(`/api/application-users/get-number-of-users-by-session-id`, session.id, { headers, withCredentials })
            .subscribe(
              amount => {
                this.NumberOfPeersOnline = amount;
              },
              error => {
                console.error('Error getting application users by session: ', error);
              }
            );
        },
        error => {
          console.error('Error getting session from join code: ', error);
        }
      );
    }
  }
}
