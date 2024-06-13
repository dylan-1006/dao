import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAllTimeUserAnalytics } from '../all-time-user-analytics.model';

@Component({
  selector: 'jhi-all-time-user-analytics-detail',
  templateUrl: './all-time-user-analytics-detail.component.html',
})
export class AllTimeUserAnalyticsDetailComponent implements OnInit {
  allTimeUserAnalytics: IAllTimeUserAnalytics | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ allTimeUserAnalytics }) => {
      this.allTimeUserAnalytics = allTimeUserAnalytics;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
