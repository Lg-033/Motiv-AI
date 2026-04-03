const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const resetButton = document.getElementById("reset-chat");
const modeButtons = document.querySelectorAll(".mode-button");
const chatTitle = document.querySelector(".chat-header h3");

let currentMode = "motivador";
let memory = JSON.parse(localStorage.getItem("memory")) || {
  history: []
};
let userConfig = JSON.parse(localStorage.getItem("motive_config")) || null;

function ensureUserConfig() {
  if (userConfig) return userConfig;

  const nome = window.prompt("Como voce quer chamar a sua IA?", "Motive") || "Motive";
  const tom = window.prompt(
    "Escolha o tom: casual com humor, direto e firme, acolhedor e calmo, intenso e motivador",
    "acolhedor e calmo"
  ) || "acolhedor e calmo";
  const estilo = window.prompt("Escolha o estilo: curto, completo ou dinamico", "dinamico") || "dinamico";
  const contexto = window.prompt(
    "Contexto principal: estudos, trabalho, projetos pessoais ou geral",
    "geral"
  ) || "geral";

  userConfig = { nome, tom, estilo, contexto };
  localStorage.setItem("motive_config", JSON.stringify(userConfig));
  return userConfig;
}

function addMessage(role, text) {
  const normalizedRole = role === "bot" ? "assistant" : role;
  const wrapper = document.createElement("div");
  wrapper.className = `message ${normalizedRole}`;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      bubble.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 15);
    }
  }

  typeWriter();
}

function saveMemory(userText) {
  memory.history.push({
    user: userText,
    time: Date.now()
  });

  if (memory.history.length > 10) {
    memory.history.shift();
  }

  localStorage.setItem("memory", JSON.stringify(memory));
}

function getFollowUp() {
  const last = memory.history[memory.history.length - 1];
  if (!last) return null;

  const text = last.user.toLowerCase();

  if (text.includes("estudar")) {
    return "Voce conseguiu comecar ou ainda ta enrolando?";
  }

  if (text.includes("cansado")) {
    return "Quer fazer so mais 2 minutos ou prefere parar bem hoje?";
  }

  if (text.includes("dificil")) {
    return "Quer continuar no ritmo ou dar uma pausa rapida?";
  }

  return null;
}

async function getAIResponse(userText) {
  try {
    const userMessage = userText;
    const conversationHistory = memory.history;
    const userConfig = ensureUserConfig();

    const response = await fetch("https://motiv-ai-q470.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage,
        mode: currentMode,
        history: conversationHistory,
        userConfig: userConfig
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return data.reply || "Deu erro ao falar com o servidor. Confere se o backend esta rodando e tenta de novo.";
    }

    return data.reply;
  } catch {
    return "Nao consegui conectar com o servidor. Para a IA responder de verdade, precisamos instalar e rodar o backend.";
  }
}

function setInitialConversation() {
  const config = ensureUserConfig();
  chatMessages.innerHTML = "";
  if (chatTitle) {
    chatTitle.textContent = `Conversando com ${config.nome}`;
  }

  const initialText =
    currentMode === "motivador"
      ? `oi! sou ${config.nome}, sua IA do Motive. voce nao precisa resolver tudo agora. me diz qual e a proxima coisa que voce quer destravar.`
      : `oi! sou ${config.nome}. nesse modo eu vou te ouvir com calma, sem te empurrar. me conta o que ta pegando agora.`;

  addMessage("assistant", initialText);
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userText = userInput.value.trim();
  if (!userText) return;

  addMessage("user", userText);
  userInput.value = "";

  addMessage("bot", "Pensando...");

  saveMemory(userText);

  const reply = await getAIResponse(userText);

  if (chatMessages.lastChild) {
    chatMessages.lastChild.remove();
  }

  addMessage("bot", reply);

  const followUp = getFollowUp();
  if (followUp && currentMode === "motivador") {
    setTimeout(() => {
      addMessage("bot", followUp);
    }, 1500);
  }
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    currentMode = button.dataset.mode;
    setInitialConversation();
  });
});

if (resetButton) {
  resetButton.addEventListener("click", () => {
    memory = { history: [] };
    localStorage.setItem("memory", JSON.stringify(memory));
    setInitialConversation();
  });
}

ensureUserConfig();
setInitialConversation();
