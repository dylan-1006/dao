import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'application-user',
        data: { pageTitle: 'ApplicationUsers' },
        loadChildren: () => import('./application-user/application-user.module').then(m => m.ApplicationUserModule),
      },
      {
        path: 'all-time-user-analytics',
        data: { pageTitle: 'AllTimeUserAnalytics' },
        loadChildren: () => import('./all-time-user-analytics/all-time-user-analytics.module').then(m => m.AllTimeUserAnalyticsModule),
      },
      {
        path: 'session-analytic',
        data: { pageTitle: 'SessionAnalytics' },
        loadChildren: () => import('./session-analytic/session-analytic.module').then(m => m.SessionAnalyticModule),
      },
      {
        path: 'session',
        data: { pageTitle: 'Sessions' },
        loadChildren: () => import('./session/session.module').then(m => m.SessionModule),
      },
      {
        path: 'message',
        data: { pageTitle: 'Messages' },
        loadChildren: () => import('./message/message.module').then(m => m.MessageModule),
      },
      {
        path: 'attachment',
        data: { pageTitle: 'Attachments' },
        loadChildren: () => import('./attachment/attachment.module').then(m => m.AttachmentModule),
      },
      {
        path: 'praise',
        data: { pageTitle: 'Praises' },
        loadChildren: () => import('./praise/praise.module').then(m => m.PraiseModule),
      },
      {
        path: 'kanban-board',
        data: { pageTitle: 'KanbanBoards' },
        loadChildren: () => import('./kanban-board/kanban-board.module').then(m => m.KanbanBoardModule),
      },
      {
        path: 'kanban-task',
        data: { pageTitle: 'KanbanTasks' },
        loadChildren: () => import('./kanban-task/kanban-task.module').then(m => m.KanbanTaskModule),
      },
      {
        path: 'kanban-task-comment',
        data: { pageTitle: 'KanbanTaskComments' },
        loadChildren: () => import('./kanban-task-comment/kanban-task-comment.module').then(m => m.KanbanTaskCommentModule),
      },
      {
        path: 'kanban-label',
        data: { pageTitle: 'KanbanLabels' },
        loadChildren: () => import('./kanban-label/kanban-label.module').then(m => m.KanbanLabelModule),
      },
      {
        path: 'milestone',
        data: { pageTitle: 'Milestones' },
        loadChildren: () => import('./milestone/milestone.module').then(m => m.MilestoneModule),
      },
      {
        path: 'reward',
        data: { pageTitle: 'Rewards' },
        loadChildren: () => import('./reward/reward.module').then(m => m.RewardModule),
      },
      {
        path: 'pomodoro-timer',
        data: { pageTitle: 'PomodoroTimers' },
        loadChildren: () => import('./pomodoro-timer/pomodoro-timer.module').then(m => m.PomodoroTimerModule),
      },
      {
        path: 'playlist',
        data: { pageTitle: 'Playlists' },
        loadChildren: () => import('./playlist/playlist.module').then(m => m.PlaylistModule),
      },
    ]),
  ],
})
export class EntityRoutingModule {}
