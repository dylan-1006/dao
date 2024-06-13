import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { IKanbanLabel } from '../../../entities/kanban-label/kanban-label.model';
import { AddLabelModalComponent } from '../add-label-modal/add-label-modal.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IKanbanTask } from '../../../entities/kanban-task/kanban-task.model';
import { TaskStatus } from '../../../entities/enumerations/task-status.model';

@Component({
  selector: 'jhi-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss'],
})
export class EditTaskModalComponent implements OnInit {
  @ViewChild('selectLabel') selectLabel!: MatSelect;
  selectedKanbanTask!: IKanbanTask;
  kanbanLabels: IKanbanLabel[] = [];
  taskName: string = '';
  taskStatus!: TaskStatus;
  taskLabels: any = [];
  editedTask: any = '';

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { selectedKanbanTaskId: number; kanbanBoardId: number }
  ) {}

  ngOnInit(): void {
    this.fetchKanbanLabelsInBoard();
    this.fetchAndDisplaySelectedKanbanTaskById(this.data.selectedKanbanTaskId);
  }
  fetchKanbanLabelsInBoard() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI5NjA1OH0._I9LvG0nrRF0tU9xoahRgPwpa1UQJWFKKgeh3bD7qklwDAyA1UxE7vB_d8l6gzMSPzEU9TzzSIxp2Qau7e_q_w'
    );
    this.http.get<IKanbanLabel[]>(`api/in-kanban-board-kanban-labels/${this.data.kanbanBoardId}`, { headers }).subscribe(kanbanLabels => {
      this.kanbanLabels = kanbanLabels;
      console.log(this.kanbanLabels);
    });
  }

  fetchAndDisplaySelectedKanbanTaskById(kanbanTaskId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI5NjA1OH0._I9LvG0nrRF0tU9xoahRgPwpa1UQJWFKKgeh3bD7qklwDAyA1UxE7vB_d8l6gzMSPzEU9TzzSIxp2Qau7e_q_w'
    );
    this.http.get<IKanbanTask>(`api/kanban-tasks/${kanbanTaskId}`, { headers }).subscribe(kanbanTask => {
      this.selectedKanbanTask = kanbanTask;
      console.log(this.selectedKanbanTask);

      this.taskName = this.selectedKanbanTask.title ?? '';
      this.taskStatus = this.selectedKanbanTask.taskStatus ?? TaskStatus.UNDEFINED;
      // @ts-ignore
      this.taskLabels = this.selectedKanbanTask.labels.map(label => label.id);
    });
  }

  openNewLabelModal() {
    const dialogRef = this.dialog
      .open(AddLabelModalComponent, {
        height: '225px',
        width: '520px',
        disableClose: true,

        data: { kanbanBoardId: this.data.kanbanBoardId },
      })
      .afterClosed()
      .subscribe(result => {
        setTimeout(() => {
          this.fetchKanbanLabelsInBoard();
        }, 1000);
        this.selectLabel.close();
        this.selectLabel.open();
      });
    this.selectLabel.options.first.deselect();
  }

  editTask() {
    console.log('Task Name:', this.taskName);
    console.log('Task Status:', this.taskStatus);
    console.log('Task Labels:', this.taskLabels);
    console.log('Task id:', this.data.selectedKanbanTaskId);

    const headers = new HttpHeaders()
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI4MzgxNX0.m-98LCrPjzQeYn4JjntfaUYEoP5XsvgI5P0V6QAR0KwRqhCIN7dfi7EoRxAhQv4xho_v-fiGZ3v_tqIVmKvfQg'
      )
      .set('Content-Type', 'application/json');

    this.selectLabel.writeValue(this.taskLabels);
    const editedTask = {
      id: Number(this.data.selectedKanbanTaskId),
      title: this.taskName.trim(),
      taskStatus: this.taskStatus,
      labels: this.taskLabels.map((labelId: any) => ({ id: labelId })),
      kanbanBoard: { id: this.data.kanbanBoardId },
    };

    this.http.put<IKanbanTask>(`api/kanban-tasks/${this.data.selectedKanbanTaskId}`, editedTask, { headers }).subscribe(
      response => {
        console.log('Message sent successfully:', response);
        this.editedTask = '';
      },
      error => {
        console.error('Error editing label:', error);
      }
    );
  }
}
