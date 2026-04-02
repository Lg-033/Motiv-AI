# MVP do Motive AI

## Visao

O MVP deve ser simples o suficiente para lancar rapido e util o suficiente para realmente ajudar uma pessoa desanimada a se reorganizar no momento presente.

## Funcionalidades da primeira versao

### 1. Chat empatico

Entrada livre de texto com respostas que:

- acolhem
- resumem o sentimento percebido
- evitam exageros
- conduzem para uma proxima acao pequena

### 2. Modo "Dia dificil"

Um botao ou atalho para quando a pessoa nao consegue nem explicar direito o que sente.

Fluxo:

- pergunta curta: "Quer que eu te ajude a atravessar este momento sem pressa?"
- oferece 3 caminhos:
  - respirar e desacelerar
  - organizar uma tarefa
  - desabafar primeiro

### 3. Plano de micro-acoes

A IA sugere acoes pequenas, como:

- beber agua
- levantar e lavar o rosto
- abrir apenas uma tarefa
- responder uma unica mensagem
- organizar os proximos 10 minutos

### 4. Check-in diario

Perguntas curtas:

- como voce esta hoje de 0 a 10?
- o que esta mais pesado agora?
- qual seria uma pequena vitoria hoje?

### 5. Fluxo de seguranca

Se detectar risco emocional, a IA deve:

- reduzir o tom motivacional
- responder com acolhimento e seriedade
- recomendar ajuda humana imediata
- orientar contato com amigo, familiar, profissional ou servico de emergencia

## O que nao entra no MVP

- diagnostico clinico
- conselhos medicos
- analises profundas de terapia
- gamificacao complexa
- rede social
- voz

## Persona inicial

Nome ficticio: Ana, 24 anos

- trabalha ou estuda
- sente sobrecarga
- procrastina quando esta emocionalmente cansada
- quer ajuda rapida, humana e sem sermoes

## Casos de uso

### Caso 1: Desanimo geral

Usuario:
"Nao tenho vontade de fazer nada hoje."

IA:
"Parece um daqueles dias em que tudo pesa antes mesmo de comecar. Vamos tirar a pressao de fazer tudo. Qual destas tres coisas parece mais possivel agora: tomar agua, sentar por 2 minutos em silencio ou escolher uma unica tarefa pequena?"

### Caso 2: Ansiedade com tarefas

Usuario:
"Estou travado com tanta coisa acumulada."

IA:
"Quando tudo acumula, o cerebro comeca a tratar tudo como urgencia. Vamos diminuir o tamanho disso juntos. Me diz qual e a tarefa menos dificil da lista, e eu te ajudo a quebrar em um primeiro passo."

### Caso 3: Solidao

Usuario:
"Estou me sentindo muito sozinho."

IA:
"Sinto muito que esteja assim. Solidao pesa de um jeito silencioso. Se fizer sentido, posso ficar com voce por alguns minutos agora e depois pensar em uma forma leve de se aproximar de alguem de confianca."

## Indicadores de sucesso do MVP

- usuario sente acolhimento logo na primeira resposta
- conversa termina com pelo menos uma micro-acao clara
- usuario entende que nao esta sendo julgado
- fluxo de risco aciona orientacoes adequadas

## Stack sugerida para comecar

- frontend: site simples com chat
- backend: API para gerenciar conversas
- modelo: LLM com prompt controlado
- armazenamento inicial: historico basico de sessoes e check-ins

## Caminho de evolucao

1. Landing page + chat funcional
2. Perfis de estado emocional
3. Historico de progresso
4. Rotinas e lembretes
5. Personalizacao por contexto de vida
