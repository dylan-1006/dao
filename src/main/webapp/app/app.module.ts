import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/en';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgxWebstorageModule } from 'ngx-webstorage';
import dayjs from 'dayjs/esm';
import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';
import { SharedModule } from 'app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { FormsModule } from '@angular/forms';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';
import { PrivacyPolicyMainScreenComponent } from './privacy-policy/privacy-policy-main-screen/privacy-policy-main-screen.component';
import { KanbanSideBarComponent } from './focus-session/kanban-side-bar/kanban-side-bar.component';
import { ChatComponent } from './focus-session/chat/chat.component';
import { AddTaskModalComponent } from './focus-session/kanban-side-bar/add-task-modal/add-task-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteTaskModalComponent } from './focus-session/kanban-side-bar/delete-task-modal/delete-task-modal.component';
import { EditTaskModalComponent } from './focus-session/kanban-side-bar/edit-task-modal/edit-task-modal.component';
import { AddLabelModalComponent } from './focus-session/kanban-side-bar/add-label-modal/add-label-modal.component';
import { MAT_COLOR_FORMATS, NGX_MAT_COLOR_FORMATS, NgxMatColorPickerModule } from '@angular-material-components/color-picker';
import { CompleteTaskModalComponent } from './focus-session/kanban-side-bar/complete-task-modal/complete-task-modal.component';
import { ExpandedKanbanViewComponent } from './focus-session/kanban-side-bar/expanded-kanban-view/expanded-kanban-view.component';
import { WelcomeMessageComponent } from './home/welcome-message/welcome-message.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    HomeModule,
    MatDialogModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    AppRoutingModule,
    FormsModule,
    NgxMatColorPickerModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    httpInterceptorProviders,
  ],
  declarations: [MainComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [MainComponent],
})
export class AppModule {
  constructor(applicationConfigService: ApplicationConfigService, iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }
}
