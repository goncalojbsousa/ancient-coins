import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';

import { Coin } from '../../models/coin.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-market-detail-modal',
  templateUrl: './market-detail-modal.component.html',
  styleUrls: ['./market-detail-modal.component.scss'],
  standalone: false,
})
export class MarketDetailModalComponent {
  @Input() coin!: Coin;
  @Input() seller?: User;
  @Input() currentUserId: number | null = null;

  constructor(
    private authService: AuthService,
    private messagesService: MessagesService,
    private modalController: ModalController,
    private router: Router,
    private toastController: ToastController
  ) {}

  async dismiss(): Promise<void> {
    await this.modalController.dismiss();
  }

  async verPerfil(): Promise<void> {
    localStorage.setItem('selectedProfileUserId', String(this.coin.owner_id));
    await this.dismiss();
    await this.router.navigateByUrl('/tabs/tab5');
  }

  async iniciarNegociacao(): Promise<void> {
    await this.authService.init();

    const currentUser = await this.authService.getCurrentUser();

    if (!currentUser) {
      await this.showMessage('Inicie sessão para iniciar uma negociação.');
      await this.dismiss();
      await this.router.navigateByUrl('/login');
      return;
    }

    if (currentUser.id === this.coin.owner_id) {
      await this.showMessage('Não pode iniciar negociação com a sua própria moeda.');
      return;
    }

    try {
      const textoInicial = `Olá! Tenho interesse na moeda "${this.coin.name}". Ainda está disponível?`;

      const conversation = await this.messagesService.startNegotiation(
        this.coin.id,
        currentUser.id,
        this.coin.owner_id,
        textoInicial
      );

      await this.dismiss();
      await this.router.navigate(['/tabs/tab4'], {
        queryParams: { conversationId: conversation.id }
      });
    } catch {
      await this.showMessage('Não foi possível iniciar a negociação.');
    }
  }

  getFotoPrincipal(): string {
    return this.coin.photos?.length ? this.coin.photos[0] : '';
  }

  getPrecoFormatado(): string {
    if (this.coin.available_for_sale && this.coin.price !== null && this.coin.price !== undefined) {
      return `${this.coin.price} ${String.fromCharCode(8364)}`;
    }

    return 'Para Troca';
  }

  getInicialVendedor(): string {
    return this.getNomeVendedor().charAt(0).toUpperCase();
  }

  getNomeVendedor(): string {
    return this.seller?.name ?? 'Vendedor';
  }

  getRatingVendedor(): number {
    return this.seller?.rating ?? 0;
  }

  getTotalReviewsVendedor(): number {
    return this.seller?.total_reviews ?? 0;
  }

  isOwnCoin(): boolean {
    return this.currentUserId === this.coin.owner_id;
  }

  private async showMessage(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom',
      cssClass: 'error-toast',
    });

    await toast.present();
  }
}
