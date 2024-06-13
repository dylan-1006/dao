import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPraise, NewPraise } from '../praise.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPraise for edit and NewPraiseFormGroupInput for create.
 */
type PraiseFormGroupInput = IPraise | PartialWithRequiredKeyOf<NewPraise>;

type PraiseFormDefaults = Pick<NewPraise, 'id'>;

type PraiseFormGroupContent = {
  id: FormControl<IPraise['id'] | NewPraise['id']>;
  praiseMessage: FormControl<IPraise['praiseMessage']>;
  sender: FormControl<IPraise['sender']>;
  receiver: FormControl<IPraise['receiver']>;
};

export type PraiseFormGroup = FormGroup<PraiseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PraiseFormService {
  createPraiseFormGroup(praise: PraiseFormGroupInput = { id: null }): PraiseFormGroup {
    const praiseRawValue = {
      ...this.getFormDefaults(),
      ...praise,
    };
    return new FormGroup<PraiseFormGroupContent>({
      id: new FormControl(
        { value: praiseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      praiseMessage: new FormControl(praiseRawValue.praiseMessage),
      sender: new FormControl(praiseRawValue.sender),
      receiver: new FormControl(praiseRawValue.receiver),
    });
  }

  getPraise(form: PraiseFormGroup): IPraise | NewPraise {
    return form.getRawValue() as IPraise | NewPraise;
  }

  resetForm(form: PraiseFormGroup, praise: PraiseFormGroupInput): void {
    const praiseRawValue = { ...this.getFormDefaults(), ...praise };
    form.reset(
      {
        ...praiseRawValue,
        id: { value: praiseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PraiseFormDefaults {
    return {
      id: null,
    };
  }
}
