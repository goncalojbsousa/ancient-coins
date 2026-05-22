# **Sidemenu** 

_Última atualização do doc. 16.Abr.2026_

- [Sidemenu](#sidemenu)
- [Adicionar páginas](#adicionar-páginas)
- [Remover páginas](#remover-páginas)
- [Formatações](#formatações)
- [Alterar ecrã de entrada numa app criada com o template _sidemenu_](#alterar-ecrã-de-entrada-numa-app-criada-com-o-template-sidemenu)

> Procedimento para trabalhar com o template Sidemenu no Ionic: criação e configuração de páginas, edição do menu e das rotas, remoção de ecrãs e personalização do estilo. Inclui também o procedimento para alterar o ecrã inicial da aplicação.

# Sidemenu

> https://ionicframework.com/docs/api/menu

- Projeto desenvolvido com o template "sidemenu"  
`ionic start <nomeDaApp> sidemenu --type=angular`

- Deverá ser observada a estrutura da app na pasta `src\app`, onde apenas existe uma pasta:  
`folder`

## Manipulação do menu

- Ficheiros para a manipulação do menu:  
`src\app\app.component.html`  
`src\app\app.component.scss`    
`src\app\app.component.ts`

- Em `src\app\app.component.ts` manipular objeto `appPages` para alterar opções do menu.

Exemplo: 
```js
public appPages = [
  {
    title: 'Bem-vindos',
    url: '/folder/Bem-vindos',
    icon: 'home'
  }
];
```

Para a manipulação dos _labels_ deve ser editado o array com o mesmo nome. No exemplo abaixo todos os _labels_ foram removidos, colocando o array vazio: 
```js
public labels = [];
```

- Editar `app-routing.module.ts` para redefinir a página de entrada:
```js
{
  path: '',
  redirectTo: 'folder/Bem-vindos',
  pathMatch: 'full'
},
// ...
```

# Adicionar páginas

## Gerar uma nova página
- _Com um comando já estudado_, por exemplo:  
  `ionic generate page contactos`  
  Ou, de forma abreviada:  
`ionic g page contactos`  

## Editar a nova página
Editar a página `contactos.page.html`  
_nesta página poderão, por exemplo, ser colocados os contactos pessoais_

o header da página `<ion-header>...</ion-header>` deverá ficar da seguinte forma:

```HTML
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>Contactos</ion-title>
  </ion-toolbar>
</ion-header>
```

> Em `contactos.page.ts` deve ser colocado o `standalone: false` no _decorator_ `@Component`

## Configurar ligação ao novo ecrã no menu
Editar o root component (componente raiz): `app.component.ts` (na pasta `src/app`). Neste ficheiro observa-se um array de objetos que contêm as diferentes páginas (ecrãs) do projeto.
Cada objeto representa o título, a rota e os ícone de cada página (ecrã).

_Ver ícones em: https://ionicons.com/_  

No array `appPages` deverá ser colocado o seguinte objeto:
```js
{
  title: 'Contactos',
  url: '/contactos',
  icon: 'person'
}
```

# Remover páginas

Eliminar, por exemplo, uma página "livros", e respetiva opção do menu:

- Editar o ficheiro que gere as rotas (routing) `app-routing.module.ts` (em `\src\app\app-routing.module.ts`) e apagar o objeto:  

```js
{
  path: 'livros',
  loadChildren: () => import('./livros/livros.module').then( m => m.LivrosPageModule)
},
```

- Editar o ficheiro `app.component.ts` e retirar o objeto do array `appPages` (no caso de já ter sido configurada):  
```js
{
  title: 'Livros',
  url: '/livros',
  icon: 'book'
}
```

- Apagar a pasta `livros` (em `\src\app`)

> **Nota:**  
> Em projetos maiores, com outras "funcionalidades", poderá ocorrer que hajam mais referências à página que terão de ser eliminadas.

# Formatações

Todas as formatações/personalizações do menu estão em `\src\app\app.component.scss`.

# Alterar ecrã de entrada numa app criada com o template _sidemenu_

### 1. Criar Nova Página de Entrada

Por exemplo:
```
ionic g page entrada
```

(os seguintes pontos assumem a criação da página "entrada", mas são facilmente adaptáveis a outros nomes)

### 2. Alterar rotas

No ficheiro `\src\app\app-routing.module.ts`, editar o array que corresponde às routes da app, da seguinte forma:

Onde está:
```js
{
  path: '',
  redirectTo: 'folder/Inbox',
  pathMatch: 'full'
}
```

Passará a estar:
```js
{
  path: '',
  redirectTo: 'entrada',
  pathMatch: 'full'
}
```

Desta forma, aquando da entrada na app, passaremos a visualizar o ecrã "entrada".

### 3. Navegação para a Estrutura com o Sidemenu (disponibilizada pelo template) - Exemplo:

-  **Estilos do Ecrã** (opcional)

   Editar os estilos do ecrã de entrada em `\src\app\entrada\entrada.page.scss`:

   ```scss
   #container {
     text-align: center;
     position: absolute;
     left: 0;
     right: 0;
     top: 50%;
     transform: translateY(-50%);
   }
   ```

- **Estrutura do Ecrã** (exemplo)

   Editar a estrutura do ecrã de entrada em `\src\app\entrada\entrada.page.html` e configurar navegação para a estrutura do menu:

   ```html
   <ion-header>
   </ion-header>

   <ion-content>
     <div id="container" class="ion-padding">
       <div class="ion-margin-bottom">
         <ion-text color="danger">
           Exemplo de substituição do ecrã de entrada no template sidemenu
         </ion-text>
       </div>
       <ion-button shape="round" routerLink="/folder/Exemplo">
         Entrar
       </ion-button>
     </div>
   </ion-content>
   ```


---
_José Viana | josev@estg.ipvc.pt_