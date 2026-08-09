/* messages.js — Messages page logic (uses common.js for shared data) */

let conversations = [];
let activeConversationId = null;

function renderConversationList() {
    const list = document.getElementById("conversationList");
    if (!list) return;

    if (conversations.length === 0) {
        list.innerHTML = `<div class="conversation-empty">No conversations yet</div>`;
        return;
    }

    list.innerHTML = conversations.map(c => {
        const lastMsg = c.messages[c.messages.length - 1];
        const preview = lastMsg ? (lastMsg.sender === "me" ? "You: " : "") + lastMsg.text : "";
        const isActive = c.id === activeConversationId;
        return `
      <button class="conversation-item ${isActive ? "active" : ""}" data-id="${c.id}">
        <div class="conversation-avatar">${escapeHtml(getConversationInitial(c))}</div>
        <div class="conversation-meta">
          <div class="conversation-top-row">
            <span class="conversation-name">${escapeHtml(c.withName)}</span>
            <span class="conversation-time">${lastMsg ? escapeHtml(lastMsg.time) : ""}</span>
          </div>
          <div class="conversation-product"><i class="fas fa-tag"></i> ${escapeHtml(c.productName)}</div>
          <div class="conversation-preview">${escapeHtml(preview)}</div>
        </div>
      </button>
    `;
    }).join("");

    list.querySelectorAll(".conversation-item").forEach(item => {
        item.addEventListener("click", () => {
            openConversation(parseInt(item.getAttribute("data-id"), 10));
        });
    });
}

function renderChatThread() {
    const conversation = conversations.find(c => c.id === activeConversationId);
    const emptyState = document.getElementById("chatEmptyState");
    const thread = document.getElementById("chatThread");

    if (!conversation) {
        emptyState.style.display = "flex";
        thread.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    thread.style.display = "flex";

    document.getElementById("chatHeaderAvatar").innerText = getConversationInitial(conversation);
    document.getElementById("chatHeaderName").innerText = conversation.withName;
    document.getElementById("chatHeaderContext").innerText = `Re: ${conversation.productName}`;

    const messagesEl = document.getElementById("chatMessages");
    messagesEl.innerHTML = conversation.messages.map(m => `
      <div class="chat-bubble-row ${m.sender === "me" ? "from-me" : "from-them"}">
        <div class="chat-bubble">
          <div class="chat-bubble-text">${escapeHtml(m.text)}</div>
          <div class="chat-bubble-time">${escapeHtml(m.time)}</div>
        </div>
      </div>
    `).join("");
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function openConversation(id) {
    activeConversationId = id;
    renderConversationList();
    renderChatThread();
}

function initChatInput() {
    const form = document.getElementById("chatInputForm");
    const input = document.getElementById("chatInput");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text || activeConversationId === null) return;

        conversations = appendMessage(conversations, activeConversationId, text, "me");
        input.value = "";
        renderConversationList();
        renderChatThread();
    });
}

function init() {
    conversations = loadConversations();
    initUserGreeting();
    initLogout();
    renderConversationList();
    initChatInput();

    if (conversations.length > 0) {
        openConversation(conversations[0].id);
    }
}

document.addEventListener("DOMContentLoaded", init);