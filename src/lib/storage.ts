import type { Conversation, ChatMessage } from '../types';

const STORAGE_KEY = 'futurepoweraiplus.conversations';
const THEME_KEY = 'futurepoweraiplus.theme';

export function readConversations(): Conversation[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function createConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: 'New chat',
    messages: [],
  };
}

export function addMessage(conversation: Conversation, message: ChatMessage): Conversation {
  return {
    ...conversation,
    messages: [...conversation.messages, message],
    title: conversation.title === 'New chat' && message.role === 'user' ? message.content.slice(0, 24) : conversation.title,
  };
}

export function getTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

export function setTheme(theme: 'light' | 'dark') {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.dataset.theme = theme;
}
