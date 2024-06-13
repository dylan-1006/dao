import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PlaylistFormService, PlaylistFormGroup } from './playlist-form.service';
import { IPlaylist } from '../playlist.model';
import { PlaylistService } from '../service/playlist.service';
import { SongState } from 'app/entities/enumerations/song-state.model';

@Component({
  selector: 'jhi-playlist-update',
  templateUrl: './playlist-update.component.html',
})
export class PlaylistUpdateComponent implements OnInit {
  isSaving = false;
  playlist: IPlaylist | null = null;
  songStateValues = Object.keys(SongState);

  editForm: PlaylistFormGroup = this.playlistFormService.createPlaylistFormGroup();

  constructor(
    protected playlistService: PlaylistService,
    protected playlistFormService: PlaylistFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ playlist }) => {
      this.playlist = playlist;
      if (playlist) {
        this.updateForm(playlist);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const playlist = this.playlistFormService.getPlaylist(this.editForm);
    if (playlist.id !== null) {
      this.subscribeToSaveResponse(this.playlistService.update(playlist));
    } else {
      this.subscribeToSaveResponse(this.playlistService.create(playlist));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlaylist>>): void {
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

  protected updateForm(playlist: IPlaylist): void {
    this.playlist = playlist;
    this.playlistFormService.resetForm(this.editForm, playlist);
  }
}
