import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAllTimeUserAnalytics } from '../all-time-user-analytics.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../all-time-user-analytics.test-samples';

import { AllTimeUserAnalyticsService, RestAllTimeUserAnalytics } from './all-time-user-analytics.service';

const requireRestSample: RestAllTimeUserAnalytics = {
  ...sampleWithRequiredData,
  mostFocusedPeriod: sampleWithRequiredData.mostFocusedPeriod?.toJSON(),
};

describe('AllTimeUserAnalytics Service', () => {
  let service: AllTimeUserAnalyticsService;
  let httpMock: HttpTestingController;
  let expectedResult: IAllTimeUserAnalytics | IAllTimeUserAnalytics[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AllTimeUserAnalyticsService);
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

    it('should create a AllTimeUserAnalytics', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const allTimeUserAnalytics = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(allTimeUserAnalytics).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AllTimeUserAnalytics', () => {
      const allTimeUserAnalytics = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(allTimeUserAnalytics).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AllTimeUserAnalytics', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AllTimeUserAnalytics', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AllTimeUserAnalytics', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAllTimeUserAnalyticsToCollectionIfMissing', () => {
      it('should add a AllTimeUserAnalytics to an empty array', () => {
        const allTimeUserAnalytics: IAllTimeUserAnalytics = sampleWithRequiredData;
        expectedResult = service.addAllTimeUserAnalyticsToCollectionIfMissing([], allTimeUserAnalytics);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(allTimeUserAnalytics);
      });

      it('should not add a AllTimeUserAnalytics to an array that contains it', () => {
        const allTimeUserAnalytics: IAllTimeUserAnalytics = sampleWithRequiredData;
        const allTimeUserAnalyticsCollection: IAllTimeUserAnalytics[] = [
          {
            ...allTimeUserAnalytics,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAllTimeUserAnalyticsToCollectionIfMissing(allTimeUserAnalyticsCollection, allTimeUserAnalytics);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AllTimeUserAnalytics to an array that doesn't contain it", () => {
        const allTimeUserAnalytics: IAllTimeUserAnalytics = sampleWithRequiredData;
        const allTimeUserAnalyticsCollection: IAllTimeUserAnalytics[] = [sampleWithPartialData];
        expectedResult = service.addAllTimeUserAnalyticsToCollectionIfMissing(allTimeUserAnalyticsCollection, allTimeUserAnalytics);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(allTimeUserAnalytics);
      });

      it('should add only unique AllTimeUserAnalytics to an array', () => {
        const allTimeUserAnalyticsArray: IAllTimeUserAnalytics[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const allTimeUserAnalyticsCollection: IAllTimeUserAnalytics[] = [sampleWithRequiredData];
        expectedResult = service.addAllTimeUserAnalyticsToCollectionIfMissing(allTimeUserAnalyticsCollection, ...allTimeUserAnalyticsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const allTimeUserAnalytics: IAllTimeUserAnalytics = sampleWithRequiredData;
        const allTimeUserAnalytics2: IAllTimeUserAnalytics = sampleWithPartialData;
        expectedResult = service.addAllTimeUserAnalyticsToCollectionIfMissing([], allTimeUserAnalytics, allTimeUserAnalytics2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(allTimeUserAnalytics);
        expect(expectedResult).toContain(allTimeUserAnalytics2);
      });

      it('should accept null and undefined values', () => {
        const allTimeUserAnalytics: IAllTimeUserAnalytics = sampleWithRequiredData;
        expectedResult = service.addAllTimeUserAnalyticsToCollectionIfMissing([], null, allTimeUserAnalytics, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(allTimeUserAnalytics);
      });

      it('should return initial array if no AllTimeUserAnalytics is added', () => {
        const allTimeUserAnalyticsCollection: IAllTimeUserAnalytics[] = [sampleWithRequiredData];
        expectedResult = service.addAllTimeUserAnalyticsToCollectionIfMissing(allTimeUserAnalyticsCollection, undefined, null);
        expect(expectedResult).toEqual(allTimeUserAnalyticsCollection);
      });
    });

    describe('compareAllTimeUserAnalytics', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAllTimeUserAnalytics(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAllTimeUserAnalytics(entity1, entity2);
        const compareResult2 = service.compareAllTimeUserAnalytics(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAllTimeUserAnalytics(entity1, entity2);
        const compareResult2 = service.compareAllTimeUserAnalytics(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAllTimeUserAnalytics(entity1, entity2);
        const compareResult2 = service.compareAllTimeUserAnalytics(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
