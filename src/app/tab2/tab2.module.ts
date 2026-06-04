import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { CoinDetailModalComponent } from './coin-detail-modal/coin-detail-modal.component';
import { AddCoinModalComponent } from './add-coin-modal/add-coin-modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Tab2PageRoutingModule
  ],
  declarations: [Tab2Page, CoinDetailModalComponent, AddCoinModalComponent]
})
export class Tab2PageModule {}
