import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISessionAnalytic } from '../session-analytic.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../session-analytic.test-samples';

import { SessionAnalyticService } from './session-analytic.service';

const requireRestSample: ISessionAnalytic = {
  ...sampleWithRequiredData,
};

describe('SessionAnalytic Service', () => {
  let service: SessionAnalyticService;
  let httpMock: HttpTestingController;
  let expectedResult: ISessionAnalytic | ISessionAnalytic[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SessionAnalyticService);
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

    it('should create a SessionAnalytic', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sessionAnalytic = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sessionAnalytic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SessionAnalytic', () => {
      const sessionAnalytic = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sessionAnalytic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SessionAnalytic', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SessionAnalytic', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SessionAnalytic', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSessionAnalyticToCollectionIfMissing', () => {
      it('should add a SessionAnalytic to an empty array', () => {
        const sessionAnalytic: ISessionAnalytic = sampleWithRequiredData;
        expectedResult = service.addSessionAnalyticToCollectionIfMissing([], sessionAnalytic);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sessionAnalytic);
      });

      it('should not add a SessionAnalytic to an array that contains it', () => {
        const sessionAnalytic: ISessionAnalytic = sampleWithRequiredData;
        const sessionAnalyticCollection: ISessionAnalytic[] = [
          {
            ...sessionAnalytic,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSessionAnalyticToCollectionIfMissing(sessionAnalyticCollection, sessionAnalytic);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SessionAnalytic to an array that doesn't contain it", () => {
        const sessionAnalytic: ISessionAnalytic = sampleWithRequiredData;
        const sessionAnalyticCollection: ISessionAnalytic[] = [sampleWithPartialData];
        expectedResult = service.addSessionAnalyticToCollectionIfMissing(sessionAnalyticCollection, sessionAnalytic);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sessionAnalytic);
      });

      it('should add only unique SessionAnalytic to an array', () => {
        const sessionAnalyticArray: ISessionAnalytic[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sessionAnalyticCollection: ISessionAnalytic[] = [sampleWithRequiredData];
        expectedResult = service.addSessionAnalyticToCollectionIfMissing(sessionAnalyticCollection, ...sessionAnalyticArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sessionAnalytic: ISessionAnalytic = sampleWithRequiredData;
        const sessionAnalytic2: ISessionAnalytic = sampleWithPartialData;
        expectedResult = service.addSessionAnalyticToCollectionIfMissing([], sessionAnalytic, sessionAnalytic2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sessionAnalytic);
        expect(expectedResult).toContain(sessionAnalytic2);
      });

      it('should accept null and undefined values', () => {
        const sessionAnalytic: ISessionAnalytic = sampleWithRequiredData;
        expectedResult = service.addSessionAnalyticToCollectionIfMissing([], null, sessionAnalytic, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sessionAnalytic);
      });

      it('should return initial array if no SessionAnalytic is added', () => {
        const sessionAnalyticCollection: ISessionAnalytic[] = [sampleWithRequiredData];
        expectedResult = service.addSessionAnalyticToCollectionIfMissing(sessionAnalyticCollection, undefined, null);
        expect(expectedResult).toEqual(sessionAnalyticCollection);
      });
    });

    describe('compareSessionAnalytic', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSessionAnalytic(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSessionAnalytic(entity1, entity2);
        const compareResult2 = service.compareSessionAnalytic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSessionAnalytic(entity1, entity2);
        const compareResult2 = service.compareSessionAnalytic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSessionAnalytic(entity1, entity2);
        const compareResult2 = service.compareSessionAnalytic(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
