import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusSessionMainScreenComponent } from './focus-session-main-screen.component';

describe('FocusSessionMainScreenComponent', () => {
  let component: FocusSessionMainScreenComponent;
  let fixture: ComponentFixture<FocusSessionMainScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FocusSessionMainScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FocusSessionMainScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
