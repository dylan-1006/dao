import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMilestone } from '../milestone.model';

@Component({
  selector: 'jhi-milestone-detail',
  templateUrl: './milestone-detail.component.html',
})
export class MilestoneDetailComponent implements OnInit {
  milestone: IMilestone | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ milestone }) => {
      this.milestone = milestone;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
