import { Component, Input, OnInit } from '@angular/core';
import { ISession } from '../../entities/session/session.model';
import { FontSizeService } from '../../shared/font-size.service';

@Component({
  selector: 'jhi-top-session-detail',
  templateUrl: './top-session-detail.component.html',
  styleUrls: ['./top-session-detail.component.scss'],
})
export class TopSessionDetailComponent implements OnInit {
  @Input() currentSession: ISession | null = null;
  title: string | null | undefined;
  sessionDuration: string = '0:00:00 elapsed';
  startTime: Date | null = null;
  intervalId: any;
  fsValue = 'fs-1';

  constructor(private fontSizeService: FontSizeService) {
    this.fontSizeService.fsSubject.subscribe((fontSize: string) => {
      this.fsValue = fontSize; // Update the font size value
    });
  }

  ngOnInit(): void {
    this.startTime = new Date();
    this.startTimer();
    this.title = this.currentSession?.title;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      if (this.startTime) {
        const currentTime = new Date();
        const elapsedTime = currentTime.getTime() - this.startTime.getTime();
        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        this.sessionDuration = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} elapsed`;
      }
    }, 1000); // Update every second
  }

  stopTimer(): void {
    clearInterval(this.intervalId); // Clear the interval
  }
}
