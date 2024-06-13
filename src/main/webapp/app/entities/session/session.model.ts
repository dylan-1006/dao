import dayjs from 'dayjs/esm';
import { ISessionAnalytic } from 'app/entities/session-analytic/session-analytic.model';
import { IKanbanBoard } from 'app/entities/kanban-board/kanban-board.model';
import { IPomodoroTimer } from 'app/entities/pomodoro-timer/pomodoro-timer.model';
import { IPlaylist } from 'app/entities/playlist/playlist.model';

export interface ISession {
  id: number;
  title?: string | null;
  joinCode?: string | null;
  userIdList?: string | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  sessionAnalytic?: Pick<ISessionAnalytic, 'id'> | null;
  kanbanBoard?: Pick<IKanbanBoard, 'id'> | null;
  pomodoroTimer?: Pick<IPomodoroTimer, 'id'> | null;
  playlist?: Pick<IPlaylist, 'id'> | null;
}

export type NewSession = Omit<ISession, 'id'> & { id: null };
