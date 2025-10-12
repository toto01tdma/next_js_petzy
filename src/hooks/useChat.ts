import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const USE_API_MODE = process.env.NEXT_PUBLIC_USE_API_MODE === 'true';

export interface ChatUser {
    id: string;
    name: string;
    role: 'partner' | 'admin';
    avatar?: string;
    online: boolean;
    last_seen?: string;
}

export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender: ChatUser;
    content: string;
    message_type: 'text' | 'image' | 'file';
    attachment_url?: string;
    sent_at: string;
    delivered_at?: string | null;
    read_at?: string | null;
}

export interface Conversation {
    id: string;
    participant: ChatUser;
    last_message: ChatMessage | null;
    unread_count: number;
    status: 'open' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface UseChatOptions {
    autoConnect?: boolean;
    onNewMessage?: (message: ChatMessage) => void;
    onTypingIndicator?: (data: { conversation_id: string; user: ChatUser; is_typing: boolean }) => void;
    onUserStatusChange?: (data: { user_id: string; online: boolean }) => void;
}

export function useChat(options: UseChatOptions = {}) {
    const { autoConnect = true, onNewMessage, onTypingIndicator, onUserStatusChange } = options;
    
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<{ [conversationId: string]: ChatMessage[] }>({});
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState<{ [conversationId: string]: ChatUser[] }>({});
    
    const socketRef = useRef<Socket | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    // Initialize WebSocket connection
    const connect = useCallback(() => {
        if (!USE_API_MODE || socketRef.current?.connected) return;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('[Chat] No access token found');
            return;
        }

        const wsUrl = API_BASE_URL.replace(/^http/, 'ws');
        
        console.log('[Chat] Connecting to WebSocket:', wsUrl);
        
        const socket = io(wsUrl, {
            path: '/api/chats/ws',
            query: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000 * Math.pow(2, reconnectAttempts.current), // Exponential backoff
            reconnectionDelayMax: 10000,
            reconnectionAttempts: maxReconnectAttempts
        });

        socket.on('connect', () => {
            console.log('[Chat] WebSocket connected');
            setIsConnected(true);
            reconnectAttempts.current = 0;
        });

        socket.on('disconnect', () => {
            console.log('[Chat] WebSocket disconnected');
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('[Chat] WebSocket connection error:', error);
            reconnectAttempts.current++;
            
            if (reconnectAttempts.current >= maxReconnectAttempts) {
                console.error('[Chat] Max reconnection attempts reached');
                socket.disconnect();
            }
        });

        // Listen for new messages
        socket.on('message:new', (data: ChatMessage) => {
            console.log('[Chat] New message received:', data);
            setMessages(prev => ({
                ...prev,
                [data.conversation_id]: [...(prev[data.conversation_id] || []), data]
            }));
            
            // Update conversation's last message
            setConversations(prev => prev.map(conv =>
                conv.id === data.conversation_id
                    ? { ...conv, last_message: data, unread_count: conv.unread_count + 1 }
                    : conv
            ));
            
            onNewMessage?.(data);
        });

        // Listen for typing indicators
        socket.on('typing:indicator', (data: { conversation_id: string; user: ChatUser; is_typing: boolean }) => {
            console.log('[Chat] Typing indicator:', data);
            setTypingUsers(prev => {
                const users = prev[data.conversation_id] || [];
                if (data.is_typing) {
                    return {
                        ...prev,
                        [data.conversation_id]: [...users.filter(u => u.id !== data.user.id), data.user]
                    };
                } else {
                    return {
                        ...prev,
                        [data.conversation_id]: users.filter(u => u.id !== data.user.id)
                    };
                }
            });
            
            onTypingIndicator?.(data);
        });

        // Listen for user status changes
        socket.on('user:online', (data: { user_id: string; conversation_id: string; online: true; timestamp: string }) => {
            console.log('[Chat] User online:', data);
            setConversations(prev => prev.map(conv =>
                conv.participant.id === data.user_id
                    ? { ...conv, participant: { ...conv.participant, online: true } }
                    : conv
            ));
            
            onUserStatusChange?.({ user_id: data.user_id, online: true });
        });

        socket.on('user:offline', (data: { user_id: string; conversation_id: string; online: false; last_seen: string }) => {
            console.log('[Chat] User offline:', data);
            setConversations(prev => prev.map(conv =>
                conv.participant.id === data.user_id
                    ? { ...conv, participant: { ...conv.participant, online: false, last_seen: data.last_seen } }
                    : conv
            ));
            
            onUserStatusChange?.({ user_id: data.user_id, online: false });
        });

        // Listen for message delivery acknowledgments
        socket.on('message:delivered:ack', (data: { message_id: string; conversation_id: string; delivered_at: string }) => {
            console.log('[Chat] Message delivered:', data);
            setMessages(prev => ({
                ...prev,
                [data.conversation_id]: prev[data.conversation_id]?.map(msg =>
                    msg.id === data.message_id ? { ...msg, delivered_at: data.delivered_at } : msg
                ) || []
            }));
        });

        socket.on('message:read:ack', (data: { message_id: string; conversation_id: string; read_at: string }) => {
            console.log('[Chat] Message read:', data);
            setMessages(prev => ({
                ...prev,
                [data.conversation_id]: prev[data.conversation_id]?.map(msg =>
                    msg.id === data.message_id ? { ...msg, read_at: data.read_at } : msg
                ) || []
            }));
        });

        socketRef.current = socket;
    }, [onNewMessage, onTypingIndicator, onUserStatusChange]);

    // Disconnect WebSocket
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            console.log('[Chat] Disconnecting WebSocket');
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, []);

    // Fetch conversations list
    const fetchConversations = useCallback(async (status: 'open' | 'archived' = 'open') => {
        if (!USE_API_MODE) {
            // Mock data for preview mode
            const mockConversations: Conversation[] = [
                {
                    id: 'conv-1',
                    participant: {
                        id: 'user-1',
                        name: 'Andreana Viola',
                        role: 'partner',
                        online: true
                    },
                    last_message: {
                        id: 'msg-1',
                        conversation_id: 'conv-1',
                        sender: {
                            id: 'user-1',
                            name: 'Andreana Viola',
                            role: 'partner',
                            online: true
                        },
                        content: 'Hi, How are you today?',
                        message_type: 'text',
                        sent_at: new Date().toISOString(),
                        read_at: null,
                        delivered_at: new Date().toISOString()
                    },
                    unread_count: 2,
                    status: 'open',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ];
            setConversations(mockConversations);
            return mockConversations;
        }

        setIsLoading(true);
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${API_BASE_URL}/api/chats/conversations?status=${status}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                setConversations(result.data.conversations);
                return result.data.conversations;
            } else {
                console.error('[Chat] Failed to fetch conversations:', result);
                return [];
            }
        } catch (error) {
            console.error('[Chat] Error fetching conversations:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch messages for a conversation
    const fetchMessages = useCallback(async (conversationId: string) => {
        if (!USE_API_MODE) {
            // Mock data for preview mode
            const mockMessages: ChatMessage[] = [
                {
                    id: 'msg-1',
                    conversation_id: conversationId,
                    sender: {
                        id: 'user-1',
                        name: 'Alexandra Michu',
                        role: 'partner',
                        online: true
                    },
                    content: 'แจ้งขอยกเลิกห้องพัก',
                    message_type: 'text',
                    sent_at: new Date(Date.now() - 60000).toISOString(),
                    read_at: new Date().toISOString(),
                    delivered_at: new Date().toISOString()
                },
                {
                    id: 'msg-2',
                    conversation_id: conversationId,
                    sender: {
                        id: 'admin-1',
                        name: 'Petzy Support',
                        role: 'admin',
                        online: true
                    },
                    content: 'สวัสดีค่ะ กรุณายกเลิกโรงแรมของคุณ',
                    message_type: 'text',
                    sent_at: new Date().toISOString(),
                    read_at: null,
                    delivered_at: new Date().toISOString()
                }
            ];
            setMessages(prev => ({ ...prev, [conversationId]: mockMessages }));
            return mockMessages;
        }

        setIsLoading(true);
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${API_BASE_URL}/api/chats/conversations/${conversationId}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                setMessages(prev => ({ ...prev, [conversationId]: result.data.messages }));
                return result.data.messages;
            } else {
                console.error('[Chat] Failed to fetch messages:', result);
                return [];
            }
        } catch (error) {
            console.error('[Chat] Error fetching messages:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Send a message
    const sendMessage = useCallback(async (conversationId: string, recipientId: string, content: string) => {
        if (!USE_API_MODE) {
            // Mock sending message in preview mode
            const mockMessage: ChatMessage = {
                id: `msg-${Date.now()}`,
                conversation_id: conversationId,
                sender: {
                    id: 'current-user',
                    name: 'You',
                    role: 'admin',
                    online: true
                },
                content,
                message_type: 'text',
                sent_at: new Date().toISOString(),
                read_at: null,
                delivered_at: null
            };
            setMessages(prev => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), mockMessage]
            }));
            return mockMessage;
        }

        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${API_BASE_URL}/api/chats/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conversation_id: conversationId,
                    recipient_id: recipientId,
                    content,
                    message_type: 'text'
                })
            });

            const result = await response.json();

            if (result.success) {
                const newMessage = result.data;
                setMessages(prev => ({
                    ...prev,
                    [conversationId]: [...(prev[conversationId] || []), newMessage]
                }));
                return newMessage;
            } else {
                console.error('[Chat] Failed to send message:', result);
                return null;
            }
        } catch (error) {
            console.error('[Chat] Error sending message:', error);
            return null;
        }
    }, []);

    // Send typing indicator
    const sendTypingIndicator = useCallback((conversationId: string, isTyping: boolean) => {
        if (!socketRef.current?.connected) return;

        socketRef.current.emit(isTyping ? 'typing:start' : 'typing:stop', {
            conversation_id: conversationId,
            user_id: 'current-user-id' // Should get from auth context
        });
    }, []);

    // Mark conversation as read
    const markAsRead = useCallback(async (conversationId: string) => {
        if (!USE_API_MODE) return;

        const token = localStorage.getItem('accessToken');

        try {
            await fetch(`${API_BASE_URL}/api/chats/conversations/${conversationId}/mark-read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setConversations(prev => prev.map(conv =>
                conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
            ));
        } catch (error) {
            console.error('[Chat] Error marking as read:', error);
        }
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    return {
        conversations,
        messages,
        isConnected,
        isLoading,
        typingUsers,
        connect,
        disconnect,
        fetchConversations,
        fetchMessages,
        sendMessage,
        sendTypingIndicator,
        markAsRead
    };
}

