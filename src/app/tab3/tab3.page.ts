import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Coin } from '../models/coin.model';
import { User } from '../models/user.model';
import { MarketService } from '../services/market.service';
import { UsersService } from '../services/users.service';
import { MarketDetailModalComponent } from './market-detail-modal/market-detail-modal.component';

@Component({
  selector: 'app-tab3',
  standalone: false,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  filtroAtual = 'Todas';
  pesquisa = '';
  ordenacao = 'recentes';

  loading = true;
  erro = '';

  moedas: Coin[] = [];
  vendedores = new Map<number, User>();

  constructor(
    private marketService: MarketService,
    private modalController: ModalController,
    private usersService: UsersService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarMercado();
    await this.abrirMoedaDaPaginaInicial();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.carregarMercado();
    await this.abrirMoedaDaPaginaInicial();
  }

  async carregarMercado(): Promise<void> {
    try {
      this.loading = true;
      this.erro = '';

      const [moedas, utilizadores] = await Promise.all([
        this.marketService.getMarketCoins(),
        this.usersService.getUsers(),
      ]);

      this.moedas = this.marketService.sortByNewest(moedas);

      this.vendedores.clear();
      utilizadores.forEach(user => {
        this.vendedores.set(user.id, user);
      });
    } catch {
      this.erro = 'Nao foi possivel carregar as moedas do mercado.';
    } finally {
      this.loading = false;
    }
  }

  get moedasFiltradas(): Coin[] {
    const pesquisaNormalizada = this.pesquisa.trim().toLowerCase();

    let resultado = this.moedas.filter(moeda => {
      const vendedor = this.getVendedor(moeda.owner_id);

      const correspondePesquisa =
        moeda.name.toLowerCase().includes(pesquisaNormalizada) ||
        moeda.origin.toLowerCase().includes(pesquisaNormalizada) ||
        moeda.material.toLowerCase().includes(pesquisaNormalizada) ||
        moeda.description.toLowerCase().includes(pesquisaNormalizada) ||
        vendedor?.name.toLowerCase().includes(pesquisaNormalizada);

      const correspondeFiltro =
        this.filtroAtual === 'Todas' ||
        (this.filtroAtual === 'À Venda' && moeda.available_for_sale) ||
        (this.filtroAtual === 'Para Troca' && moeda.available_for_trade);

      return correspondePesquisa && correspondeFiltro;
    });

    if (this.ordenacao === 'preco') {
      resultado = this.marketService.sortByPrice(resultado);
    } else {
      resultado = this.marketService.sortByNewest(resultado);
    }

    return resultado;
  }

  mudarFiltro(filtro: string): void {
    this.filtroAtual = filtro;
  }

  mudarOrdenacao(): void {
    this.ordenacao = this.ordenacao === 'recentes' ? 'preco' : 'recentes';
  }

  async abrirDetalhe(moeda: Coin): Promise<void> {
    const modal = await this.modalController.create({
      component: MarketDetailModalComponent,
      componentProps: {
        coin: moeda,
        seller: this.getVendedor(moeda.owner_id),
      },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await modal.present();
  }

  async abrirMoedaDaPaginaInicial(): Promise<void> {
    const coinId = Number(localStorage.getItem('selectedMarketCoinId'));

    if (!coinId) {
      return;
    }

    localStorage.removeItem('selectedMarketCoinId');

    const moeda = this.moedas.find(moedaAtual => moedaAtual.id === coinId);

    if (moeda) {
      await this.abrirDetalhe(moeda);
    }
  }

  getFotoPrincipal(moeda: Coin): string {
    return moeda.photos?.length ? moeda.photos[0] : '';
  }

  getPrecoFormatado(moeda: Coin): string {
    if (moeda.available_for_sale && moeda.price !== null && moeda.price !== undefined) {
      return `${moeda.price} ${String.fromCharCode(8364)}`;
    }

    return 'Para Troca';
  }

  getTipoMercado(moeda: Coin): string {
    if (moeda.available_for_sale && moeda.available_for_trade) {
      return 'Venda & Troca';
    }

    if (moeda.available_for_sale) {
      return 'À Venda';
    }

    return 'Para Troca';
  }

  getVendedor(ownerId: number): User | undefined {
    return this.vendedores.get(ownerId);
  }

  getNomeVendedor(moeda: Coin): string {
    return this.getVendedor(moeda.owner_id)?.name ?? 'Vendedor';
  }

  getRatingVendedor(moeda: Coin): number {
    return this.getVendedor(moeda.owner_id)?.rating ?? 0;
  }
}
