import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IKanbanTask } from '../kanban-task.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../kanban-task.test-samples';

import { KanbanTaskService, RestKanbanTask } from './kanban-task.service';

const requireRestSample: RestKanbanTask = {
  ...sampleWithRequiredData,
  dueDate: sampleWithRequiredData.dueDate?.toJSON(),
};

describe('KanbanTask Service', () => {
  let service: KanbanTaskService;
  let httpMock: HttpTestingController;
  let expectedResult: IKanbanTask | IKanbanTask[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KanbanTaskService);
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

    it('should create a KanbanTask', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const kanbanTask = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(kanbanTask).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a KanbanTask', () => {
      const kanbanTask = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(kanbanTask).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a KanbanTask', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of KanbanTask', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a KanbanTask', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addKanbanTaskToCollectionIfMissing', () => {
      it('should add a KanbanTask to an empty array', () => {
        const kanbanTask: IKanbanTask = sampleWithRequiredData;
        expectedResult = service.addKanbanTaskToCollectionIfMissing([], kanbanTask);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kanbanTask);
      });

      it('should not add a KanbanTask to an array that contains it', () => {
        const kanbanTask: IKanbanTask = sampleWithRequiredData;
        const kanbanTaskCollection: IKanbanTask[] = [
          {
            ...kanbanTask,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addKanbanTaskToCollectionIfMissing(kanbanTaskCollection, kanbanTask);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a KanbanTask to an array that doesn't contain it", () => {
        const kanbanTask: IKanbanTask = sampleWithRequiredData;
        const kanbanTaskCollection: IKanbanTask[] = [sampleWithPartialData];
        expectedResult = service.addKanbanTaskToCollectionIfMissing(kanbanTaskCollection, kanbanTask);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kanbanTask);
      });

      it('should add only unique KanbanTask to an array', () => {
        const kanbanTaskArray: IKanbanTask[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const kanbanTaskCollection: IKanbanTask[] = [sampleWithRequiredData];
        expectedResult = service.addKanbanTaskToCollectionIfMissing(kanbanTaskCollection, ...kanbanTaskArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const kanbanTask: IKanbanTask = sampleWithRequiredData;
        const kanbanTask2: IKanbanTask = sampleWithPartialData;
        expectedResult = service.addKanbanTaskToCollectionIfMissing([], kanbanTask, kanbanTask2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kanbanTask);
        expect(expectedResult).toContain(kanbanTask2);
      });

      it('should accept null and undefined values', () => {
        const kanbanTask: IKanbanTask = sampleWithRequiredData;
        expectedResult = service.addKanbanTaskToCollectionIfMissing([], null, kanbanTask, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kanbanTask);
      });

      it('should return initial array if no KanbanTask is added', () => {
        const kanbanTaskCollection: IKanbanTask[] = [sampleWithRequiredData];
        expectedResult = service.addKanbanTaskToCollectionIfMissing(kanbanTaskCollection, undefined, null);
        expect(expectedResult).toEqual(kanbanTaskCollection);
      });
    });

    describe('compareKanbanTask', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareKanbanTask(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareKanbanTask(entity1, entity2);
        const compareResult2 = service.compareKanbanTask(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareKanbanTask(entity1, entity2);
        const compareResult2 = service.compareKanbanTask(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareKanbanTask(entity1, entity2);
        const compareResult2 = service.compareKanbanTask(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
