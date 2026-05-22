# **Execução em dispositivo físico**

_Última atualização do doc. 29.Mar.2026_

- [Requisitos](#requisitos)
- [Execução de uma app em dispositivo físico](#execução-de-uma-app-em-dispositivo-físico)
- [Apontamentos teóricos](#apontamentos-teóricos)

> Apresentação prática do processo de execução de aplicações Ionic/Capacitor em dispositivos físicos Android. Inclui os requisitos de instalação e configuração do Android Studio e do ambiente Windows, a ativação da depuração USB no dispositivo, a preparação da app para execução, a adição da plataforma nativa com Capacitor, a execução em emulador ou dispositivo físico, e a geração de APKs para teste ou distribuição. É explicado todo o fluxo desde o desenvolvimento até a execução real da app.

# Requisitos

## Android Studio
> NOTA inicial:  
> No caso de haver alguma versão anterior instalada deverá ser removido tudo. Contudo, neste caso, não é necessário fazer essa remoção previamente porque o processo de instalação deteta o que está instalado e sugere a desinstalação (que deve ser feita).   
>   - [v] _Uninstall the previous version_   
>   Next

1. Download do Android Studio em [https://developer.android.com/studio/](https://developer.android.com/studio/)  
Atualmente: Android Studio Panda 2
   - Download Android Studio
   - [x]  I have read and agree with the above terms and conditions
   - Download Android Studio ... 

2. Welcome to Android Studio Setup   
Next

3. Choose Components  
(Deixar tudo selecionado)  
Next

4. Configuration Settings  
Next

5. Choose Start Menu Folder  
Install

6. Installation Complete  
Next

7. Completing Android Studio Setup  
[v] Start Android Studio  
Finish

> No caso de a Firewall do Windows pedir acessos, estes devem ser permitidos.  
Permitir acesso

_Os passos abaixo poderão não aparecer, dependendo da existência prévia de outras versões_

8. Ao abrir o Android Studio (a primeira vez)  
  "Do not import settings"

9. Welcome Android Studio  
Next

10. Install Type  
Standard

11. Select UI Theme  
Next

12. Verify Settings  
Finish

13. Downloading Components  
(_processo relativamente demorado_)  
Finish

14. Welcome to Android Studio  

> Tipicamente, no final da instalação, no canto inferior direito do Android Studio, são recomendadas algumas atualizações. Embora possam ser ignoradas, sem prejuízo do normal funcionamento da aplicação, é recomendável fazer essas atualizações.   
> Estas recomendações de atualização vão aparecendo, ao longo do tempo, conforme vão sendo disponibilizadas.

## Configurar o Windows

15. Definir a variável de ambiente ANDROID_SDK_ROOT  
(ver o caminho "Android SDK Location" em "More Actions » SDK Manager" ou "Tools" » SDK Manager)  
**Editar as variáveis de ambiente do sistema**  (no Windows):  
Editar as variáveis de ambiente do sistema » Propriedades do sistema » Avançadas »  Variáveis de ambiente...

16. Nas "Variáveis de utilizador" » Botão "Novo..."

17. Em "Nome da variável:" colocar:  
ANDROID_SDK_ROOT

18. No "Valor da variável:" colocar:  
Ver o caminho do ponto 15., por exemplo, no meu caso é:  
C:\Users\z\AppData\Local\Android\Sdk
Ok

19. Para definir as pastas do Android SDK para a linha de comandos:  
- Clicar na variável "Path" e de seguida no botão "Editar..."
- Clicar em "Novo" 
- Ver o caminho no ponto 15.
- Colocar esse caminho, mais \tools\bin  
Por exemplo: C:\Users\z\AppData\Local\Android\Sdk\tools\bin  

- Clicar em "Novo" 
- Ver o caminho no ponto 15.
- Colocar esse caminho, mais \platform-tools  
Por exemplo: C:\Users\z\AppData\Local\Android\Sdk\platform-tools

- Clicar em "Novo" 
- Ver o caminho no ponto 15.
- Colocar esse caminho, mais \emulator  
Por exemplo: C:\Users\z\AppData\Local\Android\Sdk\emulator

20. REINICIAR O computador

# Execução de uma app em dispositivo físico

1. No telemóvel (poderá haver diferenças entre modelos diferentes): 
    - Definições
    - Sistema 
    - Avançadas
    - Opções do programador
    - Depuração USB -> Ativar

2. Ligar o telemóvel ao computador, por cabo USB, e no terminal executar o seguinte comando:  
`adb devices`

No caso de os passos anteriores terem sido efetuados com sucesso, deverá aparecer algo semelhante como resposta ao comando:  
`List of devices attached`  
`2b11c29 device`

> Os pontos seguintes serão abordados posteriormente, no contexto do desenvolvimento/teste de uma app. Nesta fase o importante é verificar com **sucesso** a execução do passo anterior.

3. Preparar a app para qualquer plataforma de destino (Build web assets):  
`ionic build`  
(este processo é feito apenas uma vez, por app)

4. Adicionar o capacitor ao projeto:  
`ionic capacitor add android`  
(este processo é feito apenas uma vez, por app)

5. Opcionalmente, podemos definir o Package ID  
O ID do pacote (Package ID) é referido pela Apple como ID do pacote (Bundle ID) e pelo Android como ID da aplicação (Application ID), o ID do pacote é usado para identificar apps publicadas na App Store / Play Store.  
(será abordado em aula posterior)

6. Executar a app num dispositivo físico ou num emulador  
`ionic capacitor run android`  
Este comando abre, de forma automática, o Android Studio e permite testar a app num emulador ou num dispositivo físico (se estiver ligado).  
Na barra de ferramentas, do Android Studio, deverá ser selecionado o dispositivo e fazer "Run". No caso de já não ser a primeira vez, e tratar-se de um dispositivo físico, a app do dispositivo já consegue ligar ao servidor e executar normalmente (mesmo sem fazer "Run").  
Após este comando, mesmo após o término do processo e após desligarmos o dispositivo do computador, a app permanece no dispositivo.


OU para executar a app num dispositivo físico ou num emulador, com um servidor "live-reload":
ionic capacitor run android --livereload --external

Neste caso, após o término do processo e após desligarmos o dispositivo do computador, apesar da app continuar no dispositivo esta não funcionará porque precisa do servidor "live-reload". 


> NOTAS FINAIS  
> O processo acima descrito gera um apk (ficheiro para instalação num dispositivo físico Android). Esse ficheiro localiza-se no seguinte caminho (dentro do projeto do Ionic):  
`android/app/build/outputs/apk/debug/app-debug.apk`
>   
> No caso se querermos gerar um apk final podemos, no Android Studio, aceder à seguinte opção:   
> Build » Build Bundle(s) / APK(s) » Build APK(s)   
> Esta opção gera um apk localizado seguinte caminho (dentro do projeto do Ionic):   
> `android\app\release\app-release.apk`
>   
> Através do terminal também é possível executar uma app num dispositivo físico, com o seguinte comando:  
> `native-run android --app android/app/build/outputs/apk/debug/app-debug.apk --device`

# Apontamentos teóricos

## O que significa APK?
Android PacKage

## O que é o Capacitor?
Capacitor é um projeto "open source" que executa Web Apps nativamente no iOS, Android, Electron e Web (usando a tecnologia Progressive Web App) 
enquanto fornece uma interface poderosa e fácil de usar para acesso a SDKs nativos e APIs nativos em cada plataforma. Como alternativa ao Cordova, 
o Capacitor oferece os mesmos benefícios tirando proveito das últimas APIs
Web e dos recursos nativos das várias plataformas.

## O que significa SDK?
Software Development Kit

## O que significa API?
Application Programming Interface

---
_José Viana | josev@estg.ipvc.pt_
