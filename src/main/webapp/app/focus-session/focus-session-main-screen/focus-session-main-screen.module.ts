import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { FOCUS_SESSION_MAIN_SCREEN_ROUTE } from './focus-session-main-screen.route';
import { FocusSessionMainScreenComponent } from './focus-session-main-screen.component';

import { ClockComponent } from '../clock/clock.component';
import { OnlineMemberAreaComponent } from '../online-member-area/online-member-area.component';
import { MainToolBarComponent } from '../main-tool-bar/main-tool-bar.component';
import { TopSessionDetailComponent } from '../top-session-detail/top-session-detail.component';
import { TimerComponent } from '../timer/timer.component';
import { KanbanSideBarComponent } from '../kanban-side-bar/kanban-side-bar.component';
import { ChatComponent } from '../chat/chat.component';
import { PlaylistComponent } from '../playlist/playlist.component';
import { AddTaskModalComponent } from '../kanban-side-bar/add-task-modal/add-task-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DeleteTaskModalComponent } from '../kanban-side-bar/delete-task-modal/delete-task-modal.component';
import { EditTaskModalComponent } from '../kanban-side-bar/edit-task-modal/edit-task-modal.component';
import { AddLabelModalComponent } from '../kanban-side-bar/add-label-modal/add-label-modal.component';
import { NgxMatColorPickerModule } from '@angular-material-components/color-picker';
import { CompleteTaskModalComponent } from '../kanban-side-bar/complete-task-modal/complete-task-modal.component';
import { ExpandedKanbanViewComponent } from '../kanban-side-bar/expanded-kanban-view/expanded-kanban-view.component';
import { SessionAnalyticsComponent } from '../session-analytics/session-analytics.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ApplicationUserManager } from '../../home/applicationUserManager';

@NgModule({
  imports: [
    SharedModule,
    DragDropModule,
    MatDialogModule,
    RouterModule.forChild([FOCUS_SESSION_MAIN_SCREEN_ROUTE]),
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    NgxMatColorPickerModule,
    MatTabsModule,
  ],
  declarations: [
    FocusSessionMainScreenComponent,
    ClockComponent,
    OnlineMemberAreaComponent,
    MainToolBarComponent,
    TopSessionDetailComponent,
    TimerComponent,
    KanbanSideBarComponent,
    ChatComponent,
    AddTaskModalComponent,
    PlaylistComponent,
    DeleteTaskModalComponent,
    EditTaskModalComponent,
    AddLabelModalComponent,
    CompleteTaskModalComponent,
    ExpandedKanbanViewComponent,
    SessionAnalyticsComponent,
  ],
})
export class FocusSessionMainScreenModule {}
