// --- src/appchat.js ---
const STORAGE_KEY = 'agrichain_chat_history'

export function getChatHistory() {
    const history = localStorage.getItem(STORAGE_KEY)
    return history ? JSON.parse(history) : []
}

export function saveChatHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function renderChatUI(history) {
    const chatBox = document.getElementById('chatBox')
    if (!chatBox) return
    chatBox.innerHTML = ''
    history.forEach(chat => {
        chatBox.innerHTML += `
        <div class="chat-bubble user">${chat.question}</div>
        <div class="chat-bubble ai">${chat.answer}</div>
        `
    })
}

export function handleChat(question) {
    let history = getChatHistory()
    const answer = AI: Saya masih belajar tentang "${question}"
    history.unshift({ question, answer })
    if (history.length > 10) history.pop()
    saveChatHistory(history)
    renderChatUI(history)
}
