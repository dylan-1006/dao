import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root', // This ensures the service is provided at the root level
})
export class FontSizeService {
  fsSubject = new Subject<string>(); // Subject to emit font size changes
  fsValue = 'fs-1'; // Default font size

  constructor() {}

  changeFontSize(fontSize: string): void {
    this.fsValue = fontSize;
    this.fsSubject.next(fontSize);
  }
}
