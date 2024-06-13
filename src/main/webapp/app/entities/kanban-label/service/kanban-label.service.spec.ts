import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IKanbanLabel } from '../kanban-label.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../kanban-label.test-samples';

import { KanbanLabelService } from './kanban-label.service';

const requireRestSample: IKanbanLabel = {
  ...sampleWithRequiredData,
};

describe('KanbanLabel Service', () => {
  let service: KanbanLabelService;
  let httpMock: HttpTestingController;
  let expectedResult: IKanbanLabel | IKanbanLabel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KanbanLabelService);
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

    it('should create a KanbanLabel', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const kanbanLabel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(kanbanLabel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a KanbanLabel', () => {
      const kanbanLabel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(kanbanLabel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a KanbanLabel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of KanbanLabel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a KanbanLabel', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addKanbanLabelToCollectionIfMissing', () => {
      it('should add a KanbanLabel to an empty array', () => {
        const kanbanLabel: IKanbanLabel = sampleWithRequiredData;
        expectedResult = service.addKanbanLabelToCollectionIfMissing([], kanbanLabel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kanbanLabel);
      });

      it('should not add a KanbanLabel to an array that contains it', () => {
        const kanbanLabel: IKanbanLabel = sampleWithRequiredData;
        const kanbanLabelCollection: IKanbanLabel[] = [
          {
            ...kanbanLabel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addKanbanLabelToCollectionIfMissing(kanbanLabelCollection, kanbanLabel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a KanbanLabel to an array that doesn't contain it", () => {
        const kanbanLabel: IKanbanLabel = sampleWithRequiredData;
        const kanbanLabelCollection: IKanbanLabel[] = [sampleWithPartialData];
        expectedResult = service.addKanbanLabelToCollectionIfMissing(kanbanLabelCollection, kanbanLabel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kanbanLabel);
      });

      it('should add only unique KanbanLabel to an array', () => {
        const kanbanLabelArray: IKanbanLabel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const kanbanLabelCollection: IKanbanLabel[] = [sampleWithRequiredData];
        expectedResult = service.addKanbanLabelToCollectionIfMissing(kanbanLabelCollection, ...kanbanLabelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const kanbanLabel: IKanbanLabel = sampleWithRequiredData;
        const kanbanLabel2: IKanbanLabel = sampleWithPartialData;
        expectedResult = service.addKanbanLabelToCollectionIfMissing([], kanbanLabel, kanbanLabel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kanbanLabel);
        expect(expectedResult).toContain(kanbanLabel2);
      });

      it('should accept null and undefined values', () => {
        const kanbanLabel: IKanbanLabel = sampleWithRequiredData;
        expectedResult = service.addKanbanLabelToCollectionIfMissing([], null, kanbanLabel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kanbanLabel);
      });

      it('should return initial array if no KanbanLabel is added', () => {
        const kanbanLabelCollection: IKanbanLabel[] = [sampleWithRequiredData];
        expectedResult = service.addKanbanLabelToCollectionIfMissing(kanbanLabelCollection, undefined, null);
        expect(expectedResult).toEqual(kanbanLabelCollection);
      });
    });

    describe('compareKanbanLabel', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareKanbanLabel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareKanbanLabel(entity1, entity2);
        const compareResult2 = service.compareKanbanLabel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareKanbanLabel(entity1, entity2);
        const compareResult2 = service.compareKanbanLabel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareKanbanLabel(entity1, entity2);
        const compareResult2 = service.compareKanbanLabel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
