import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPomodoroTimer } from '../pomodoro-timer.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pomodoro-timer.test-samples';

import { PomodoroTimerService, RestPomodoroTimer } from './pomodoro-timer.service';

const requireRestSample: RestPomodoroTimer = {
  ...sampleWithRequiredData,
  startTime: sampleWithRequiredData.startTime?.toJSON(),
  endTime: sampleWithRequiredData.endTime?.toJSON(),
};

describe('PomodoroTimer Service', () => {
  let service: PomodoroTimerService;
  let httpMock: HttpTestingController;
  let expectedResult: IPomodoroTimer | IPomodoroTimer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PomodoroTimerService);
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

    it('should create a PomodoroTimer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const pomodoroTimer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pomodoroTimer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PomodoroTimer', () => {
      const pomodoroTimer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pomodoroTimer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PomodoroTimer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PomodoroTimer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PomodoroTimer', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPomodoroTimerToCollectionIfMissing', () => {
      it('should add a PomodoroTimer to an empty array', () => {
        const pomodoroTimer: IPomodoroTimer = sampleWithRequiredData;
        expectedResult = service.addPomodoroTimerToCollectionIfMissing([], pomodoroTimer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pomodoroTimer);
      });

      it('should not add a PomodoroTimer to an array that contains it', () => {
        const pomodoroTimer: IPomodoroTimer = sampleWithRequiredData;
        const pomodoroTimerCollection: IPomodoroTimer[] = [
          {
            ...pomodoroTimer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPomodoroTimerToCollectionIfMissing(pomodoroTimerCollection, pomodoroTimer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PomodoroTimer to an array that doesn't contain it", () => {
        const pomodoroTimer: IPomodoroTimer = sampleWithRequiredData;
        const pomodoroTimerCollection: IPomodoroTimer[] = [sampleWithPartialData];
        expectedResult = service.addPomodoroTimerToCollectionIfMissing(pomodoroTimerCollection, pomodoroTimer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pomodoroTimer);
      });

      it('should add only unique PomodoroTimer to an array', () => {
        const pomodoroTimerArray: IPomodoroTimer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pomodoroTimerCollection: IPomodoroTimer[] = [sampleWithRequiredData];
        expectedResult = service.addPomodoroTimerToCollectionIfMissing(pomodoroTimerCollection, ...pomodoroTimerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pomodoroTimer: IPomodoroTimer = sampleWithRequiredData;
        const pomodoroTimer2: IPomodoroTimer = sampleWithPartialData;
        expectedResult = service.addPomodoroTimerToCollectionIfMissing([], pomodoroTimer, pomodoroTimer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pomodoroTimer);
        expect(expectedResult).toContain(pomodoroTimer2);
      });

      it('should accept null and undefined values', () => {
        const pomodoroTimer: IPomodoroTimer = sampleWithRequiredData;
        expectedResult = service.addPomodoroTimerToCollectionIfMissing([], null, pomodoroTimer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pomodoroTimer);
      });

      it('should return initial array if no PomodoroTimer is added', () => {
        const pomodoroTimerCollection: IPomodoroTimer[] = [sampleWithRequiredData];
        expectedResult = service.addPomodoroTimerToCollectionIfMissing(pomodoroTimerCollection, undefined, null);
        expect(expectedResult).toEqual(pomodoroTimerCollection);
      });
    });

    describe('comparePomodoroTimer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePomodoroTimer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePomodoroTimer(entity1, entity2);
        const compareResult2 = service.comparePomodoroTimer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePomodoroTimer(entity1, entity2);
        const compareResult2 = service.comparePomodoroTimer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePomodoroTimer(entity1, entity2);
        const compareResult2 = service.comparePomodoroTimer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
