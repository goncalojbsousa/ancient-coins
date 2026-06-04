import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddCoinModalComponent } from './add-coin-modal.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [AddCoinModalComponent],
  exports: [AddCoinModalComponent]
})
export class AddCoinModalModule {}
