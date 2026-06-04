import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Coin } from '../models/coin.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { CoinsService } from '../services/coins.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: false,
})
export class Tab5Page implements OnInit {
  private authService = inject(AuthService);
  private coinsService = inject(CoinsService);
  private router = inject(Router);

  loading = true;
  erro = '';

  utilizador?: User;
  moedasDoUtilizador: Coin[] = [];

  estatisticas = {
    moedas: 0,
    vendas: 0,
    trocas: 0,
    satisfacao: 0,
    valorTotal: 0
  };

  conquistas = [
    {
      emoji: '🏆',
      titulo: 'Colecionador Ativo',
      descricao: 'Tem moedas registadas na coleção'
    },
    {
      emoji: '⭐',
      titulo: 'Boa Reputação',
      descricao: 'Mantém avaliações positivas'
    },
    {
      emoji: '🤝',
      titulo: 'Disponível para Trocas',
      descricao: 'Tem moedas publicadas para troca'
    },
    {
      emoji: '💰',
      titulo: 'Vendedor',
      descricao: 'Tem moedas publicadas para venda'
    }
  ];

  async ngOnInit(): Promise<void> {
    await this.carregarPerfil();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.carregarPerfil();
  }

  async carregarPerfil(): Promise<void> {
    try {
      this.loading = true;
      this.erro = '';

      await this.authService.init();

      const user = await this.authService.getCurrentUser();

      if (!user) {
        this.erro = 'Não foi possível carregar o utilizador autenticado.';
        return;
      }

      this.utilizador = user;
      this.moedasDoUtilizador = await this.coinsService.getCoinsByOwner(user.id);

      this.calcularEstatisticas();

    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      this.erro = 'Não foi possível carregar os dados do perfil.';
    } finally {
      this.loading = false;
    }
  }

  calcularEstatisticas(): void {
    const moedasVenda = this.moedasDoUtilizador.filter(moeda => moeda.available_for_sale);
    const moedasTroca = this.moedasDoUtilizador.filter(moeda => moeda.available_for_trade);

    const valorTotal = this.moedasDoUtilizador.reduce((total, moeda) => {
      return total + (moeda.price ?? 0);
    }, 0);

    this.estatisticas = {
      moedas: this.moedasDoUtilizador.length,
      vendas: moedasVenda.length,
      trocas: moedasTroca.length,
      satisfacao: this.utilizador ? Math.round((this.utilizador.rating / 5) * 100) : 0,
      valorTotal
    };
  }

  getInicial(): string {
    return this.utilizador?.name.charAt(0).toUpperCase() ?? '?';
  }

  getMembroDesde(): string {
    return '2026';
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}