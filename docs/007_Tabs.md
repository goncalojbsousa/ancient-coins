# **Tabs**

_Última atualização do doc. 16.Abr.2026_

- [Tabs](#tabs)
- [Adicionar tabs](#adicionar-tabs)
- [Remover tabs](#remover-tabs)
- [Alterar página de entrada](#alterar-página-de-entrada)

> Procedimento para trabalhar com o template Tabs do Ionic: criação e configuração de aplicações com separadores, adição e remoção de tabs, gestão das rotas e definição de uma nova página de entrada com ligação ao conjunto de tabs.

# Tabs

https://ionicframework.com/docs/api/tabs

## Utilização do template tabs

- Iniciar (criar) app com o template _tabs_:  
`ionic start <nomeDaApp> tabs --type=angular`

- Ficheiros para a manipulação dos tabs:  
`src\app\tabs\tabs.page.html` (estrutura) +  
`src\app\tabs\tabs.page.scss` (formatação) +  
`src\app\tabs\tabs-routing.module.ts` (rotas dos tabs)

> Após a criação da nova app, com recurso a este _starter_, ao contrário do _starter sidemenu_, são criados três ecrãs distintos, aos
quais correspondem três pastas (com a estrutura já conhecida). É ainda gerada outra pasta `tabs` responsável pela gestão dos três
ecrãs referidos anteriormente.

A edição, adição e remoção dos `tabs` é feita recorrendo, essencialmente, a dois ficheiros:  
`src\app\tabs\tabs-routing.module.ts`  
`src\app\tabs\tabs.page.html`

Em `src\app\tabs\tabs-routing.module.ts` são configuradas as rotas para o funcionamento dos tabs.

Em `src\app\tabs\tabs.page.html` é configurado o aspeto visual dos tabs.

# Adicionar tabs

## Gerar uma nova página 
`ionic generate page outrapagina`

## Editar a página gerada
Editar a página em  
`src\app\outrapagina\outrapagina.page.html`

## Configurar a rota para o novo tab
Configurar a rota em  
`src\app\tabs\tabs-routing.module.ts`

No ficheiro, referido acima, adicionar o seguinte objeto, a `routes`, no array `children`:
```js
{
  path: 'outrapagina',
  loadChildren: () => import('../outrapagina/outrapagina.module').then(m => m.OutrapaginaPageModule)
}
```

No caso de dúvida em como construir o objeto acima, ele já se encontra em app-routing.module.ts
embora **deva ser retificado o caminho em** `import`.

Em `src\app\tabs\tabs.page.html` adicionar o novo `ion-tab-button` para o ecrã do novo tab:  

```HTML
<ion-tab-button tab="outrapagina">
  <ion-icon name="help-circle"></ion-icon>
  <ion-label>Outra</ion-label>
</ion-tab-button>
```

# Remover tabs

> A remoção processa-se como explicado anteriormente (no contexto do sidemenu),
acrescendo que deverá ser retirada a respetiva rota em src\app\tabs\tabs-routing.module.ts

# Alterar página de entrada

O processo abaixo descreve a criação/definição de uma nova página de entrada com o starter tabs, se for essa a intenção. Esta nova página de entrada terá, obviamente, uma ligação para a página de tabs: 

## Gerar uma nova página 
`ionic generate page nova`

Editar as rotas em `tabs/tabs-routing.module.ts`. O array das rotas ficará como mostrado abaixo:

```js
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      },
      {
        path: 'outrapagina',
        loadChildren: () => import('../outrapagina/outrapagina.module').then(m => m.OutrapaginaPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/nova',
    pathMatch: 'full'
  }
];
```

Para fazer a ligação ao ecrã inicial dos tabs pode utilizar-se, por exemplo, um botão com o código abaixo (na nova página criada):

```HTML
<ion-button expand="block" routerLink="/tabs">
  Entrar
</ion-button>
```

---
_José Viana | josev@estg.ipvc.pt_