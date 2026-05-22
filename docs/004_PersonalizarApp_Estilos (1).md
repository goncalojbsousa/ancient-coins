# **Personalização de uma _app_**

_Última atualização do doc. 26.Mar.2026_

- [Introdução](#introdução)
- [Personalização global](#personalização-global)
- [Color Creator](#color-creator)
- [Personalização dos _Ionic Components_](#personalização-dos-ionic-components)
- [Mais informação](#mais-informação)

> Personalização da aparência de uma aplicação **Ionic**, com explicação sobre o uso de **CSS e SCSS** para definir estilos globais e específicos. Inclui a criação e aplicação de **cores personalizadas** com o *Color Creator*, a utilização de **variáveis de tema** no ficheiro `variables.scss`, e a personalização dos **componentes Ionic** através de *CSS Custom Properties* e *Shadow Parts*. Contém ainda ligações para recursos oficiais e exemplos práticos de formatação e utilização de ícones e utilitários CSS.


# Introdução

- Uma app pode ser formatada com recurso a CSS;

- Cada página tem uma folha de estilos (`.scss`) associada;

- Na pasta `theme` (junto da pasta `src/app`) existe o ficheiro `variables.scss` no qual podem ser redefinidos valores de variáveis responsáveis pelas formatações da app;

- No ficheiro `src/global.scss` é o local onde podem ser feitas formatações globais (personalizações) à app.

# Personalização global

- Por defeito, os _Ionic components_ têm uma formatação que é adaptável a diferentes plataformas: 
    - ios: para iOS (iPhone e iPad);
    - md: para Android, com o Material Design;
    - _qualquer outra plataforma utiliza os estilos "md", o que significa que se for feito um website com recurso ao Ionic, o estilo aplicado é o do Material Design_.
- É possível forçar a formatação, independentemente da plataforma de destino. No exemplo abaixo, por exemplo, o botão ficará sempre com o aspeto de iOS:
    ```html
    <ion-button mode="ios">Sempre com o aspeto de iOS</ion-button>
    ```


## Cores

1. Cores disponibilizadas pela framework:    
https://ionicframework.com/docs/theming/basics#colors


2. Color creator para a criação de cores personalizadas:  
https://ionicframework.com/docs/theming/colors#new-color-creator

    (ver secção [Color Creator](#color-creator))

3. Personalização das cores da app (variáveis CSS):  
https://ionicframework.com/docs/theming/themes#application-colors


4. Color generator para alteração das cores da framework:  
https://ionicframework.com/docs/theming/color-generator


## Ícones (Ionicons)

1. Documentação:  
https://ionicons.com/usage/

1. Ícones:  
https://ionicons.com/

## Outras configurações

1. Application Variables (variáveis CSS para algumas definições da app):  
https://ionicframework.com/docs/theming/advanced#application-variables



# Color Creator

O Color Creator permite a criação de cores personalizadas, diferentes das disponibilizadas pelo Ionic.

## 1. Criar uma cor personalizada

1. Aceder ao [Color Creator do Ionic](https://ionicframework.com/docs/theming/colors#new-color-creator).
2. Dar um nome à cor na caixa "New".
3. Selecionar uma cor ou utilizar um código RGB da cor desejada
4. Copiar o código gerado.

## 2. Adicionar a cor personalizada ao projeto Ionic

1. Abrir o ficheiro `src/theme/variables.scss` do projeto Ionic.
2. Adicionar o código, copiado no passo anterior, no final do ficheiro.
3. Guardar o ficheiro.

## 3. Aplicar a cor a um _component_

Tal como são as utilizadas as cores disponibilizadas pela framework ("primary", "secondary", "tertiary", "success", "warning", "danger", "light", "medium" e "dark"), podemos agora utilizar a nova cor.

Vamos supor que foi criada a cor com o nome **estg**. Para, por exemplo, atribuir essa cor a um botão (ou a um outro qualquer _component_ que tenha a _propertie_ **color**) o código ficaria assim:

```html
<ion-button color="estg">
  Exemplo
</ion-button>
```

## 4. Utilizar a cor personalizada nos ficheiros CSS (`*.scss`)

1. Abrir o ficheiro `.scss` correspondente ao componente (ecrã) onde é necessária a utilização da nova cor.
2. Aplicar a cor personalizada aos elementos desejados usando a propriedade `color` ou `background-color`, conforme necessário. Por exemplo:

```scss
.titulo-da-escola {
  color: var(--ion-color-estg);
}

.titulo-noticia {
  background-color: var(--ion-color-estg);
}
```

A _class_ definida acima, pode ser utilizada nos ficheiros `*.html`, por exemplo, da seguinte forma:

```html
<div class="titulo-noticia">Candidaturas a licenciaturas e CTeSP</div>
```

# Personalização dos _Ionic Components_

- Os componentes do Ionic não são personalizáveis, diretamente, com CSS 
    > Isto deve-se ao facto de estes componentes estarem no [Shadow DOM](https://ionicframework.com/docs/theming/css-shadow-parts). 

  Ver Shadow Parts (nos docs do component)

  Exemplo:
  ```css
  ion-menu::part(backdrop) {
    background-color: rgba(255, 0, 255, 0.5);
  }

  ion-menu::part(container) {
    border-radius: 0 20px 20px 0;
    --background: rgba(255, 0, 255, 0.5);
    box-shadow: 4px 0px 16px rgba(255, 0, 255, 0.18);
  }
  ```

- Para todos os componentes do Ionic existe um conjunto de _CSS Custom Properties_, tipicamente no final da documentação do componente. São estas propriedades que devem de ser utilizadas para a formatação de um componente.

  Por exemplo, para a formatação de um botão podemos fazer o seguinte (no ficheiro `.scss`):

  ```css
  ion-button {
    --background: chocolate;
    --color: white;
    --border-radius: 20px;
  }
  ```

# Mais informação

## CSS utilities
https://ionicframework.com/docs/layout/css-utilities

Exemplo (conteúdo centrado):
```html
<div class="ion-text-center">
  <img src="./assets/exemplo.jpg">
</div>
```

### Element placement
https://ionicframework.com/docs/layout/css-utilities#element-placement

### Element padding 
https://ionicframework.com/docs/layout/css-utilities#content-space

---
_José Viana | josev@estg.ipvc.pt_
