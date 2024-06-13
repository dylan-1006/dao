import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PraiseFormService, PraiseFormGroup } from './praise-form.service';
import { IPraise } from '../praise.model';
import { PraiseService } from '../service/praise.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';

@Component({
  selector: 'jhi-praise-update',
  templateUrl: './praise-update.component.html',
})
export class PraiseUpdateComponent implements OnInit {
  isSaving = false;
  praise: IPraise | null = null;

  applicationUsersSharedCollection: IApplicationUser[] = [];

  editForm: PraiseFormGroup = this.praiseFormService.createPraiseFormGroup();

  constructor(
    protected praiseService: PraiseService,
    protected praiseFormService: PraiseFormService,
    protected applicationUserService: ApplicationUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ praise }) => {
      this.praise = praise;
      if (praise) {
        this.updateForm(praise);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const praise = this.praiseFormService.getPraise(this.editForm);
    if (praise.id !== null) {
      this.subscribeToSaveResponse(this.praiseService.update(praise));
    } else {
      this.subscribeToSaveResponse(this.praiseService.create(praise));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPraise>>): void {
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

  protected updateForm(praise: IPraise): void {
    this.praise = praise;
    this.praiseFormService.resetForm(this.editForm, praise);

    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      praise.sender,
      praise.receiver
    );
  }

  protected loadRelationshipsOptions(): void {
    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
            applicationUsers,
            this.praise?.sender,
            this.praise?.receiver
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));
  }
}
