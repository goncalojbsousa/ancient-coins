import { Component } from '@angular/core';

interface MoedaMercado {
  id: number;
  nome: string;
  origem: string;
  ano: number;
  material: string;
  condicao: string;
  descricao: string;
  preco: number;
  vendedor: string;
  rating: number;
  tipo: 'À Venda' | 'Para Troca';
  imagem: string;
}

@Component({
  selector: 'app-tab3',
  standalone: false,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  filtroAtual = 'Todas';
  pesquisa = '';
  moedaSelecionada: MoedaMercado | null = null;

  moedas: MoedaMercado[] = [
    {
      id: 1,
      nome: 'Denário de Prata',
      origem: 'Império Romano',
      ano: 120,
      material: 'Prata',
      condicao: 'Excelente',
      descricao: 'Moeda romana antiga em excelente estado de conservação.',
      preco: 450,
      vendedor: 'Ricardo Ferreira',
      rating: 4.9,
      tipo: 'À Venda',
      imagem: 'assets/img/portugal_coin.jpg'
    },
    {
      id: 2,
      nome: '2 Euros Comemorativa',
      origem: 'Portugal',
      ano: 2022,
      material: 'Bimetálica',
      condicao: 'Excelente',
      descricao: 'Moeda comemorativa portuguesa de 2 euros.',
      preco: 15,
      vendedor: 'Ana Sousa',
      rating: 4.7,
      tipo: 'À Venda',
      imagem: 'assets/img/Dobra_Portuguesa.webp'
    },
    {
      id: 3,
      nome: 'Moeda Prata Antiga',
      origem: 'Espanha',
      ano: 1820,
      material: 'Prata',
      condicao: 'Muito Bom',
      descricao: 'Moeda de prata com mais de 200 anos. Estado de conservação muito bom.',
      preco: 280,
      vendedor: 'Luís Almeida',
      rating: 4.8,
      tipo: 'À Venda',
      imagem: 'assets/img/constantino.jfif'
    },
    {
      id: 4,
      nome: 'Moeda para Troca',
      origem: 'Portugal',
      ano: 2020,
      material: 'Ouro',
      condicao: 'Excelente',
      descricao: 'Moeda disponível para troca com outros colecionadores.',
      preco: 0,
      vendedor: 'Joana Costa',
      rating: 5,
      tipo: 'Para Troca',
      imagem: 'assets/img/logo.png'
    }
  ];

  get moedasFiltradas() {
    const pesquisaNormalizada = this.pesquisa.trim().toLowerCase();

    return this.moedas.filter(moeda => {
      const correspondePesquisa =
        moeda.nome.toLowerCase().includes(pesquisaNormalizada) ||
        moeda.origem.toLowerCase().includes(pesquisaNormalizada) ||
        moeda.vendedor.toLowerCase().includes(pesquisaNormalizada);

      const correspondeFiltro =
        this.filtroAtual === 'Todas' || moeda.tipo === this.filtroAtual;

      return correspondePesquisa && correspondeFiltro;
    });
  }

  mudarFiltro(filtro: string) {
    this.filtroAtual = filtro;
  }

  abrirDetalhe(moeda: MoedaMercado) {
    this.moedaSelecionada = moeda;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  voltarMercado() {
    this.moedaSelecionada = null;
  }
}