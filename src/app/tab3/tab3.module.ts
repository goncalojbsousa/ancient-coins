import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Tab3Page } from './tab3.page';
import { Tab3PageRoutingModule } from './tab3-routing.module';
import { MarketDetailModalComponent } from './market-detail-modal/market-detail-modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule
  ],
  declarations: [Tab3Page, MarketDetailModalComponent]
})
export class Tab3PageModule {}
