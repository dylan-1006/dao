import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedKanbanViewComponent } from './expanded-kanban-view.component';

describe('ExpandedKanbanViewComponent', () => {
  let component: ExpandedKanbanViewComponent;
  let fixture: ComponentFixture<ExpandedKanbanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpandedKanbanViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandedKanbanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
