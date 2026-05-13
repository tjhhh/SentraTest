import { create } from "zustand";
import { Conversation, ConversationState } from "../types/conversation";
import { conversationService } from "../services/conversation.service";

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const conversations = await conversationService.list();
      set({ conversations, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setActiveConversation: (conversation: Conversation | null) => {
    set({ activeConversation: conversation });
  },

  createConversation: async (title: string) => {
    set({ isLoading: true, error: null });
    try {
      const newConversation = await conversationService.create(title);
      set((state) => ({
        conversations: [newConversation, ...state.conversations],
        activeConversation: newConversation,
        isLoading: false,
      }));
      return newConversation;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  renameConversation: async (id: string, title: string) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await conversationService.rename(id, title);
      set((state) => ({
        conversations: state.conversations.map((c) => 
          c.id === id ? { ...c, title: updated.title } : c
        ),
        activeConversation: state.activeConversation?.id === id 
          ? { ...state.activeConversation, title: updated.title } 
          : state.activeConversation,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteConversation: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await conversationService.delete(id);
      set((state) => {
        const nextConversations = state.conversations.filter((c) => c.id !== id);
        return {
          conversations: nextConversations,
          activeConversation: state.activeConversation?.id === id ? null : state.activeConversation,
          isLoading: false,
        };
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
