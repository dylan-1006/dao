import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IKanbanTaskComment } from '../kanban-task-comment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../kanban-task-comment.test-samples';

import { KanbanTaskCommentService, RestKanbanTaskComment } from './kanban-task-comment.service';

const requireRestSample: RestKanbanTaskComment = {
  ...sampleWithRequiredData,
  timeStamp: sampleWithRequiredData.timeStamp?.toJSON(),
};

describe('KanbanTaskComment Service', () => {
  let service: KanbanTaskCommentService;
  let httpMock: HttpTestingController;
  let expectedResult: IKanbanTaskComment | IKanbanTaskComment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KanbanTaskCommentService);
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

    it('should create a KanbanTaskComment', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const kanbanTaskComment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(kanbanTaskComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a KanbanTaskComment', () => {
      const kanbanTaskComment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(kanbanTaskComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a KanbanTaskComment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of KanbanTaskComment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a KanbanTaskComment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addKanbanTaskCommentToCollectionIfMissing', () => {
      it('should add a KanbanTaskComment to an empty array', () => {
        const kanbanTaskComment: IKanbanTaskComment = sampleWithRequiredData;
        expectedResult = service.addKanbanTaskCommentToCollectionIfMissing([], kanbanTaskComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kanbanTaskComment);
      });

      it('should not add a KanbanTaskComment to an array that contains it', () => {
        const kanbanTaskComment: IKanbanTaskComment = sampleWithRequiredData;
        const kanbanTaskCommentCollection: IKanbanTaskComment[] = [
          {
            ...kanbanTaskComment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addKanbanTaskCommentToCollectionIfMissing(kanbanTaskCommentCollection, kanbanTaskComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a KanbanTaskComment to an array that doesn't contain it", () => {
        const kanbanTaskComment: IKanbanTaskComment = sampleWithRequiredData;
        const kanbanTaskCommentCollection: IKanbanTaskComment[] = [sampleWithPartialData];
        expectedResult = service.addKanbanTaskCommentToCollectionIfMissing(kanbanTaskCommentCollection, kanbanTaskComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kanbanTaskComment);
      });

      it('should add only unique KanbanTaskComment to an array', () => {
        const kanbanTaskCommentArray: IKanbanTaskComment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const kanbanTaskCommentCollection: IKanbanTaskComment[] = [sampleWithRequiredData];
        expectedResult = service.addKanbanTaskCommentToCollectionIfMissing(kanbanTaskCommentCollection, ...kanbanTaskCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const kanbanTaskComment: IKanbanTaskComment = sampleWithRequiredData;
        const kanbanTaskComment2: IKanbanTaskComment = sampleWithPartialData;
        expectedResult = service.addKanbanTaskCommentToCollectionIfMissing([], kanbanTaskComment, kanbanTaskComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kanbanTaskComment);
        expect(expectedResult).toContain(kanbanTaskComment2);
      });

      it('should accept null and undefined values', () => {
        const kanbanTaskComment: IKanbanTaskComment = sampleWithRequiredData;
        expectedResult = service.addKanbanTaskCommentToCollectionIfMissing([], null, kanbanTaskComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kanbanTaskComment);
      });

      it('should return initial array if no KanbanTaskComment is added', () => {
        const kanbanTaskCommentCollection: IKanbanTaskComment[] = [sampleWithRequiredData];
        expectedResult = service.addKanbanTaskCommentToCollectionIfMissing(kanbanTaskCommentCollection, undefined, null);
        expect(expectedResult).toEqual(kanbanTaskCommentCollection);
      });
    });

    describe('compareKanbanTaskComment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareKanbanTaskComment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareKanbanTaskComment(entity1, entity2);
        const compareResult2 = service.compareKanbanTaskComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareKanbanTaskComment(entity1, entity2);
        const compareResult2 = service.compareKanbanTaskComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareKanbanTaskComment(entity1, entity2);
        const compareResult2 = service.compareKanbanTaskComment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
