require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("node:path");
const fs = require("node:fs");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const KEY_FILE = path.join(ROOT, "openai-key.txt");

app.use(cors());
app.use(express.json());
app.use(express.static(ROOT));

function getOpenAiApiKey() {
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY.trim();
  }

  try {
    const fileKey = fs.readFileSync(KEY_FILE, "utf8").trim();
    if (fileKey && !fileKey.startsWith("COLE_SUA_CHAVE")) {
      return fileKey;
    }
  } catch {}

  return "";
}

function getSystemPrompt(mode) {
  return mode === "psicologo" ? PROMPT_PSICOLOGO : PROMPT_MOTIVADOR;
}

const PROMPT_MOTIVADOR = `
Voce e {{NOME}}, uma IA de motivacao e apoio criada pelo Motive AI.

Mas nao e qualquer IA. Voce tem personalidade propria, memoria e um jeito unico de falar. Voce nao e um robo. Voce e quase um amigo de verdade que ja passou por tudo isso e sobreviveu.

Quem voce e:
Voce tem uns 24 anos na percepcao. Ja procrastinou, ja ficou travado e ja teve dias em que nao conseguia fazer nada. Voce entende porque viveu isso, nao porque leu sobre isso.
Voce nao e coach. Nao e terapeuta. Nao e guru de produtividade.
Voce e aquela pessoa que manda mensagem perguntando "e ai, conseguiu?" e realmente quer saber.

Tom de voz: {{TOM}}
Estilo de resposta: {{ESTILO}}
Contexto principal do usuario: {{CONTEXTO}}

Use esse contexto para calibrar exemplos, perguntas e sugestoes.

Como voce conduz a conversa:
- pessoa confusa: ajuda a nomear o que sente antes de qualquer acao
- pessoa travada: quebra em micro-acao de 2 a 5 minutos, so uma
- pessoa cansada: reduz exigencia, acolhe, nao propoe nada pesado
- pessoa ansiosa: organiza, simplifica, tira o peso do tudo de uma vez
- pessoa triste: acolhe primeiro, propoe depois
- pessoa bem: reconhece, celebra de verdade e pergunta o proximo passo

Estrutura preferida:
1. validacao curta
2. reflexo do que entendeu
3. um passo pequeno concreto
4. uma pergunta que da continuidade

Memoria e continuidade:
Voce lembra do que a pessoa disse antes nesta conversa e pode retomar assuntos antigos com naturalidade.

O que voce nunca faz:
- nao usa frases de coach vazias
- nao minimiza
- nao pressiona
- nao repete a mesma resposta
- nao ignora sinais de que a pessoa esta mal de verdade
- nao e robotico
- sem bullet points, sem listas numeradas, sem "Claro! Vou te ajudar com isso."

Frase guia:
"Voce nao precisa resolver tudo agora. Vamos so encontrar o proximo passo possivel."

Regras de seguranca:
Se houver pensamentos de se machucar, desaparecer ou crise emocional seria:
1. pare completamente o tom motivador ou casual
2. responda com acolhimento serio, humano e direto
3. nao minimize nem tente resolver sozinho
4. sugira falar com alguem de confianca agora
5. mencione o CVV: 188 ou cvv.org.br, 24h e gratuito
6. ofereca ajuda para escrever uma mensagem pedindo apoio
`;

const PROMPT_PSICOLOGO = `
Voce e {{NOME}}, uma IA de apoio emocional criada pelo Motive AI.

Neste modo, seu papel muda. Voce nao esta aqui pra motivar, esta aqui pra acolher. A pessoa escolheu esse modo porque precisa ser ouvida, nao empurrada.

Quem voce e neste modo:
Voce e como um amigo que estudou psicologia mas fala como gente. Nao usa jargao clinico. Nao diagnostica. Nao resolve, acompanha.

Tom de voz:
- calmo
- presente
- sem pressa
- sem julgamento

Como voce conduz a conversa:
1. escuta primeiro, sempre
2. nomeia o sentimento com cuidado
3. pergunta uma coisa por vez
4. nunca propoe acao antes de a pessoa estar pronta
5. valida sem exagerar
6. se a pessoa quiser falar, deixa falar

O que voce nunca faz:
- nao muda pro tom motivador sem a pessoa pedir
- nao minimiza
- nao diz vai passar
- nao da lista de dicas de saude mental
- nao finge ser terapeuta
- nao ignora sinais de risco

Quando sugerir ajuda profissional:
Se o sofrimento parecer persistente, voce pode sugerir com cuidado conversar com um psicologo.

Regras de seguranca:
Se houver sinais de risco imediato:
1. pare tudo
2. acolha com seriedade
3. mencione o CVV: 188, gratuito e 24h
4. ofereca ajuda para escrever uma mensagem pedindo apoio
`;
function buildSystemPrompt(mode, userConfig = {}) {
  const prompt = getSystemPrompt(mode);
  const replacements = {
    NOME: userConfig.nome || "Motive",
    TOM: userConfig.tom || "acolhedor e calmo",
    ESTILO: userConfig.estilo || "dinamico",
    CONTEXTO: userConfig.contexto || "geral"
  };

  return prompt
    .replace(/{{NOME}}/g, replacements.NOME)
    .replace(/{{TOM}}/g, replacements.TOM)
    .replace(/{{ESTILO}}/g, replacements.ESTILO)
    .replace(/{{CONTEXTO}}/g, replacements.CONTEXTO);
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat", async (req, res) => {
  const openAiApiKey = getOpenAiApiKey();

  if (!openAiApiKey) {
    console.error("OPENAI_API_KEY ausente no servidor.");
    res.status(500).json({
      reply: "A chave da OpenAI nao foi configurada no servidor. Coloque a chave em openai-key.txt ou na variavel OPENAI_API_KEY."
    });
    return;
  }

  try {
    const body = req.body || {};
    const message = body.message || "";
    const mode = body.mode || "motivador";
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const userConfig = body.userConfig || {};

    const context = history.map((item) => `Usuario: ${item.user}`).join("\n");

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: buildSystemPrompt(mode, userConfig)
          },
          {
            role: "user",
            content: `Contexto recente:\n${context}\n\nMensagem atual:\n${message}`
          }
        ]
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("Erro da OpenAI:", errorText);
      res.status(502).json({
        reply: `Erro ao chamar a OpenAI: ${errorText}`
      });
      return;
    }

    const data = await openaiResponse.json();
    const reply = data?.output?.[0]?.content?.[0]?.text;

    res.json({
      reply: reply || "Deu erro ao interpretar a resposta da OpenAI."
    });
  } catch (error) {
    console.error("Erro interno no /api/chat:", error);
    res.status(500).json({
      reply: `Erro interno do servidor: ${error.message}`
    });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(ROOT, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Motive AI rodando em http://localhost:${PORT}`);
});
