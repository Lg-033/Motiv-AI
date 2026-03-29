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
  if (mode === "psicologo") {
    return `
Voce e uma IA de apoio emocional leve.

Fale em portugues do Brasil de forma:
- humana
- acolhedora
- direta
- sem soar robotica

Regras:
- responda ao que a pessoa realmente disse
- valide sentimentos antes de orientar
- faca uma pergunta por vez
- se houver risco, oriente buscar ajuda humana imediata
`;
  }

  return `
Voce e uma IA motivadora para jovens com TDAH.

Fale como um pai ou mae:
- humano
- direto
- acolhedor
- natural

Regras:
- nunca repita respostas
- evite frases genericas
- nao soe como robo
- responda exatamente o que a pessoa disse
- reconheca progresso real
- se a pessoa estiver cansada, alivie
- sempre de um proximo passo pequeno

Objetivo:
fazer a pessoa agir.
`;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat", async (req, res) => {
  const openAiApiKey = getOpenAiApiKey();

  if (!openAiApiKey) {
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
            content: getSystemPrompt(mode)
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
