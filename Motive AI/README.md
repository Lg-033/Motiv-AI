# Motive AI

Motive AI e uma IA de apoio emocional leve para pessoas desanimadas, cansadas ou sem direcao. O foco do produto nao e "animar com frases prontas", mas acolher, organizar o momento e ajudar a pessoa a dar um proximo passo pequeno e possivel.

## Objetivo do MVP

Criar uma primeira versao simples que consiga:

- receber a pessoa com empatia e sem julgamento
- identificar o tipo de desanimo ou bloqueio
- oferecer apoio pratico e motivacao realista
- sugerir micro-acoes de curto prazo
- fazer check-ins curtos
- reconhecer sinais de risco e orientar busca de ajuda humana

## Publico inicial

O MVP e pensado para pessoas que:

- estao desanimadas no dia a dia
- se sentem sem energia para estudar, trabalhar ou organizar a vida
- precisam de acolhimento e orientacao simples
- querem conversar sem se sentir julgadas

Nao substitui psicologo, psiquiatra, medico ou servicos de emergencia.

## Problema que resolve

Muitas pessoas nao precisam de uma grande solucao imediata. Elas precisam de:

- escuta
- clareza
- estrutura
- um passo pequeno

O Motive AI deve transformar "nao consigo fazer nada" em "consigo fazer so a proxima coisa".

## Proposta de valor

Uma IA que conversa com calma, entende o que esta pesando e ajuda a pessoa a sair da paralisia com apoio emocional e acoes pequenas.

## MVP de produto

Primeira versao recomendada:

- chat principal
- modo "dia dificil"
- plano de micro-acoes
- check-in diario
- mensagem final de reforco gentil
- fluxo de seguranca para crise emocional

## Experiencia principal

1. A pessoa abre o app e diz como esta se sentindo.
2. A IA acolhe e resume o que entendeu.
3. A IA identifica a categoria principal do momento.
4. A IA oferece um caminho curto e pratico.
5. A IA fecha com uma micro-acao e pergunta se a pessoa quer continuar.

## Categorias de conversa

- cansaco mental
- tristeza e desanimo
- procrastinacao
- ansiedade sobre tarefas
- solidao
- falta de direcao
- frustracao com trabalho ou estudos

## Principios de tom

- humano
- gentil
- simples
- direto sem ser frio
- sem positividade toxica
- sem julgamento
- sem promessas irreais

## Regras essenciais

- validar sentimentos antes de sugerir acoes
- evitar frases genericas como "voce consegue tudo"
- sugerir uma coisa de cada vez
- usar linguagem clara e curta
- adaptar o ritmo da conversa ao estado da pessoa
- em sinais de crise, priorizar seguranca e contato humano real

## Estrutura recomendada de resposta

Cada resposta do assistente pode seguir este formato:

1. acolhimento curto
2. reflexo do que entendeu
3. um proximo passo pequeno
4. convite leve para continuar

Exemplo:

> Parece que hoje esta pesado de verdade. Voce nao precisa resolver tudo agora. Vamos so escolher uma coisa simples para destravar os proximos 5 minutos?

## Proximos passos do projeto

- transformar este conceito em landing page
- criar interface de chat
- implementar prompt base e guardrails
- salvar humor, contexto e historico de check-ins
- testar com conversas reais simuladas

## Rodando como app real

Agora o projeto tambem pode rodar com backend para proteger a chave da OpenAI.

Arquivos principais:

- [server.js](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\server.js)
- [app.js](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\app.js)
- [package.json](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\package.json)
- [.env.example](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\.env.example)
- [openai-key.txt](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\openai-key.txt)
- [abrir-app.cmd](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\abrir-app.cmd)
- [abrir-server.cmd](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\abrir-server.cmd)
- [colocar-chave.cmd](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\colocar-chave.cmd)
- [iniciar-app.cmd](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\iniciar-app.cmd)
- [instalar-dependencias.cmd](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\instalar-dependencias.cmd)

Passos:

1. Se quiser a forma mais simples, abra `colocar-chave.cmd` e cole sua chave em `openai-key.txt`.
2. Se quiser editar o frontend, abra `abrir-app.cmd`.
3. Se quiser editar o backend, abra `abrir-server.cmd`.
4. Abra `instalar-dependencias.cmd` uma vez para instalar as dependencias.
5. Abra `iniciar-app.cmd`.
6. Abra `http://localhost:3000`.

Exemplo no PowerShell:

```powershell
$env:OPENAI_API_KEY="sua-chave-aqui"
npm start
```

A chave fica no servidor e nao aparece no navegador do usuario.
Se preferir, em vez da variavel de ambiente, o servidor tambem aceita a chave salva em `openai-key.txt`.
Se o Node.js nao estiver instalado, `iniciar-app.cmd` vai te avisar antes de tentar rodar.
O backend agora usa `express`, `cors` e `dotenv`.

## Publicar em um servidor

O backend ja esta preparado para deploy simples.

Arquivos de deploy:

- [render.yaml](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\render.yaml)
- [.gitignore](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\.gitignore)

### Opcao recomendada: Render

1. Suba este projeto para um repositorio GitHub.
2. No Render, crie um novo `Web Service` a partir do repositorio.
3. O Render vai ler `render.yaml` automaticamente.
4. No painel do Render, adicione a variavel `OPENAI_API_KEY`.
5. Faça o deploy.

Depois disso, seu app ficara online em uma URL publica do tipo:

`https://seu-app.onrender.com`

### Importante

- nao envie `openai-key.txt` para o GitHub
- em producao, prefira sempre `OPENAI_API_KEY` como variavel de ambiente
- o endpoint de verificacao do servidor e `/health`

Veja tambem:

- [mvp.md](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\mvp.md)
- [prompt-base.md](C:\Users\lgmsv\OneDrive\Documentos\Motive AI\prompt-base.md)
