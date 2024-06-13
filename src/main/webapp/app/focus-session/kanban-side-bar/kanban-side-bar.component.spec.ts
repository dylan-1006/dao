import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanSideBarComponent } from './kanban-side-bar.component';

describe('KanbanSideBarComponent', () => {
  let component: KanbanSideBarComponent;
  let fixture: ComponentFixture<KanbanSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KanbanSideBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
