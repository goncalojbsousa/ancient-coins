import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Coin } from '../models/coin.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { CoinsService } from '../services/coins.service';
import { UsersService } from '../services/users.service';

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
  private usersService = inject(UsersService);

  loading = true;
  erro = '';

  utilizador?: User;
  utilizadorAutenticado?: User;
  moedasDoUtilizador: Coin[] = [];
  perfilPublico = false;

  estatisticas = {
    moedas: 0,
    vendas: 0,
    trocas: 0,
    satisfacao: 0,
    valorTotal: 0,
  };

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

      const currentUser = await this.authService.getCurrentUser();
      this.utilizadorAutenticado = currentUser;

      const selectedProfileUserId = localStorage.getItem('selectedProfileUserId');

      if (selectedProfileUserId) {
        localStorage.removeItem('selectedProfileUserId');

        const userId = Number(selectedProfileUserId);

        if (!Number.isFinite(userId)) {
          this.erro = 'Perfil inválido.';
          return;
        }

        const publicUser = await this.usersService.getUserById(userId);

        if (!publicUser) {
          this.erro = 'Não foi possível carregar o perfil do vendedor.';
          return;
        }

        this.utilizador = publicUser;
        this.perfilPublico = currentUser?.id !== publicUser.id;
      } else {
        if (!currentUser) {
          this.erro = 'Não foi possível carregar o utilizador autenticado.';
          return;
        }

        this.utilizador = currentUser;
        this.perfilPublico = false;
      }

      this.moedasDoUtilizador = await this.coinsService.getCoinsByOwner(this.utilizador.id);
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

    const valorTotal = moedasVenda.reduce((total, moeda) => {
      return total + (moeda.price ?? 0);
    }, 0);

    this.estatisticas = {
      moedas: this.moedasDoUtilizador.length,
      vendas: moedasVenda.length,
      trocas: moedasTroca.length,
      satisfacao: this.utilizador ? Math.round((this.utilizador.rating / 5) * 100) : 0,
      valorTotal,
    };
  }

  getInicial(): string {
    return this.utilizador?.name.charAt(0).toUpperCase() ?? '?';
  }

  voltarAoMeuPerfil(): void {
    localStorage.removeItem('selectedProfileUserId');
    this.perfilPublico = false;
    this.carregarPerfil();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}