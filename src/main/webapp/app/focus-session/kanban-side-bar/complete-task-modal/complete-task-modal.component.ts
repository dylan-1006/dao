import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'jhi-complete-task-modal',
  templateUrl: './complete-task-modal.component.html',
  styleUrls: ['./complete-task-modal.component.scss'],
})
export class CompleteTaskModalComponent implements OnInit {
  completeTaskClicked: boolean = false;

  constructor(private dialogRef: MatDialogRef<CompleteTaskModalComponent>) {}

  ngOnInit(): void {}

  onCompleteTaskClicked(): void {
    this.completeTaskClicked = true;
    this.dialogRef.close(this.completeTaskClicked);
    this.completeTaskClicked = false;
  }
}
