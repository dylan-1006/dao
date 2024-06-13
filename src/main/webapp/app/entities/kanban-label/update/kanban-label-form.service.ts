import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IKanbanLabel, NewKanbanLabel } from '../kanban-label.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IKanbanLabel for edit and NewKanbanLabelFormGroupInput for create.
 */
type KanbanLabelFormGroupInput = IKanbanLabel | PartialWithRequiredKeyOf<NewKanbanLabel>;

type KanbanLabelFormDefaults = Pick<NewKanbanLabel, 'id' | 'boards' | 'tasks'>;

type KanbanLabelFormGroupContent = {
  id: FormControl<IKanbanLabel['id'] | NewKanbanLabel['id']>;
  name: FormControl<IKanbanLabel['name']>;
  colour: FormControl<IKanbanLabel['colour']>;
  boards: FormControl<IKanbanLabel['boards']>;
  tasks: FormControl<IKanbanLabel['tasks']>;
};

export type KanbanLabelFormGroup = FormGroup<KanbanLabelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class KanbanLabelFormService {
  createKanbanLabelFormGroup(kanbanLabel: KanbanLabelFormGroupInput = { id: null }): KanbanLabelFormGroup {
    const kanbanLabelRawValue = {
      ...this.getFormDefaults(),
      ...kanbanLabel,
    };
    return new FormGroup<KanbanLabelFormGroupContent>({
      id: new FormControl(
        { value: kanbanLabelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(kanbanLabelRawValue.name),
      colour: new FormControl(kanbanLabelRawValue.colour, {
        validators: [Validators.pattern('#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})')],
      }),
      boards: new FormControl(kanbanLabelRawValue.boards ?? []),
      tasks: new FormControl(kanbanLabelRawValue.tasks ?? []),
    });
  }

  getKanbanLabel(form: KanbanLabelFormGroup): IKanbanLabel | NewKanbanLabel {
    return form.getRawValue() as IKanbanLabel | NewKanbanLabel;
  }

  resetForm(form: KanbanLabelFormGroup, kanbanLabel: KanbanLabelFormGroupInput): void {
    const kanbanLabelRawValue = { ...this.getFormDefaults(), ...kanbanLabel };
    form.reset(
      {
        ...kanbanLabelRawValue,
        id: { value: kanbanLabelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): KanbanLabelFormDefaults {
    return {
      id: null,
      boards: [],
      tasks: [],
    };
  }
}
