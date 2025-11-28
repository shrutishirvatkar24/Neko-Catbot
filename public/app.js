const form = document.getElementById("form");
const input = document.getElementById("input");
const chat = document.getElementById("chat");

function appendMessage(text, cls) {
  const el = document.createElement("div");
  el.className = `message ${cls}`;
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  appendMessage(message, "user");
  input.value = "";

  const loadingEl = document.createElement("div");
  loadingEl.className = "message bot";
  loadingEl.textContent = "Neko is thinking...";
  chat.appendChild(loadingEl);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    loadingEl.remove();

    if (!res.ok) {
      appendMessage("Error: " + (data?.error || "Unknown error"), "bot");
      return;
    }

    appendMessage(data.text || "(no response)", "bot");
  } catch (err) {
    loadingEl.remove();
    appendMessage("Network error: " + err.message, "bot");
  }
});
