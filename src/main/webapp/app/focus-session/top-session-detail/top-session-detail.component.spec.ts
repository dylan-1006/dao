import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSessionDetailComponent } from './top-session-detail.component';

describe('TopSessionDetailComponent', () => {
  let component: TopSessionDetailComponent;
  let fixture: ComponentFixture<TopSessionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopSessionDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopSessionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
