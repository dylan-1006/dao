import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISessionAnalytic } from '../session-analytic.model';

@Component({
  selector: 'jhi-session-analytic-detail',
  templateUrl: './session-analytic-detail.component.html',
})
export class SessionAnalyticDetailComponent implements OnInit {
  sessionAnalytic: ISessionAnalytic | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sessionAnalytic }) => {
      this.sessionAnalytic = sessionAnalytic;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
