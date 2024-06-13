import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMilestone, NewMilestone } from '../milestone.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMilestone for edit and NewMilestoneFormGroupInput for create.
 */
type MilestoneFormGroupInput = IMilestone | PartialWithRequiredKeyOf<NewMilestone>;

type MilestoneFormDefaults = Pick<NewMilestone, 'id'>;

type MilestoneFormGroupContent = {
  id: FormControl<IMilestone['id'] | NewMilestone['id']>;
  requiredHours: FormControl<IMilestone['requiredHours']>;
  achievements: FormControl<IMilestone['achievements']>;
};

export type MilestoneFormGroup = FormGroup<MilestoneFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MilestoneFormService {
  createMilestoneFormGroup(milestone: MilestoneFormGroupInput = { id: null }): MilestoneFormGroup {
    const milestoneRawValue = {
      ...this.getFormDefaults(),
      ...milestone,
    };
    return new FormGroup<MilestoneFormGroupContent>({
      id: new FormControl(
        { value: milestoneRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      requiredHours: new FormControl(milestoneRawValue.requiredHours),
      achievements: new FormControl(milestoneRawValue.achievements),
    });
  }

  getMilestone(form: MilestoneFormGroup): IMilestone | NewMilestone {
    return form.getRawValue() as IMilestone | NewMilestone;
  }

  resetForm(form: MilestoneFormGroup, milestone: MilestoneFormGroupInput): void {
    const milestoneRawValue = { ...this.getFormDefaults(), ...milestone };
    form.reset(
      {
        ...milestoneRawValue,
        id: { value: milestoneRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MilestoneFormDefaults {
    return {
      id: null,
    };
  }
}
