import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VERSION } from 'app/app.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { ApplicationUserManager } from '../../home/applicationUserManager';
import { Subject } from 'rxjs';
import { FontSizeService } from '../../shared/font-size.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  isDarkMode: boolean = true; // Initialize darkMode variable
  currentFontSize = 1;
  fsValue = 'fs-1';

  constructor(
    private loginService: LoginService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    private applicationUserManager: ApplicationUserManager,
    private fontSizeService: FontSizeService
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
      this.fontSizeService.fsSubject.subscribe((fontSize: string) => {
        this.fsValue = fontSize; // Update the font size value
      });
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.applicationUserManager.wipeApplicationUser();
    this.applicationUserManager.dealWithApplicationUser();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    console.log(this.isDarkMode);
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
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
