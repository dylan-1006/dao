import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineMemberAreaComponent } from './online-member-area.component';

describe('OnlineMemberAreaComponent', () => {
  let component: OnlineMemberAreaComponent;
  let fixture: ComponentFixture<OnlineMemberAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlineMemberAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OnlineMemberAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
