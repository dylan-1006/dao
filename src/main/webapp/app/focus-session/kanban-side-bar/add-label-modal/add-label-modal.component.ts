import { Color } from '@angular-material-components/color-picker';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { IKanbanLabel } from '../../../entities/kanban-label/kanban-label.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-add-label-modal',
  templateUrl: './add-label-modal.component.html',
  styleUrls: ['./add-label-modal.component.scss'],
})
export class AddLabelModalComponent implements OnInit {
  labelName: string = '';
  labelColour!: Color;
  newLabel: any = '';
  labelCreated: boolean = false;

  constructor(private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: { kanbanBoardId: number }) {}

  ngOnInit(): void {}

  createNewLabel() {
    const headers = new HttpHeaders()
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI4MzgxNX0.m-98LCrPjzQeYn4JjntfaUYEoP5XsvgI5P0V6QAR0KwRqhCIN7dfi7EoRxAhQv4xho_v-fiGZ3v_tqIVmKvfQg'
      )
      .set('Content-Type', 'application/json');

    const newLabel = {
      name: this.labelName.trim(),
      colour: '#' + this.labelColour.hex,
      boards: [{ id: this.data.kanbanBoardId }],
    };

    this.http.post<IKanbanLabel>('/api/kanban-labels', newLabel, { headers }).subscribe(
      response => {
        console.log('Message sent successfully:', response);
        this.newLabel = '';
      },
      error => {
        console.error('Error adding label:', error);
      }
    );
  }
}
