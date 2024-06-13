import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ISession } from '../../entities/session/session.model';
import { isPresent } from '../../core/util/operators';
import { NgForm } from '@angular/forms';
import { FontSizeService } from '../../shared/font-size.service';

@Component({
  selector: 'jhi-new-session-form',
  templateUrl: './new-session-form.component.html',
  styleUrls: ['./new-session-form.component.scss'],
})
export class NewSessionFormComponent implements OnInit {
  session: ISession | null = null;
  title: string = '';
  code: string | null | undefined;
  fsValue = 'fs-1';
  showCopyMessage: boolean = false;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private fontSizeService: FontSizeService
  ) {
    this.fontSizeService.fsSubject.subscribe((fontSize: string) => {
      this.fsValue = fontSize; // Update the font size value
      console.log(`Current fsvalue: ${this.fsValue}`);
    });
  }

  ngOnInit(): void {
    console.log('this is the new session form');
    this.code = this.data.session.joinCode;
    this.session = this.data.session;
  }

  createGroup(): void {
    if (isPresent(this.session)) {
      this.session.title = this.title;
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
    );
    const withCredential = true;

    this.http.put(`/api/sessions/${this.session?.id}`, this.session, { headers }).subscribe(next => {
      this.router.navigate(['/focus-session'], { queryParams: { code: this.session?.joinCode } });
      this.dialog.closeAll();
    });
  }

  closePopup(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDQyNDgyN30.aAg453rznblcNOkDENhoR2Y4pC8cCbBOkGieuePaEle0tPfFxBVX-Gb8Kg_M58lcd3udycoRGgkMC8rBY01SBQ'
    );
    const withCredentials = true;
    this.http.delete(`/api/sessions/${this.session?.id}`, { headers, withCredentials }).subscribe(
      next => {
        this.dialog.closeAll();
      },
      error => {
        console.error('Error deleting session: ', error);
      }
    );
  }

  copyCodeToClipboard(text: string | null | undefined): void {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    // Set the text content to the text you want to copy
    if (typeof text === 'string') {
      textarea.value = text;
    }
    // Set the position to absolute to make sure it's not displayed
    textarea.style.position = 'absolute';
    // Set the left property to -9999px to move it off-screen
    textarea.style.left = '-9999px';
    // Append the textarea to the document body
    document.body.appendChild(textarea);
    // Select the textarea
    textarea.select();
    // Execute the copy command
    document.execCommand('copy');
    // Remove the textarea from the document body
    document.body.removeChild(textarea);
    this.showCopyMessage = true;

    // Hide message after 2 seconds
    setTimeout(() => {
      this.showCopyMessage = false;
    }, 2000);
  }
}
