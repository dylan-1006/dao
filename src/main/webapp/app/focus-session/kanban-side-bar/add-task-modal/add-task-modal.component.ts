// add-task-modal.component.ts
import { Component, OnInit, Output, EventEmitter, ViewChild, Input, Inject } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { EditTaskModalComponent } from '../edit-task-modal/edit-task-modal.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddLabelModalComponent } from '../add-label-modal/add-label-modal.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IKanbanLabel } from '../../../entities/kanban-label/kanban-label.model';
import { IKanbanTask } from '../../../entities/kanban-task/kanban-task.model';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
})
export class AddTaskModalComponent implements OnInit {
  @ViewChild('selectLabel') selectLabel!: MatSelect;
  kanbanLabels: IKanbanLabel[] = [];
  taskName: string = '';
  taskStatus: string = '';
  taskLabels: number[] = [];
  newTask: any = '';
  constructor(public dialog: MatDialog, private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: { kanbanBoardId: number }) {}

  ngOnInit(): void {
    this.fetchKanbanLabelsInBoard();
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

  createTask(): void {
    console.log('Task Name:', this.taskName);
    console.log('Task Status:', this.taskStatus);
    console.log('Task Labels:', this.taskLabels);

    const headers = new HttpHeaders()
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI4MzgxNX0.m-98LCrPjzQeYn4JjntfaUYEoP5XsvgI5P0V6QAR0KwRqhCIN7dfi7EoRxAhQv4xho_v-fiGZ3v_tqIVmKvfQg'
      )
      .set('Content-Type', 'application/json');

    const newTask = {
      title: this.taskName.trim(),
      taskStatus: this.taskStatus,
      labels: this.taskLabels.map(labelId => ({ id: labelId })),
      kanbanBoard: { id: this.data.kanbanBoardId },
    };

    this.http.post<IKanbanTask>('api/kanban-tasks', newTask, { headers }).subscribe(
      response => {
        console.log('Message sent successfully:', response);
        this.newTask = '';
      },
      error => {
        console.error('Error adding label:', error);
      }
    );
  }
}
