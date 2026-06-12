import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false,
})
export class SplashPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.init();
    await this.waitSplashTime();

    if (this.authService.isAuthenticated()) {
      await this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    } else {
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  private waitSplashTime(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  }
}
