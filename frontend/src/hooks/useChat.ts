import { useState, useCallback } from 'react';
import { useConversationStore } from '@/store/conversationStore';
import { chatService } from '@/services/chat.service';
import { Message } from '@/types/conversation';

export const useChat = () => {
  const { activeConversation, createConversation } = useConversationStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    let currentConversation = activeConversation;
    setIsLoading(true);
    setError(null);

    try {
      // 1. If no active conversation, create one first
      if (!currentConversation) {
        currentConversation = await createConversation(content.slice(0, 30) + (content.length > 30 ? '...' : ''));
      }

      const conversationId = currentConversation.id;

      // 2. Add user message locally
      const userMessage: Message = {
        id: Date.now().toString(),
        conversationId,
        role: 'USER',
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      // 3. Add temporary assistant message for streaming
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        conversationId,
        role: 'ASSISTANT',
        content: '',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      setIsStreaming(true);
      let fullContent = '';

      // 4. Start streaming
      await chatService.stream(conversationId, content, (chunk) => {
        fullContent += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId ? { ...msg, content: fullContent } : msg
          )
        );
      });

    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [activeConversation, createConversation]);

  return {
    messages,
    setMessages,
    sendMessage,
    isLoading,
    isStreaming,
    error,
    activeConversation
  };
};
