import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MessageFormService, MessageFormGroup } from './message-form.service';
import { IMessage } from '../message.model';
import { MessageService } from '../service/message.service';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { AttachmentService } from 'app/entities/attachment/service/attachment.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { ISession } from 'app/entities/session/session.model';
import { SessionService } from 'app/entities/session/service/session.service';
import { MessageStatus } from 'app/entities/enumerations/message-status.model';

@Component({
  selector: 'jhi-message-update',
  templateUrl: './message-update.component.html',
})
export class MessageUpdateComponent implements OnInit {
  isSaving = false;
  message: IMessage | null = null;
  messageStatusValues = Object.keys(MessageStatus);

  attachmentsSharedCollection: IAttachment[] = [];
  applicationUsersSharedCollection: IApplicationUser[] = [];
  sessionsSharedCollection: ISession[] = [];

  editForm: MessageFormGroup = this.messageFormService.createMessageFormGroup();

  constructor(
    protected messageService: MessageService,
    protected messageFormService: MessageFormService,
    protected attachmentService: AttachmentService,
    protected applicationUserService: ApplicationUserService,
    protected sessionService: SessionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAttachment = (o1: IAttachment | null, o2: IAttachment | null): boolean => this.attachmentService.compareAttachment(o1, o2);

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  compareSession = (o1: ISession | null, o2: ISession | null): boolean => this.sessionService.compareSession(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ message }) => {
      this.message = message;
      if (message) {
        this.updateForm(message);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const message = this.messageFormService.getMessage(this.editForm);
    if (message.id !== null) {
      this.subscribeToSaveResponse(this.messageService.update(message));
    } else {
      this.subscribeToSaveResponse(this.messageService.create(message));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMessage>>): void {
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

  protected updateForm(message: IMessage): void {
    this.message = message;
    this.messageFormService.resetForm(this.editForm, message);

    this.attachmentsSharedCollection = this.attachmentService.addAttachmentToCollectionIfMissing<IAttachment>(
      this.attachmentsSharedCollection,
      message.attachment
    );
    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      message.applicationUser
    );
    this.sessionsSharedCollection = this.sessionService.addSessionToCollectionIfMissing<ISession>(
      this.sessionsSharedCollection,
      message.session
    );
  }

  protected loadRelationshipsOptions(): void {
    this.attachmentService
      .query()
      .pipe(map((res: HttpResponse<IAttachment[]>) => res.body ?? []))
      .pipe(
        map((attachments: IAttachment[]) =>
          this.attachmentService.addAttachmentToCollectionIfMissing<IAttachment>(attachments, this.message?.attachment)
        )
      )
      .subscribe((attachments: IAttachment[]) => (this.attachmentsSharedCollection = attachments));

    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
            applicationUsers,
            this.message?.applicationUser
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.sessionService
      .query()
      .pipe(map((res: HttpResponse<ISession[]>) => res.body ?? []))
      .pipe(map((sessions: ISession[]) => this.sessionService.addSessionToCollectionIfMissing<ISession>(sessions, this.message?.session)))
      .subscribe((sessions: ISession[]) => (this.sessionsSharedCollection = sessions));
  }
}
