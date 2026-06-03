import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Coin } from '../../models/ancient-coins.models';

@Component({
  selector: 'app-coin-detail-modal',
  templateUrl: './coin-detail-modal.component.html',
  styleUrls: ['./coin-detail-modal.component.scss'],
  standalone: false,
})
export class CoinDetailModalComponent {

  @Input() coin!: Coin;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
