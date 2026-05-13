import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssistantPage from './page';

// Mock scrollTo
window.HTMLElement.prototype.scrollTo = jest.fn();

describe('AssistantPage Integration Tests', () => {
  const mockChatId = 'test-chat-123';
  const mockWelcomeMsg = 'Test welcome message';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default fetch mock behavior
    (global.fetch as jest.Mock).mockImplementation((url: string, options: any) => {
      if (url.includes('/api/chats') && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: { id: mockChatId, welcomeMessage: mockWelcomeMsg } })
        });
      }
      if (url.includes('/api/chats') && options.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] })
        });
      }
      return Promise.reject(new Error('Unhandled request: ' + url));
    });
  });

  it('6.2: initializes chat and displays welcome message on mount', async () => {
    render(<AssistantPage />);

    // Should call API to init chat
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/chats'), expect.objectContaining({ method: 'POST' }));
    });

    // Should display the welcome message returned from backend
    expect(await screen.findByText(mockWelcomeMsg)).toBeInTheDocument();
  });

  it('6.3: user can send a standard message and receive a reply', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string, options: any) => {
      if (url.includes('/api/chats') && options.method === 'POST' && !url.includes('/messages')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: { id: mockChatId, welcomeMessage: mockWelcomeMsg } })
        });
      }
      if (url.includes(`/api/chats/${mockChatId}/messages`) && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: { assistantReply: 'This is a mocked AI reply' } })
        });
      }
      if (url.includes('/api/chats') && options.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] })
        });
      }
      return Promise.reject(new Error('Unhandled request: ' + url));
    });

    render(<AssistantPage />);
    await screen.findByText(mockWelcomeMsg);

    const input = screen.getByPlaceholderText(/Type your message here/i);
    const user = userEvent.setup();

    await user.type(input, 'Hello AI');
    
    const sendButton = screen.getByRole('button', { name: /send/i }) || input.parentElement?.querySelector('button:last-child');
    if (sendButton) await user.click(sendButton);

    // Should see user message
    expect(screen.getByText('Hello AI')).toBeInTheDocument();

    // Should see AI reply
    expect(await screen.findByText('This is a mocked AI reply')).toBeInTheDocument();
  });
});
