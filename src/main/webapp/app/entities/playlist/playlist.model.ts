import { SongState } from 'app/entities/enumerations/song-state.model';

export interface IPlaylist {
  id: number;
  title?: string | null;
  description?: string | null;
  state?: SongState | null;
  playlistURL?: string | null;
}

export type NewPlaylist = Omit<IPlaylist, 'id'> & { id: null };
