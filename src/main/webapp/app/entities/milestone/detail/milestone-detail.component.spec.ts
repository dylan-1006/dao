import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MilestoneDetailComponent } from './milestone-detail.component';

describe('Milestone Management Detail Component', () => {
  let comp: MilestoneDetailComponent;
  let fixture: ComponentFixture<MilestoneDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MilestoneDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ milestone: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MilestoneDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MilestoneDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load milestone on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.milestone).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
