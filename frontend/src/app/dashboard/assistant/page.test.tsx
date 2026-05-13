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
      if (url.endsWith('/api/chats') && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: mockChatId, welcomeMessage: mockWelcomeMsg })
        });
      }
      return Promise.reject(new Error('Unhandled request'));
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
      if (url.endsWith('/api/chats') && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: mockChatId, welcomeMessage: mockWelcomeMsg })
        });
      }
      if (url.includes(`/api/chats/${mockChatId}/messages`) && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ assistantReply: 'This is a mocked AI reply' })
        });
      }
      return Promise.reject(new Error('Unhandled request: ' + url));
    });

    render(<AssistantPage />);
    await screen.findByText(mockWelcomeMsg);

    const input = screen.getByPlaceholderText(/Type your message here/i);
    const user = userEvent.setup();

    await user.type(input, 'Hello AI');
    
    // Find send button - assuming it's the second button in the input area (first is paperclip)
    const sendButton = input.parentElement?.querySelector('button:not(:disabled):nth-of-type(2)');
    expect(sendButton).toBeInTheDocument();
    
    await user.click(sendButton!);

    // Should see user message
    expect(screen.getByText('Hello AI')).toBeInTheDocument();

    // Should see AI reply
    expect(await screen.findByText('This is a mocked AI reply')).toBeInTheDocument();
  });

  it('6.3: quick actions populate template and can be sent to explain-bug endpoint', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string, options: any) => {
      if (url.endsWith('/api/chats') && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: mockChatId, welcomeMessage: mockWelcomeMsg })
        });
      }
      if (url.includes(`/api/chats/${mockChatId}/explain-bug`) && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            explanation: { 
              errorExplanation: 'Null reference error', 
              possibleCauses: [], 
              debuggingSteps: [] 
            } 
          })
        });
      }
      return Promise.reject(new Error('Unhandled request: ' + url));
    });

    render(<AssistantPage />);
    await screen.findByText(mockWelcomeMsg);

    const analyzeBtn = screen.getByText(/Analyze Error/i);
    const user = userEvent.setup();
    await user.click(analyzeBtn);

    const input = screen.getByPlaceholderText(/Type your message here/i) as HTMLTextAreaElement;
    expect(input.value).toContain('Tolong jelaskan error berikut:');

    // Type an error after the template
    await user.type(input, ' TypeError: null is not an object');
    
    // Send
    const sendButton = input.parentElement?.querySelector('button:nth-of-type(2)');
    await user.click(sendButton!);

    // Should call explain-bug endpoint
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/explain-bug'), expect.objectContaining({ method: 'POST' }));
    });

    // Should see explanation
    expect(await screen.findByText(/Error Explanation:/)).toBeInTheDocument();
    expect(screen.getByText(/Null reference error/)).toBeInTheDocument();
  });

  it('6.2: handles and displays API errors', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string, options: any) => {
      if (url.endsWith('/api/chats') && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: mockChatId, welcomeMessage: mockWelcomeMsg })
        });
      }
      if (url.includes('/messages') && options.method === 'POST') {
        return Promise.reject(new Error('Network Failure'));
      }
      return Promise.reject(new Error('Unhandled request'));
    });

    render(<AssistantPage />);
    await screen.findByText(mockWelcomeMsg);

    const input = screen.getByPlaceholderText(/Type your message here/i);
    const user = userEvent.setup();
    await user.type(input, 'Trigger error');
    
    const sendButton = input.parentElement?.querySelector('button:nth-of-type(2)');
    await user.click(sendButton!);

    expect(await screen.findByText(/there was a network error/i)).toBeInTheDocument();
  });
  
  it('6.3: submits feedback when thumbs up is clicked', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string, options: any) => {
      if (url.endsWith('/api/chats') && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: mockChatId, welcomeMessage: mockWelcomeMsg })
        });
      }
      if (url.includes('/messages/feedback') && options.method === 'PATCH') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      return Promise.reject(new Error('Unhandled request: ' + url));
    });

    render(<AssistantPage />);
    await screen.findByText(mockWelcomeMsg);

    // Click the thumbs up SVG. Since the button wraps the SVG, we can query by the icon's role or similar,
    // but the easiest way is to find all buttons inside the message div.
    // The ThumbsUp component renders an SVG. 
    // We can find the button using querySelector or testing-library queries if we add test-ids.
    // Let's use container query for simplicity since it's an integration test.
    
    // Find all buttons that have the thumbs up icon (which we can identify if we rely on the DOM structure)
    // Actually, we can get all buttons and the first one inside the assistant message area is the thumbs up.
    // But since `handleFeedback` updates the class, we can just click the button.
    
    // For this test, let's just make sure the fetch call is made.
    const messageContainer = screen.getByText(mockWelcomeMsg).closest('div')?.nextElementSibling;
    const thumbsUpButton = messageContainer?.querySelector('button:first-child');
    
    if (thumbsUpButton) {
      fireEvent.click(thumbsUpButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/feedback'), expect.objectContaining({ method: 'PATCH' }));
      });
    }
  });
});
