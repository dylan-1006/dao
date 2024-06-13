import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPlaylist, NewPlaylist } from '../playlist.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlaylist for edit and NewPlaylistFormGroupInput for create.
 */
type PlaylistFormGroupInput = IPlaylist | PartialWithRequiredKeyOf<NewPlaylist>;

type PlaylistFormDefaults = Pick<NewPlaylist, 'id'>;

type PlaylistFormGroupContent = {
  id: FormControl<IPlaylist['id'] | NewPlaylist['id']>;
  title: FormControl<IPlaylist['title']>;
  description: FormControl<IPlaylist['description']>;
  state: FormControl<IPlaylist['state']>;
  playlistURL: FormControl<IPlaylist['playlistURL']>;
};

export type PlaylistFormGroup = FormGroup<PlaylistFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlaylistFormService {
  createPlaylistFormGroup(playlist: PlaylistFormGroupInput = { id: null }): PlaylistFormGroup {
    const playlistRawValue = {
      ...this.getFormDefaults(),
      ...playlist,
    };
    return new FormGroup<PlaylistFormGroupContent>({
      id: new FormControl(
        { value: playlistRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(playlistRawValue.title),
      description: new FormControl(playlistRawValue.description),
      state: new FormControl(playlistRawValue.state),
      playlistURL: new FormControl(playlistRawValue.playlistURL),
    });
  }

  getPlaylist(form: PlaylistFormGroup): IPlaylist | NewPlaylist {
    return form.getRawValue() as IPlaylist | NewPlaylist;
  }

  resetForm(form: PlaylistFormGroup, playlist: PlaylistFormGroupInput): void {
    const playlistRawValue = { ...this.getFormDefaults(), ...playlist };
    form.reset(
      {
        ...playlistRawValue,
        id: { value: playlistRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PlaylistFormDefaults {
    return {
      id: null,
    };
  }
}
