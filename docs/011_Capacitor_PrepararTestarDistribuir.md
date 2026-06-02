# **Capacitor - Criar / Preparar / Testar / Distribuir uma app**

_Última atualização do doc. 30.Mai.2026_

- [Capacitor](#capacitor)
- [Criar app](#criar-app)  
  _Preparada para dispositivo físico ou emulador_
- [Preparar a app](#preparar-a-app)  
  _Dispositivo físico ou emulador_
- [Debug de uma app](#debug-de-uma-app)
- [apk (Distribuição)](#apk-distribuição)

> Apresentação prática do processo completo de criação, preparação, teste e distribuição de uma aplicação Ionic com Capacitor. Abordagem à configuração da app, integração com plataformas nativas, execução em dispositivos físicos ou emuladores, depuração remota e geração do ficheiro APK para distribuição/teste.

> Este guião tem como requisito a instalação/configuração prévia do Android Studio. A versão disponível deve ser confirmada em https://developer.android.com/studio antes da instalação.

# Capacitor

Plataforma de desenvolvimento de aplicações móveis híbridas.

- Possibilita o desenvolvimento de aplicações nativas para dispositivos móveis através da utilização das tecnologias da web: HTML, CSS e JavaScript/TypeScript.
- Permite acesso às APIs nativas do dispositivo.
- Possibilita o desenvolvimento de aplicações com capacidade de trabalhar offline.
- Suporta várias plataformas: iOS, Android e web.

  > Em contexto do Ionic, o Capacitor é o que possibilita que os projetos desenvolvidos com a framework possam ser instalados e executados em dispositivos móveis.

# Criar app
## Preparada para dispositivo físico ou emulador

- Criar uma nova app:

  ```bash
  ionic start exemplocapacitor blank --type=angular
  ```

  > De notar que, durante o processo de criação/configuração da app, o Ionic prepara a integração com o Capacitor. Em projetos Ionic recentes, normalmente já existem dependências Capacitor no projeto criado.

- Ver configurações do Capacitor no ficheiro `capacitor.config.ts`:

  ```typescript
  import type { CapacitorConfig } from '@capacitor/cli';

  const config: CapacitorConfig = {
    appId: 'io.ionic.starter',
    appName: 'exemplocapacitor',
    webDir: 'www'
  };

  export default config;
  ```

- (Opcional - Recomendado) Definir configurações do Capacitor (definição do Package ID)

  > **Este passo impede que, quando é feito o _deploy_ para o dispositivo físico, as apps sejam sobrepostas.**

  (Re)definir:

  - `appName` representa o nome da app.
  - `appId` é o identificador de domínio da app.

  **Notas:**

  > **Package ID**  
  Referido pela Apple como Bundle ID.  
  Referido pela Google (Android) como Application ID.

  > O Package ID é utilizado para a identificação das apps para a App Store ou Play Store.  
  É uma string formatada na notação reverse-DNS.

  Mais informação:  
  https://ionicframework.com/docs/reference/glossary#package-id

  No Ionic, inicialmente, o `capacitor.config.ts` é criado da seguinte forma:

  ```typescript
  import type { CapacitorConfig } from '@capacitor/cli';

  const config: CapacitorConfig = {
    appId: 'io.ionic.starter',
    appName: 'exemplocapacitor',
    webDir: 'www'
  };

  export default config;
  ```

  Após nova configuração o ficheiro `capacitor.config.ts` ficará, por exemplo, como abaixo:

  ```typescript
  import type { CapacitorConfig } from '@capacitor/cli';

  const config: CapacitorConfig = {
    appId: 'pt.jviana.aminhaapp',
    appName: 'A minha app',
    webDir: 'www'
  };

  export default config;
  ```

  Alternativamente, se a plataforma Android já tiver sido adicionada, a alteração do id da aplicação pode ser feita na pasta android, no ficheiro `android/app/build.gradle`, ajustando o `applicationId`.

Mais informação:  
https://developer.android.com/studio/build/application-id

> O Capacitor não altera automaticamente todos os projetos nativos já gerados quando são mudados o `appId` e o `appName` em `capacitor.config.ts`. Estes valores são usados na criação inicial da plataforma nativa. Após a pasta `android` ou `ios` existir, alterações ao nome ou id podem exigir atualização manual no projeto nativo.

> No caso de ser necessário fazer alguma reconfiguração, a pasta `android`/`ios` pode ser apagada e o projeto nativo gerado de novo. Alternativamente, se for necessária a alteração do _app name_ ou do `applicationId`, a operação pode ser feita diretamente no projeto nativo.

# Preparar a app
## Para dispositivo físico ou emulador

1. Preparar a app para qualquer plataforma de destino (Build web assets):

    ```bash
    ionic build
    ```

    > Este comando cria a pasta `www` (também é criada a pasta `.angular`).  
    Estas pastas não são necessárias na distribuição do projeto-fonte da app, por exemplo, para upload para o Moodle.

1. Adicionar a plataforma Android ao projeto Ionic:

    ```bash
    ionic capacitor add android
    ```

    ou, de forma abreviada:

    ```bash
    ionic cap add android
    ```

    > Este comando cria a pasta `android`.  
    Esta pasta não é necessária na distribuição do projeto-fonte da app, por exemplo, para upload para o Moodle.

    ou, no caso de _ios_:

    ```bash
    ionic cap add ios
    ```

  Mais informação:  
  https://capacitorjs.com/docs/basics/workflow

- Abrir o projeto Ionic/Capacitor no Android Studio:

  > Não é necessário ter o telemóvel ligado.

  ```bash
  ionic cap open android
  ```

  _Poderá, durante o processo, surgir a questão "Trust and Open Project 'android'?". Neste caso deverá ser respondido "Trust Project"._

  Após o carregamento estar completo, selecionar um dispositivo/emulador e clicar, na barra de ferramentas, no botão _Run 'app'_.

- Executar a app num dispositivo físico ou num emulador:

  Ligar o telemóvel, por USB, ao computador. O telemóvel deverá ter ativo o "Modo de depuração com USB".

  - Esta opção estará disponível, tipicamente, na opção _Opções do Programador_, nas definições (a localização/ativação difere entre dispositivos/sistemas diferentes).

  - Ou, em Definições » Definições adicionais » Opções do programador.

  E executar o seguinte comando:

  ```bash
  ionic capacitor run android
  ```

  ou

  ```bash
  ionic cap run android
  ```

- No caso de aparecer esta mensagem no telemóvel deve ser dada a respetiva permissão:

  - Permitir depuração USB?  
  A impressão digital da chave RSA do computador é:  
  XX:XX:XX...

  - [v] Permitir sempre a partir deste computador  
  [PERMITIR]

  - De seguida, na consola, à questão  
  _Which device would you like to target?_  
  deverá ser selecionado o dispositivo físico ligado ao computador.

  - Pode haver a necessidade de configurações/autorizações adicionais no telemóvel. No caso de insucesso, no processo, devem ser lidos os erros e retificadas as respetivas configurações.

# Debug de uma App

No caso da passagem da app para um dispositivo físico podem ocorrer erros e/ou a app não funcionar. Nesse caso deverá fazer-se o "Remote debug".

Os passos abaixo (para o Chrome) descrevem o processo para iniciar o "Remote debug" (com dispositivo ligado ao PC):

1. Na barra de endereço do browser executar:

    ```text
    chrome://inspect/#devices
    ```

2. Para inspecionar os eventuais problemas, clicar em _Inspect_ na app pretendida de entre as listadas (caso haja mais do que uma listada).

3. Os eventuais erros poderão ser visualizados na _Consola_ do browser (como é feito, normalmente, no desenvolvimento de páginas web).


# apk (Distribuição)

> O APK gerado por _Build APK(s)_ é adequado para instalação manual/teste. Para publicação formal na Google Play deve ser usado, normalmente, um Android App Bundle (`.aab`) assinado.

1. Para o efeito, deve ser feita, em primeiro lugar, a cópia e/ou a atualização de todo o projeto:

    ```bash
    ionic capacitor sync android
    ```

    O comando "sync" encarrega-se de copiar e atualizar o projeto Ionic, através das seguintes ações:

    - Executar um "ionic build", preparando a app para a plataforma de destino.

    - Copiar tudo o que necessita (web assets) para a plataforma nativa de destino.

    - Atualizar o Capacitor de acordo com a plataforma de destino e todas as suas dependências.

    - Instalar todos os plugins do Capacitor que existam no projeto.

    ## Quando fazer o sync de um projeto?

    Poderá haver a necessidade de fazer o _sync_ (sincronizar) a app com o projeto nativo nas seguintes circunstâncias:

    - Quando é necessária a cópia de (novos) _assets_ para o projeto nativo.

    - Antes de executar o projeto usando um IDE Nativo.

    - Depois de instalar um novo plugin do Capacitor.

    - Depois de clonar o projeto.

    - Quando é necessário configurar ou reconfigurar o projeto nativo para o Capacitor.

    - Quando são instaladas dependências nativas.

    Mais informação:  
    https://ionicframework.com/docs/cli/commands/capacitor-sync

2. Abrir o projeto Ionic/Capacitor no Android Studio:

    (não é necessário ter o telemóvel ligado)

    ```bash
    ionic cap open android
    ```

3. Após a abertura do Android Studio, deixar que todos os processos terminem.

4. Gerar o APK acedendo ao menu do Android Studio "Build":  
Build » Build Bundle(s) / APK(s) » Build APK(s)

5. Quando o processo é terminado surgirá a seguinte notificação:

    > Build APK(s)  
    APK(s) generated successfully for 1 module:  
    Module 'android.app': locate or analyze the APK.

6. Clicar em `locate` (na mensagem que aparece em 5.)

    ou, alternativamente, abrir a localização do projeto na pasta:

    ```text
    android\app\build\outputs\apk\debug
    ```

    ou seja, em:

    ```text
    C:\<localizacao_do_projeto>\<nome_da_app>\android\app\build\outputs\apk\debug
    ```

7. Copiar o ficheiro `app-debug.apk` para o dispositivo.

    > O ficheiro pode ser renomeado.

8. Localizar o ficheiro no dispositivo e executá-lo para que seja efetuada a instalação da app.

    > No caso da existência de uma outra versão da app no dispositivo, não há a necessidade da sua prévia remoção. O sistema deteta a versão anterior e informa o seguinte:  
    "Pretende instalar uma atualização para esta aplicação existente? Os seus dados existentes não serão perdidos."

---
_José Viana | josev@estg.ipvc.pt_
