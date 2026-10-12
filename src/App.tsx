import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Moon, Plus, Search, Send, SunMedium, Trash2 } from 'lucide-react';
import { generateAssistantReply } from './lib/aiEngine';
import { createConversation, readConversations, saveConversations, setTheme, getTheme, addMessage } from './lib/storage';
import type { Conversation, ModelMode } from './types';

const initialConversation = createConversation();

function App() {
  const [conversations, setConversations] = useState<Conversation[]>(() => readConversations());
  const [activeId, setActiveId] = useState<string>(conversations[0]?.id ?? initialConversation.id);
  const [input, setInput] = useState('');
  const [model, setModel] = useState<ModelMode>('auto');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? initialConversation,
    [conversations, activeId],
  );

  useEffect(() => {
    const current = readConversations();
    if (current.length === 0) {
      const initial = [initialConversation];
      setConversations(initial);
      setActiveId(initial[0].id);
      saveConversations(initial);
    }
  }, []);

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    document.documentElement.dataset.theme = getTheme();
  }, []);

  const updateConversation = (updated: Conversation) => {
    setConversations((current) => {
      const next = current.some((item) => item.id === updated.id)
        ? current.map((item) => (item.id === updated.id ? updated : item))
        : [updated, ...current];
      return next;
    });
  };

  const createNewChat = () => {
    const next = createConversation();
    setConversations((current) => [next, ...current]);
    setActiveId(next.id);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: crypto.randomUUID(), role: 'user' as const, content: input.trim() };
    const draft = addMessage(activeConversation, userMessage);
    updateConversation(draft);
    setInput('');
    setLoading(true);

    window.setTimeout(() => {
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: generateAssistantReply(userMessage.content, model),
      };
      const nextConversation = addMessage(draft, assistantMessage);
      updateConversation(nextConversation);
      setLoading(false);
    }, 300);
  };

  const getCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback is intentionally silent in this environment
    }
  };

  const clearCurrentChat = () => {
    const next = { ...activeConversation, messages: [] };
    updateConversation(next);
  };

  const toggleTheme = () => {
    const nextTheme = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>FuturePowerAIPlus</h1>
          </div>
          <button className="icon-button" onClick={() => setSidebarOpen((value) => !value)} aria-label="Toggle sidebar">
            <Search size={16} />
          </button>
        </div>

        <button className="primary-button" onClick={createNewChat}>
          <Plus size={16} />
          New chat
        </button>

        <div className="conversation-list">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`conversation-item ${conversation.id === activeId ? 'active' : ''}`}
              onClick={() => setActiveId(conversation.id)}
            >
              <span>{conversation.title}</span>
              <small>{conversation.messages.length} msgs</small>
            </button>
          ))}
        </div>
      </aside>

      <main className="chat-layout">
        <header className="topbar">
          <div>
            <p className="eyebrow">Status</p>
            <strong>{model.toUpperCase()} MODE</strong>
          </div>
          <div className="toolbar-actions">
            <select value={model} onChange={(event) => setModel(event.target.value as ModelMode)} aria-label="Choose model mode">
              <option value="auto">Auto</option>
              <option value="fast">Fast</option>
              <option value="reasoning">Reasoning</option>
              <option value="calculator">Calculator</option>
            </select>
            <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
              {getTheme() === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
            </button>
            <button className="icon-button danger" onClick={clearCurrentChat} aria-label="Clear current chat">
              <Trash2 size={16} />
            </button>
          </div>
        </header>

        <section className="messages-panel" aria-live="polite">
          {activeConversation.messages.length === 0 ? (
            <div className="empty-state">
              <h2>Ask anything</h2>
              <p>Try a math expression, a scientific concept, or a coding question.</p>
              <ul>
                <li>2 + 3</li>
                <li>2x + 7 = 19</li>
                <li>Explain gravity</li>
              </ul>
            </div>
          ) : (
            activeConversation.messages.map((message) => (
              <article key={message.id} className={`message ${message.role}`}>
                <div className="message-header">
                  <span>{message.role === 'user' ? 'You' : 'Assistant'}</span>
                  {message.role === 'assistant' && (
                    <button className="copy-button" onClick={() => getCopyText(message.content)} aria-label="Copy response">
                      <Copy size={14} />
                    </button>
                  )}
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </article>
            ))
          )}

          {loading && (
            <div className="typing-indicator" aria-label="Assistant is thinking">
              <span />
              <span />
              <span />
            </div>
          )}
        </section>

        <footer className="composer">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about math, study, coding, or general knowledge..."
            aria-label="Message input"
          />
          <button className="primary-button send-button" onClick={handleSend} disabled={loading}>
            <Send size={16} />
            Send
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;
