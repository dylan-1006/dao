import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPraise } from '../praise.model';

@Component({
  selector: 'jhi-praise-detail',
  templateUrl: './praise-detail.component.html',
})
export class PraiseDetailComponent implements OnInit {
  praise: IPraise | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ praise }) => {
      this.praise = praise;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
