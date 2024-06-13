import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteTaskModalComponent } from './complete-task-modal.component';

describe('CompleteTaskModalComponent', () => {
  let component: CompleteTaskModalComponent;
  let fixture: ComponentFixture<CompleteTaskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteTaskModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
