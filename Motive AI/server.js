const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const KEY_FILE = path.join(ROOT, "openai-key.txt");

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

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(payload));
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

async function handleChat(req, res) {
  const openAiApiKey = getOpenAiApiKey();

  if (!openAiApiKey) {
    sendJson(res, 500, {
      reply: "A chave da OpenAI nao foi configurada no servidor. Coloque a chave em openai-key.txt ou na variavel OPENAI_API_KEY."
    });
    return;
  }

  let rawBody = "";
  req.on("data", (chunk) => {
    rawBody += chunk;
  });

  req.on("end", async () => {
    try {
      const body = JSON.parse(rawBody || "{}");
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
        sendJson(res, 502, {
          reply: `Erro ao chamar a OpenAI: ${errorText}`
        });
        return;
      }

      const data = await openaiResponse.json();
      const reply = data?.output?.[0]?.content?.[0]?.text;

      sendJson(res, 200, {
        reply: reply || "Deu erro ao interpretar a resposta da OpenAI."
      });
    } catch (error) {
      sendJson(res, 500, {
        reply: `Erro interno do servidor: ${error.message}`
      });
    }
  });
}

function serveStatic(req, res) {
  const urlPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream"
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    handleChat(req, res);
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Motive AI rodando em http://localhost:${PORT}`);
});
