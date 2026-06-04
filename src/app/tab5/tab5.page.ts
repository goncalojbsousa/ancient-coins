import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: false,
})
export class Tab5Page {

  private authService = inject(AuthService);
  private router = inject(Router);

  utilizador = {
    nome: 'Rui Mendonça',
    email: 'rui@example.com',
    membroDesde: '2024',
    avaliacao: 4.9,
    totalAvaliacoes: 18
  };

  estatisticas = {
    vendas: 12,
    trocas: 8,
    satisfacao: 96,
    gastos: 2680
  };

  conquistas = [
    {
      emoji: '🏆',
      titulo: 'Vendedor Confiável',
      descricao: '+10 vendas bem-sucedidas'
    },
    {
      emoji: '⭐',
      titulo: 'Avaliação 5 Estrelas',
      descricao: 'Mantém excelente reputação'
    },
    {
      emoji: '🤝',
      titulo: 'Negociador Expert',
      descricao: '+5 trocas realizadas'
    },
    {
      emoji: '📚',
      titulo: 'Colecionador Ativo',
      descricao: 'Membro há mais de 1 ano'
    }
  ];

  avaliacoes = [
    {
      nome: 'Pedro Santos',
      data: '15/03',
      comentario:
        'Excelente vendedor! Moeda chegou bem embalada e conforme descrito.'
    },
    {
      nome: 'Maria Oliveira',
      data: '20/02',
      comentario:
        'Muito profissional. Recomendo!'
    }
  ];

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}