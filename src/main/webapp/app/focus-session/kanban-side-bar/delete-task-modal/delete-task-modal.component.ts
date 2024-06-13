import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'jhi-delete-task-modal',
  templateUrl: './delete-task-modal.component.html',
  styleUrls: ['./delete-task-modal.component.scss'],
})
export class DeleteTaskModalComponent implements OnInit {
  deleteTaskClicked: boolean = false;

  constructor(private dialogRef: MatDialogRef<DeleteTaskModalComponent>) {}

  ngOnInit(): void {}

  onDeleteTaskClicked(): void {
    this.deleteTaskClicked = true;
    this.dialogRef.close(this.deleteTaskClicked);
    this.deleteTaskClicked = false;
  }
}
