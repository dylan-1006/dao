import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IKanbanTask } from '../../../entities/kanban-task/kanban-task.model';
import { TaskStatus } from '../../../entities/enumerations/task-status.model';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal.component';
import { EditTaskModalComponent } from '../edit-task-modal/edit-task-modal.component';
import { DeleteTaskModalComponent } from '../delete-task-modal/delete-task-modal.component';
import { CompleteTaskModalComponent } from '../complete-task-modal/complete-task-modal.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IKanbanBoard } from '../../../entities/kanban-board/kanban-board.model';

@Component({
  selector: 'jhi-expanded-kanban-view',
  templateUrl: './expanded-kanban-view.component.html',
  styleUrls: ['./expanded-kanban-view.component.scss'],
})
export class ExpandedKanbanViewComponent implements OnInit {
  kanbanTask: IKanbanTask[] = [];
  inProgressTasks: IKanbanTask[] = [];
  toDoTasks: IKanbanTask[] = [];
  completedTasks: IKanbanTask[] = [];
  undefinedTasks: IKanbanTask[] = [];
  isEditing = false;
  editedTitle: string | undefined | null = '';
  kanbanBoard!: IKanbanBoard;

  constructor(private http: HttpClient, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: { kanbanBoardId: number }) {}

  ngOnInit(): void {
    console.log('this is the kanbanBoardID in expanded view' + this.data.kanbanBoardId);
    this.fetchKanbanTasks();
    this.fetchKanbanBoard();
  }

  enterEditMode() {
    this.editedTitle = this.kanbanBoard.title;
    console.log('this the kanban title ' + this.kanbanBoard.title);
    console.log('this the fresh title' + this.editedTitle);
    this.isEditing = true;
  }

  exitEditMode() {
    this.kanbanBoard.title != this.editedTitle;
    this.isEditing = false;

    const headers = new HttpHeaders()
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI4MzgxNX0.m-98LCrPjzQeYn4JjntfaUYEoP5XsvgI5P0V6QAR0KwRqhCIN7dfi7EoRxAhQv4xho_v-fiGZ3v_tqIVmKvfQg'
      )
      .set('Content-Type', 'application/json');

    const editedKanbanBoard = {
      id: Number(this.data.kanbanBoardId),
      title: this.editedTitle,
    };

    this.http.put<IKanbanBoard>(`api/kanban-boards/${this.data.kanbanBoardId}`, editedKanbanBoard, { headers }).subscribe(
      response => {
        console.log('Message sent successfully:', response);
        this.fetchKanbanBoard();
      },
      error => {
        console.error('Error editing label:', error);
      }
    );
  }
  fetchKanbanTasks() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI5NjA1OH0._I9LvG0nrRF0tU9xoahRgPwpa1UQJWFKKgeh3bD7qklwDAyA1UxE7vB_d8l6gzMSPzEU9TzzSIxp2Qau7e_q_w'
    );

    this.http.get<IKanbanTask[]>(`api/in-kanban-board-kanban-tasks/${this.data.kanbanBoardId}`, { headers }).subscribe(kanbanTask => {
      this.kanbanTask = kanbanTask;
      console.log(this.kanbanTask);
      this.kanbanTask = kanbanTask.slice();
      this.inProgressTasks = kanbanTask.filter(task => task.taskStatus === TaskStatus.IN_PROGRESS);
      this.toDoTasks = kanbanTask.filter(task => task.taskStatus === TaskStatus.TODO);
      this.completedTasks = kanbanTask.filter(task => task.taskStatus === TaskStatus.DONE);
      this.undefinedTasks = kanbanTask.filter(task => task.taskStatus === TaskStatus.UNDEFINED);
    });
  }

  onTaskDropped(event: CdkDragDrop<IKanbanTask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const draggedTaskId = event.item.data;
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      const headers = new HttpHeaders().set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxNDAxNjUzNX0.-QCGXmxZRmNHpWeDIYgig59Tl6AMDRsSUXGxLg03VWnUH-vVEfsxjo_ow6NUlFqYiPfVuuJ8dIzaCmNCwRV_wg'
      );

      if (event.container.id === 'toDoTaskList') {
        const completedTask = {
          id: draggedTaskId,
          taskStatus: TaskStatus.TODO,
          kanbanBoard: { id: this.data.kanbanBoardId },
        };

        this.http.patch<IKanbanTask>(`api/kanban-tasks/${draggedTaskId}`, completedTask, { headers }).subscribe(
          response => {
            console.log('Message sent successfully:', response);
          },
          error => {
            console.error('Error editing label:', error);
          }
        );
      } else if (event.container.id === 'inProgressTaskList') {
        const completedTask = {
          id: draggedTaskId,
          taskStatus: TaskStatus.IN_PROGRESS,
          kanbanBoard: { id: this.data.kanbanBoardId },
        };

        this.http.patch<IKanbanTask>(`api/kanban-tasks/${draggedTaskId}`, completedTask, { headers }).subscribe(
          response => {
            console.log('Message sent successfully:', response);
          },
          error => {
            console.error('Error editing label:', error);
          }
        );
      } else if (event.container.id === 'completedTaskList') {
        const completedTask = {
          id: draggedTaskId,
          taskStatus: TaskStatus.DONE,
          kanbanBoard: { id: this.data.kanbanBoardId },
        };

        this.http.patch<IKanbanTask>(`api/kanban-tasks/${draggedTaskId}`, completedTask, { headers }).subscribe(
          response => {
            console.log('Message sent successfully:', response);
          },
          error => {
            console.error('Error editing label:', error);
          }
        );
      } else if (event.container.id === 'undefinedTaskList') {
        const completedTask = {
          id: draggedTaskId,
          taskStatus: TaskStatus.UNDEFINED,
          kanbanBoard: { id: this.data.kanbanBoardId },
        };

        this.http.patch<IKanbanTask>(`api/kanban-tasks/${draggedTaskId}`, completedTask, { headers }).subscribe(
          response => {
            console.log('Message sent successfully:', response);
          },
          error => {
            console.error('Error editing label:', error);
          }
        );
      }
    }
  }

  fetchKanbanBoard() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI5NjA1OH0._I9LvG0nrRF0tU9xoahRgPwpa1UQJWFKKgeh3bD7qklwDAyA1UxE7vB_d8l6gzMSPzEU9TzzSIxp2Qau7e_q_w'
    );

    this.http.get<IKanbanBoard>(`api/kanban-boards/${this.data.kanbanBoardId}`, { headers }).subscribe(kanbanBoard => {
      this.kanbanBoard = kanbanBoard;
    });
  }

  openAddTaskModal(): void {
    console.log('add task button pressed');
    //  this.showAddTaskModal = true;
    const dialogRef = this.dialog.open(AddTaskModalComponent, {
      height: '315px',
      width: '480px',
      disableClose: true,

      data: { kanbanBoardId: this.data.kanbanBoardId },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.fetchKanbanTasks();
    });
  }

  openEditTaskModal(taskId: number) {
    const dialogRef = this.dialog.open(EditTaskModalComponent, {
      height: '315px',
      width: '480px',
      disableClose: true,

      data: { selectedKanbanTaskId: taskId, kanbanBoardId: this.data.kanbanBoardId },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.fetchKanbanTasks();
    });
  }

  openDeleteTaskModal(taskId: number) {
    const dialogRef = this.dialog.open(DeleteTaskModalComponent, {
      height: '200px',
      width: '480px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        const headers = new HttpHeaders().set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxNDAxNjUzNX0.-QCGXmxZRmNHpWeDIYgig59Tl6AMDRsSUXGxLg03VWnUH-vVEfsxjo_ow6NUlFqYiPfVuuJ8dIzaCmNCwRV_wg'
        );

        this.http.delete(`api/kanban-tasks/${taskId}`, { headers }).subscribe(
          () => {
            console.log(`Kanban task with ID ${taskId} deleted successfully.`);
            this.fetchKanbanTasks();
          },
          error => {
            console.error('Error deleting Kanban task:', error);
          }
        );
      }
    });
  }

  openCompleteTaskModal(taskId: number) {
    const dialogRef = this.dialog.open(CompleteTaskModalComponent, {
      height: '200px',
      width: '480px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        const headers = new HttpHeaders().set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxNDAxNjUzNX0.-QCGXmxZRmNHpWeDIYgig59Tl6AMDRsSUXGxLg03VWnUH-vVEfsxjo_ow6NUlFqYiPfVuuJ8dIzaCmNCwRV_wg'
        );

        const completedTask = {
          id: Number(taskId),
          taskStatus: TaskStatus.DONE,
          kanbanBoard: { id: this.data.kanbanBoardId },
        };

        this.http.patch<IKanbanTask>(`api/kanban-tasks/${taskId}`, completedTask, { headers }).subscribe(
          response => {
            console.log('Message sent successfully:', response);
            this.fetchKanbanTasks();
          },
          error => {
            console.error('Error editing label:', error);
          }
        );
      }
    });
  }
}
