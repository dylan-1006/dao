import { Component, OnInit } from '@angular/core';
import { FontSizeService } from '../../shared/font-size.service';

@Component({
  selector: 'jhi-privacy-policy-main-screen',
  templateUrl: './privacy-policy-main-screen.component.html',
  styleUrls: ['./privacy-policy-main-screen.component.scss'],
})
export class PrivacyPolicyMainScreenComponent implements OnInit {
  fsValue = 'fs-1';

  constructor(private fontSizeService: FontSizeService) {
    this.fontSizeService.fsSubject.subscribe((fontSize: string) => {
      this.fsValue = fontSize; // Update the font size value
    });
  }

  ngOnInit(): void {}

  onViewPdfButtonClick(): void {
    window.open('https://drive.google.com/file/d/1gRt-D3iOQpwzQ4t-Jv9Fchszt8QZzFFz/view?usp=sharing', '_blank');
  }
}
