import { Component, OnInit, inject } from '@angular/core';

import { Coin } from '../models/coin.model';
import { User } from '../models/user.model';
import { MarketService } from '../services/market.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-tab3',
  standalone: false,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  private marketService = inject(MarketService);
  private usersService = inject(UsersService);

  filtroAtual = 'Todas';
  pesquisa = '';
  ordenacao = 'recentes';

  loading = true;
  erro = '';

  moedas: Coin[] = [];
  moedaSelecionada: Coin | null = null;

  vendedores = new Map<number, User>();

  async ngOnInit(): Promise<void> {
    await this.carregarMercado();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.carregarMercado();
  }

  async carregarMercado(): Promise<void> {
    try {
      this.loading = true;
      this.erro = '';

      const [moedas, utilizadores] = await Promise.all([
        this.marketService.getMarketCoins(),
        this.usersService.getUsers()
      ]);

      this.moedas = this.marketService.sortByNewest(moedas);

      this.vendedores.clear();
      utilizadores.forEach(user => {
        this.vendedores.set(user.id, user);
      });

    } catch (error) {
      console.error('Erro ao carregar mercado:', error);
      this.erro = 'Não foi possível carregar as moedas do mercado.';
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

  abrirDetalhe(moeda: Coin): void {
    this.moedaSelecionada = moeda;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  voltarMercado(): void {
    this.moedaSelecionada = null;
  }

  getFotoPrincipal(moeda: Coin): string {
    return moeda.photos?.length ? moeda.photos[0] : 'assets/img/logo.png';
  }

  getPreco(moeda: Coin): string {
    if (moeda.available_for_sale && moeda.price !== null && moeda.price !== undefined) {
      return `€${moeda.price}`;
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

  getTotalReviewsVendedor(moeda: Coin): number {
    return this.getVendedor(moeda.owner_id)?.total_reviews ?? 0;
  }

  getInicialVendedor(moeda: Coin): string {
    return this.getNomeVendedor(moeda).charAt(0).toUpperCase();
  }
}