const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const resetButton = document.getElementById("reset-chat");
const modeButtons = document.querySelectorAll(".mode-button");

let currentMode = "motivador";
let memory = JSON.parse(localStorage.getItem("memory")) || {
  history: []
};

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
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userText,
        mode: currentMode,
        history: memory.history
      })
    });

    if (!response.ok) {
      return "Deu erro ao falar com o servidor. Confere se o backend esta rodando e tenta de novo.";
    }

    const data = await response.json();
    return data.reply || "Deu um erro aqui... tenta de novo.";
  } catch {
    return "Nao consegui conectar com o servidor. Para a IA responder de verdade, precisamos instalar e rodar o backend.";
  }
}

function setInitialConversation() {
  chatMessages.innerHTML = "";

  const initialText =
    currentMode === "motivador"
      ? "Voce nao precisa fazer tudo agora. Me diz qual e a proxima coisa que voce quer destravar."
      : "To aqui com voce. Me conta o que ta pegando agora.";

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

setInitialConversation();
