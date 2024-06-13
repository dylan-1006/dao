jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { KanbanBoardService } from '../service/kanban-board.service';

import { KanbanBoardDeleteDialogComponent } from './kanban-board-delete-dialog.component';

describe('KanbanBoard Management Delete Component', () => {
  let comp: KanbanBoardDeleteDialogComponent;
  let fixture: ComponentFixture<KanbanBoardDeleteDialogComponent>;
  let service: KanbanBoardService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [KanbanBoardDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(KanbanBoardDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KanbanBoardDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(KanbanBoardService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
