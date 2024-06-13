import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyMainScreenComponent } from './privacy-policy-main-screen.component';

describe('PrivacyPolicyMainScreenComponent', () => {
  let component: PrivacyPolicyMainScreenComponent;
  let fixture: ComponentFixture<PrivacyPolicyMainScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyPolicyMainScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyMainScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
