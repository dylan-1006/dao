import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PraiseDetailComponent } from './praise-detail.component';

describe('Praise Management Detail Component', () => {
  let comp: PraiseDetailComponent;
  let fixture: ComponentFixture<PraiseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PraiseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ praise: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PraiseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PraiseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load praise on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.praise).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
