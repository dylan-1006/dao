import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FontSizeService } from '../../shared/font-size.service';

@Component({
  selector: 'jhi-main-tool-bar',
  templateUrl: './main-tool-bar.component.html',
  styleUrls: ['./main-tool-bar.component.scss'],
})
export class MainToolBarComponent implements OnInit {
  @Output() onTasksButtonClicked = new EventEmitter<any>();
  isKanBanSideBarVisible: boolean = false;

  @Output() onChatButtonClicked = new EventEmitter<any>();
  isChatSideBarVisible: boolean = false;

  @Output() onPlaylistButtonClicked = new EventEmitter<any>();
  isPlaylistVisible: boolean = false;

  @Output() onTimerButtonClicked = new EventEmitter<any>();
  isTimerVisible: boolean = false;

  @Output() onAnalyticsButtonClicked = new EventEmitter<any>();
  isAnalyticsVisible: boolean = false;

  isDarkMode: boolean = true;
  currentFontSize = 1;
  fsValue = 'fs-1';

  constructor(private fontSizeService: FontSizeService) {
    this.fontSizeService.fsSubject.subscribe((fontSize: string) => {
      this.fsValue = fontSize; // Update the font size value
    });
  }

  ngOnInit(): void {}

  toggleKanbanSidebar(): void {
    console.log('task button clicked');
    this.isKanBanSideBarVisible = !this.isKanBanSideBarVisible;
    this.isAnalyticsVisible = false;
    this.isChatSideBarVisible = false;
    this.isPlaylistVisible = false;
    console.log(this.isKanBanSideBarVisible);
    this.onTasksButtonClicked.emit(this.isKanBanSideBarVisible);
  }

  toggleChatSidebar(): void {
    console.log('chat button clicked');
    this.isKanBanSideBarVisible = false;
    this.isAnalyticsVisible = false;
    this.isPlaylistVisible = false;
    this.isChatSideBarVisible = !this.isChatSideBarVisible;
    console.log(this.isChatSideBarVisible);
    this.onChatButtonClicked.emit(this.isChatSideBarVisible);
  }

  togglePlaylist(): void {
    console.log('play button clicked');
    this.isChatSideBarVisible = false;
    this.isAnalyticsVisible = false;
    this.isKanBanSideBarVisible = false;
    this.isPlaylistVisible = !this.isPlaylistVisible;
    console.log(this.isPlaylistVisible);
    this.onPlaylistButtonClicked.emit(this.isPlaylistVisible);
  }
  toggleTimer(): void {
    console.log('timer button clicked');
    this.isTimerVisible = !this.isTimerVisible;
    console.log(this.isTimerVisible);
    this.onTimerButtonClicked.emit(this.isTimerVisible);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    console.log(this.isDarkMode);
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleAnalytics(): void {
    console.log('analytics button clicked');
    this.isAnalyticsVisible = !this.isAnalyticsVisible;
    this.isChatSideBarVisible = false;
    this.isPlaylistVisible = false;
    this.isKanBanSideBarVisible = false;
    this.isTimerVisible = false;
    console.log(this.isAnalyticsVisible);
    this.onAnalyticsButtonClicked.emit(this.isAnalyticsVisible);
  }

  changeFontSize() {
    this.currentFontSize++;
    if (this.currentFontSize === 4) {
      this.currentFontSize = 1;
    }

    console.log(this.currentFontSize);
    this.fontSizeService.changeFontSize(`fs-${this.currentFontSize.toString()}`);
  }
}
