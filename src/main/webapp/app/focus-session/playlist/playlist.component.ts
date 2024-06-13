import { Component, Inject, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ISession } from '../../entities/session/session.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IPlaylist } from '../../entities/playlist/playlist.model';

@Component({
  selector: 'jhi-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  @Input() currentSession: ISession | null = null;
  sessionId = this.currentSession?.id.toString();
  playlistId: number | undefined = this.currentSession?.playlist?.id;
  playlist!: IPlaylist;
  currentPlaylist: IPlaylist | null | undefined = null;
  defaultPlaylistLink = '5CXNRTt3lnMBZ4UzmhoVi7?';
  playlistLink: string | null | undefined = null;
  playlistSrc: SafeResourceUrl = `https://open.spotify.com/embed/playlist/${this.defaultPlaylistLink}?utm_source=generator&theme=0`;
  editedPlaylist: any = '';
  editedPlaylistUrl: string | null | undefined = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    //this.updatePlaylistSrc(this.defaultPlaylistLink);
    if (this.currentSession) {
      this.sessionId = this.currentSession.id.toString();
      this.playlistId = this.currentSession.playlist?.id;
      console.log('this is the sessionId' + this.sessionId);
      console.log('this is the kanbanBoardId' + this.playlistId);
      this.fetchPlaylist();
    }
  }

  fetchPlaylist(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI5NjA1OH0._I9LvG0nrRF0tU9xoahRgPwpa1UQJWFKKgeh3bD7qklwDAyA1UxE7vB_d8l6gzMSPzEU9TzzSIxp2Qau7e_q_w'
    );

    this.http.get<IPlaylist>(`api/playlists/${this.playlistId}`, { headers }).subscribe(currentPlaylist => {
      this.currentPlaylist = currentPlaylist;
      this.playlistLink = this.currentPlaylist.playlistURL;
      this.changePlaylist();
    });
  }

  changePlaylist(): void {
    if (this.playlistLink) {
      this.editedPlaylistUrl = this.playlistLink;
      // Extract playlist identifier from full Spotify playlist link
      const regexResult = this.playlistLink.match(/playlist\/([^?]+)/);
      this.playlistLink = '';
      if (regexResult && regexResult.length > 1) {
        const playlistId = regexResult[1];
        this.updatePlaylistSrc(playlistId);
        //this.editedPlaylistUrl = this.playlistLink;
        this.updateUserPlaylistPreference();
      }
    }
  }

  updatePlaylistSrc(playlistId: string): void {
    const playlistURL = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
    this.playlistSrc = this.sanitizer.bypassSecurityTrustResourceUrl(playlistURL);
  }

  updateUserPlaylistPreference(): void {
    if (this.editedPlaylistUrl && this.playlistId) {
      console.log('Playlist ID:', this.playlistId);

      const headers = new HttpHeaders()
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI4MzgxNX0.m-98LCrPjzQeYn4JjntfaUYEoP5XsvgI5P0V6QAR0KwRqhCIN7dfi7EoRxAhQv4xho_v-fiGZ3v_tqIVmKvfQg'
        )
        .set('Content-Type', 'application/json');

      const editedPlaylist = {
        id: this.playlistId,
        playlistURL: this.editedPlaylistUrl,
      };

      this.http.put<IPlaylist>(`api/playlists/${this.playlistId}`, editedPlaylist, { headers }).subscribe(
        response => {
          console.log('Message sent successfully:', response);
        },
        error => {
          console.error('Error editing label:', error);
        }
      );
    }
  }
}
