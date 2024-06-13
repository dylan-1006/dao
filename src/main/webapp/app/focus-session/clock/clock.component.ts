import { Component, OnInit } from '@angular/core';
import { FontSizeService } from '../../shared/font-size.service';

declare const time_is_widget: any;

@Component({
  selector: 'jhi-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements OnInit {
  currentTime: string = '';
  currentDate: string = '';
  fsValue = 'fs-1';

  constructor(private fontSizeService: FontSizeService) {
    this.fontSizeService.fsSubject.subscribe((fontSize: string) => {
      this.fsValue = fontSize; // Update the font size value
    });
  }

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    const now = new Date();

    const hours = this.padZero(now.getHours());
    const minutes = this.padZero(now.getMinutes());
    const seconds = this.padZero(now.getSeconds());

    this.currentTime = `${hours}:${minutes}:${seconds}`;

    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[now.getDay()];

    this.currentDate = `${dayOfWeek}, ${this.padZero(day)}/${this.padZero(month)}/${year}`;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }
}
