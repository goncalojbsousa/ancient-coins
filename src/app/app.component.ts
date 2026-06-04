import { Component, OnInit } from '@angular/core';
import {
  OrientationLockOptions,
  OrientationLockType,
  ScreenOrientation,
} from '@capacitor/screen-orientation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    await this.lockPortraitOrientation();
  }

  private async lockPortraitOrientation(): Promise<void> {
    try {
      const orientation: OrientationLockType = 'portrait';
      const options: OrientationLockOptions = { orientation };

      await ScreenOrientation.lock(options);
    } catch { }
  }
}
