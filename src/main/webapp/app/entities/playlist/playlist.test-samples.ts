import { SongState } from 'app/entities/enumerations/song-state.model';

import { IPlaylist, NewPlaylist } from './playlist.model';

export const sampleWithRequiredData: IPlaylist = {
  id: 45404,
};

export const sampleWithPartialData: IPlaylist = {
  id: 63616,
};

export const sampleWithFullData: IPlaylist = {
  id: 58444,
  title: 'systems world-class',
  description: 'Malta Chief',
  state: SongState['STOPPED'],
  playlistURL: 'web-readiness',
};

export const sampleWithNewData: NewPlaylist = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
