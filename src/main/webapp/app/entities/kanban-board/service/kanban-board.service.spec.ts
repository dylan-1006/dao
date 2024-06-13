import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IKanbanBoard } from '../kanban-board.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../kanban-board.test-samples';

import { KanbanBoardService } from './kanban-board.service';

const requireRestSample: IKanbanBoard = {
  ...sampleWithRequiredData,
};

describe('KanbanBoard Service', () => {
  let service: KanbanBoardService;
  let httpMock: HttpTestingController;
  let expectedResult: IKanbanBoard | IKanbanBoard[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KanbanBoardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a KanbanBoard', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const kanbanBoard = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(kanbanBoard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a KanbanBoard', () => {
      const kanbanBoard = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(kanbanBoard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a KanbanBoard', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of KanbanBoard', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a KanbanBoard', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addKanbanBoardToCollectionIfMissing', () => {
      it('should add a KanbanBoard to an empty array', () => {
        const kanbanBoard: IKanbanBoard = sampleWithRequiredData;
        expectedResult = service.addKanbanBoardToCollectionIfMissing([], kanbanBoard);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kanbanBoard);
      });

      it('should not add a KanbanBoard to an array that contains it', () => {
        const kanbanBoard: IKanbanBoard = sampleWithRequiredData;
        const kanbanBoardCollection: IKanbanBoard[] = [
          {
            ...kanbanBoard,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addKanbanBoardToCollectionIfMissing(kanbanBoardCollection, kanbanBoard);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a KanbanBoard to an array that doesn't contain it", () => {
        const kanbanBoard: IKanbanBoard = sampleWithRequiredData;
        const kanbanBoardCollection: IKanbanBoard[] = [sampleWithPartialData];
        expectedResult = service.addKanbanBoardToCollectionIfMissing(kanbanBoardCollection, kanbanBoard);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kanbanBoard);
      });

      it('should add only unique KanbanBoard to an array', () => {
        const kanbanBoardArray: IKanbanBoard[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const kanbanBoardCollection: IKanbanBoard[] = [sampleWithRequiredData];
        expectedResult = service.addKanbanBoardToCollectionIfMissing(kanbanBoardCollection, ...kanbanBoardArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const kanbanBoard: IKanbanBoard = sampleWithRequiredData;
        const kanbanBoard2: IKanbanBoard = sampleWithPartialData;
        expectedResult = service.addKanbanBoardToCollectionIfMissing([], kanbanBoard, kanbanBoard2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kanbanBoard);
        expect(expectedResult).toContain(kanbanBoard2);
      });

      it('should accept null and undefined values', () => {
        const kanbanBoard: IKanbanBoard = sampleWithRequiredData;
        expectedResult = service.addKanbanBoardToCollectionIfMissing([], null, kanbanBoard, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kanbanBoard);
      });

      it('should return initial array if no KanbanBoard is added', () => {
        const kanbanBoardCollection: IKanbanBoard[] = [sampleWithRequiredData];
        expectedResult = service.addKanbanBoardToCollectionIfMissing(kanbanBoardCollection, undefined, null);
        expect(expectedResult).toEqual(kanbanBoardCollection);
      });
    });

    describe('compareKanbanBoard', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareKanbanBoard(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareKanbanBoard(entity1, entity2);
        const compareResult2 = service.compareKanbanBoard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareKanbanBoard(entity1, entity2);
        const compareResult2 = service.compareKanbanBoard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareKanbanBoard(entity1, entity2);
        const compareResult2 = service.compareKanbanBoard(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
