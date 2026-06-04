import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { CoinDetailModalComponent } from './coin-detail-modal/coin-detail-modal.component';
import { EditCoinModalComponent } from './edit-coin-modal/edit-coin-modal.component';
import { AddCoinModalModule } from './add-coin-modal/add-coin-modal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddCoinModalModule,
    Tab2PageRoutingModule
  ],
  declarations: [Tab2Page, CoinDetailModalComponent, EditCoinModalComponent]
})
export class Tab2PageModule {}
