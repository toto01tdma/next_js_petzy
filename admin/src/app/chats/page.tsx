'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Avatar, Input, Tabs, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useChat } from '@/hooks/useChat';
import { getProfileImageUrl } from '@/utils/profileImageUrl';

const { TextArea } = Input;

export default function AdminChats() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [conversationStatus, setConversationStatus] = useState<'open' | 'archived'>('open');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Get current user info
    const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: string } | null>(null);
    
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setCurrentUser({
                id: user.id,
                name: user.name || user.email,
                role: 'admin'
            });
        }
    }, []);
    
    // Initialize chat hook
    const {
        conversations,
        messages,
        isConnected,
        isLoading,
        typingUsers,
        fetchConversations,
        fetchMessages,
        sendMessage,
        sendTypingIndicator,
        markAsRead,
    } = useChat({
        autoConnect: true,
        onNewMessage: (message) => {
            console.log('New message received:', message);
            scrollToBottom();
        },
    });
    
    // Load conversations on mount
    useEffect(() => {
        fetchConversations(conversationStatus);
    }, [conversationStatus, fetchConversations]);
    
    // Get current conversation messages (wrapped in useMemo to prevent re-creation on every render)
    const currentMessages = useMemo(() => {
        return selectedConversationId ? messages[selectedConversationId] || [] : [];
    }, [selectedConversationId, messages]);
    
    const currentTypingUsers = selectedConversationId ? typingUsers[selectedConversationId] || [] : [];
    
    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [currentMessages]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const handleConversationClick = async (conversationId: string) => {
        setSelectedConversationId(conversationId);
        await fetchMessages(conversationId);
        await markAsRead(conversationId);
        
        // Join conversation room for WebSocket
        // Note: Socket connection is managed by useChat hook
        // If direct socket access is needed, it should be exposed from the hook
    };
    
    const handleInputChange = (value: string) => {
        setInputValue(value);
        
        // Send typing indicator
        if (selectedConversationId && currentUser) {
            sendTypingIndicator(selectedConversationId, true);
            
            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            
            // Stop typing after 3 seconds of inactivity
            typingTimeoutRef.current = setTimeout(() => {
                sendTypingIndicator(selectedConversationId, false);
            }, 3000);
        }
    };
    
    const handleSendMessage = async () => {
        if (!inputValue.trim() || isSending || !selectedConversationId) return;
        
        const selectedConv = conversations.find(c => c.id === selectedConversationId);
        if (!selectedConv) return;
        
        // Stop typing indicator
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        sendTypingIndicator(selectedConversationId, false);
        
        // Send message
        setIsSending(true);
        const recipientId = selectedConv.participant.id;
        await sendMessage(selectedConversationId, recipientId, inputValue);
        setInputValue('');
        setIsSending(false);
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short'
        });
    };
    
    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    const getAvatarUrl = (avatarPath?: string) => {
        if (!avatarPath) return '/assets/default-avatar.png';
        // Use the profile image API endpoint for secure access
        return getProfileImageUrl(avatarPath) || '/assets/default-avatar.png';
    };
    
    // Get selected conversation details
    const selectedConversation = conversations.find(c => c.id === selectedConversationId);
    const participant = selectedConversation?.participant;

    const tabItems = [
        {
            key: 'open',
            label: 'Open'
        },
        {
            key: 'archived',
            label: 'Archived'
        }
    ];

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
            <Sidebar />
            
            <div className="flex-1" style={{ marginLeft: '250px' }}>
                {/* Header */}
                <div className="p-6" style={{ 
                    background: 'linear-gradient(to right, #C6CEDE, #FFFFFF)',
                    borderBottom: '1px solid #E0E0E0'
                }}>
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                            หน้าแชท
                        </h1>
                        <div className="flex items-center gap-2">
                            {isConnected ? (
                                <span className="text-sm text-green-600">● Connected</span>
                            ) : (
                                <span className="text-sm text-red-600">● Disconnected</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="flex" style={{ height: 'calc(100vh - 100px)' }}>
                    {/* Left Sidebar - Chat List */}
                    <div style={{ 
                        width: '400px', 
                        borderRight: '1px solid #E0E0E0',
                        backgroundColor: '#FFFFFF'
                    }}>
                        {/* Chat Header */}
                <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>
                                Chat
                            </h2>
                            
                            {/* Tabs */}
                            <Tabs
                                activeKey={conversationStatus}
                                onChange={(key) => setConversationStatus(key as 'open' | 'archived')}
                                items={tabItems}
                                style={{ marginBottom: 0 }}
                            />
                        </div>

                        {/* Chat List */}
                        <div style={{ overflowY: 'auto', height: 'calc(100% - 140px)' }}>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Spin size="large" />
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className="flex items-center justify-center h-full" style={{ color: '#999999' }}>
                                    <p>ไม่มีการสนทนา</p>
                                </div>
                            ) : (
                                conversations.map((conv) => {
                                    const convParticipant = conv.participant;
                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => handleConversationClick(conv.id)}
                                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                            style={{
                                                backgroundColor: selectedConversationId === conv.id ? '#F5F5F5' : 'transparent',
                                                borderBottom: '1px solid #F0F0F0'
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar
                                                        size={48}
                                                        src={getAvatarUrl(convParticipant?.avatar)}
                                                        style={{ backgroundColor: '#FDB930' }}
                                                    >
                                                        {convParticipant?.name?.charAt(0) || 'U'}
                                                    </Avatar>
                                                    {convParticipant?.online && (
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: 2,
                                                                right: 2,
                                                                width: 12,
                                                                height: 12,
                                                                backgroundColor: '#52C41A',
                                                                border: '2px solid white',
                                                                borderRadius: '50%'
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-semibold" style={{ color: '#000000' }}>
                                                            {convParticipant?.name || 'Unknown'}
                                                        </h3>
                                                        <span className="text-xs" style={{ color: '#999999' }}>
                                                            {conv.last_message ? formatTime(conv.last_message.sent_at) : ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-sm truncate" style={{ color: '#666666' }}>
                                                            {conv.last_message?.content || 'No messages yet'}
                                                        </p>
                                                        {conv.unread_count > 0 && (
                                                            <div
                                                                style={{
                                                                    minWidth: 20,
                                                                    height: 20,
                                                                    backgroundColor: '#FF4D4F',
                                                                    color: '#FFFFFF',
                                                                    borderRadius: '10px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '12px',
                                                                    fontWeight: 'bold',
                                                                    padding: '0 6px'
                                                                }}
                                                            >
                                                                {conv.unread_count}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Side - Chat Conversation */}
                    <div className="flex-1 flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
                        {selectedConversationId && participant ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b" style={{ borderColor: '#E0E0E0' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar
                                                size={40}
                                                src={getAvatarUrl(participant.avatar)}
                                                style={{ backgroundColor: '#FDB930' }}
                                            >
                                                {participant.name?.charAt(0) || 'U'}
                                            </Avatar>
                                            {participant.online && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        right: 0,
                                                        width: 10,
                                                        height: 10,
                                                        backgroundColor: '#52C41A',
                                                        border: '2px solid white',
                                                        borderRadius: '50%'
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold" style={{ color: '#000000' }}>
                                                {participant.name}
                                            </h3>
                                            <p className="text-sm" style={{ color: participant.online ? '#52C41A' : '#999999' }}>
                                                {participant.online ? 'Online' : participant.last_seen ? `Last seen ${formatTime(participant.last_seen)}` : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 p-6 overflow-y-auto" style={{ backgroundColor: '#FAFAFA' }}>
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <Spin size="large" />
                                        </div>
                                    ) : currentMessages.length === 0 ? (
                                        <div className="flex items-center justify-center h-full" style={{ color: '#999999' }}>
                                            <p>ไม่มีข้อความ เริ่มสนทนาใหม่ได้เลย!</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Today Divider */}
                                            {currentMessages.length > 0 && (
                                                <div className="text-center mb-4">
                                                    <span className="text-sm" style={{ color: '#999999' }}>
                                                        {new Date(currentMessages[0]?.sent_at).toLocaleDateString('th-TH', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Messages */}
                                            {currentMessages.map((msg) => {
                                                const isMine = msg.sender.id === currentUser?.id;
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`mb-4 flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        {!isMine && (
                                                            <div className="flex gap-2 items-start max-w-[60%]">
                                                                <Avatar
                                                                    size={32}
                                                                    src={getAvatarUrl(msg.sender.avatar)}
                                                                    style={{ backgroundColor: '#FDB930', flexShrink: 0 }}
                                                                >
                                                                    {msg.sender.name?.charAt(0) || 'U'}
                                                                </Avatar>
                                                                <div>
                                                                    <div
                                                                        className="p-3 rounded-lg"
                                                                        style={{
                                                                            backgroundColor: '#F0F0F0',
                                                                            color: '#000000'
                                                                        }}
                                                                    >
                                                                        {msg.content}
                                                                    </div>
                                                                    <div className="text-xs mt-1" style={{ color: '#999999' }}>
                                                                        {formatMessageTime(msg.sent_at)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {isMine && (
                                                            <div className="flex gap-2 items-start max-w-[60%]">
                                                                <div>
                                                                    <div
                                                                        className="p-3 rounded-lg"
                                                                        style={{
                                                                            backgroundColor: '#1890FF',
                                                                            color: '#FFFFFF'
                                                                        }}
                                                                    >
                                                                        {msg.content}
                                                                    </div>
                                                                    <div className="text-xs mt-1 text-right flex items-center justify-end gap-1" style={{ color: '#999999' }}>
                                                                        <span>{formatMessageTime(msg.sent_at)}</span>
                                                                        <span className="text-blue-500">
                                                                            {msg.read_at ? '✓✓' : msg.delivered_at ? '✓' : '○'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="flex items-center justify-center"
                                                                    style={{
                                                                        width: 32,
                                                                        height: 32,
                                                                        backgroundColor: '#FDB930',
                                                                        borderRadius: '50%',
                                                                        flexShrink: 0
                                                                    }}
                                                                >
                                                                    <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '12px' }}>
                                                                        P
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {/* Typing Indicator */}
                                            {currentTypingUsers.length > 0 && (
                                                <div className="flex gap-2 items-start max-w-[60%]">
                                                    <Avatar
                                                        size={32}
                                                        src={getAvatarUrl(currentTypingUsers[0]?.avatar)}
                                                        style={{ backgroundColor: '#FDB930' }}
                                                    >
                                                        {currentTypingUsers[0]?.name?.charAt(0) || 'U'}
                                                    </Avatar>
                                                    <div>
                                                        <div
                                                            className="p-3 rounded-lg"
                                                            style={{
                                                                backgroundColor: '#F0F0F0',
                                                                width: '60px',
                                                                display: 'flex',
                                                                gap: '4px',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: '6px',
                                                                    height: '6px',
                                                                    backgroundColor: '#1890FF',
                                                                    borderRadius: '50%',
                                                                    animation: 'bounce 1.4s infinite ease-in-out'
                                                                }}
                                                            />
                                                            <div
                                                                style={{
                                                                    width: '6px',
                                                                    height: '6px',
                                                                    backgroundColor: '#1890FF',
                                                                    borderRadius: '50%',
                                                                    animation: 'bounce 1.4s infinite ease-in-out 0.2s'
                                                                }}
                                                            />
                                                            <div
                                                                style={{
                                                                    width: '6px',
                                                                    height: '6px',
                                                                    backgroundColor: '#1890FF',
                                                                    borderRadius: '50%',
                                                                    animation: 'bounce 1.4s infinite ease-in-out 0.4s'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t" style={{ borderColor: '#E0E0E0' }}>
                                    <div className="flex items-center gap-2">
                                        <TextArea
                                            value={inputValue}
                                            onChange={(e) => handleInputChange(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Write your message..."
                                            autoSize={{ minRows: 1, maxRows: 3 }}
                                            style={{
                                                flex: 1,
                                                borderRadius: '20px',
                                                padding: '8px 16px'
                                            }}
                                            disabled={isSending}
                                        />
                                        <div
                                            onClick={handleSendMessage}
                                            className="cursor-pointer"
                                            style={{
                                                width: 36,
                                                height: 36,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                backgroundColor: (!inputValue.trim() || isSending) ? '#F5F5F5' : '#1890FF',
                                                pointerEvents: (!inputValue.trim() || isSending) ? 'none' : 'auto'
                                            }}
                                        >
                                            {isSending ? (
                                                <Spin size="small" />
                                            ) : (
                                                <SendOutlined style={{ 
                                                    fontSize: 18, 
                                                    color: (!inputValue.trim()) ? '#999999' : '#FFFFFF' 
                                                }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center" style={{ color: '#999999' }}>
                                Select a conversation to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS for typing animation */}
            <style jsx global>{`
                @keyframes bounce {
                    0%, 60%, 100% {
                        transform: translateY(0);
                    }
                    30% {
                        transform: translateY(-8px);
                    }
                }
            `}</style>
        </div>
    );
}
