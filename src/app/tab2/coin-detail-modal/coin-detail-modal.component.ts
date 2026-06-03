import { Component, Input, inject } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

import { Coin } from '../../models/ancient-coins.models';
import { CoinsService } from '../../services/coins.service';

interface CoinDetailModalResult {
  wasDeleted: boolean;
}

@Component({
  selector: 'app-coin-detail-modal',
  templateUrl: './coin-detail-modal.component.html',
  styleUrls: ['./coin-detail-modal.component.scss'],
  standalone: false,
})
export class CoinDetailModalComponent {
  private alertController = inject(AlertController);
  private coinsService = inject(CoinsService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);

  @Input() coin!: Coin;

  async dismiss(result?: CoinDetailModalResult): Promise<void> {
    await this.modalController.dismiss(result);
  }

  async confirmDeleteCoin(): Promise<void> {
    const deleteConfirmationAlert = await this.alertController.create({
      cssClass: 'ancient-confirm-alert',
      header: 'Eliminar moeda',
      message: 'Esta moeda será removida da sua coleção. Pretende continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'confirm-cancel-button',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'confirm-delete-button',
          handler: async () => {
            await this.deleteCoin();
          },
        },
      ],
    });

    await deleteConfirmationAlert.present();
  }

  private async deleteCoin(): Promise<void> {
    try {
      await this.coinsService.deleteCoin(this.coin.id);
      await this.showOperationMessage('Moeda eliminada com sucesso.', 'success-toast');
      await this.dismiss({ wasDeleted: true });
    } catch {
      await this.showOperationMessage('Não foi possível eliminar a moeda. Tente novamente.', 'error-toast');
    }
  }

  private async showOperationMessage(message: string, cssClass: string): Promise<void> {
    const operationToast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom',
      cssClass,
    });

    await operationToast.present();
  }
}
