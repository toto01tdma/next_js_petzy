'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, SendOutlined } from '@ant-design/icons';
import { Input, Avatar, Badge, Spin } from 'antd';
import { useApprovalStatus } from '@/hooks/useApprovalStatus';
import ApprovalModal from '@/components/partner/shared/ApprovalModal';
import { useChat } from '@/hooks/useChat';
import { API_BASE_URL } from '@/config/api';
import { getProfileImageUrl } from '@/utils/profileImageUrl';

const { TextArea } = Input;

export default function Chat() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [conversationStatus, setConversationStatus] = useState<'open' | 'archived'>('open');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Approval status check
    const { isApproved, isLoading: isLoadingApproval } = useApprovalStatus();
    
    // Get current user info
    const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: string } | null>(null);
    
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setCurrentUser({
                id: user.id,
                name: user.name || user.email,
                role: 'partner'
            });
        }
    }, []);
    
    // State for selected conversation
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    
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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const handleConversationClick = async (conversationId: string) => {
        setSelectedConversationId(conversationId);
        await fetchMessages(conversationId);
        await markAsRead(conversationId);
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

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="shadow-sm border-b border-gray-200 px-6 py-4" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <MenuOutlined className="text-xl" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">การแชทของคุณ</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            {isConnected ? (
                                <span className="text-sm text-green-600">● Connected</span>
                            ) : (
                                <span className="text-sm text-red-600">● Disconnected</span>
                            )}
                        </div>
                    </div>
                </header>

                {/* Chat Content */}
                <main className="flex-1 flex overflow-hidden">
                    {/* Chat List */}
                    <div className="w-80 border-r border-gray-200 flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Chat</h2>
                            <div className="flex gap-4 mt-2">
                                <button 
                                    className={`${
                                        conversationStatus === 'open' 
                                            ? 'text-blue-600 font-medium border-b-2 border-blue-600' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    } pb-1`}
                                    onClick={() => setConversationStatus('open')}
                                >
                                    Open
                                </button>
                                <button 
                                    className={`${
                                        conversationStatus === 'archived' 
                                            ? 'text-blue-600 font-medium border-b-2 border-blue-600' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    } pb-1`}
                                    onClick={() => setConversationStatus('archived')}
                                >
                                    Archived
                                </button>
                            </div>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Spin size="large" />
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <p>ไม่มีการสนทนา</p>
                                </div>
                            ) : (
                                conversations.map((conv) => {
                                    const convParticipant = conv.participant;
                                    return (
                                        <div 
                                            key={conv.id} 
                                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                                conv.id === selectedConversationId ? 'bg-blue-50' : ''
                                            }`}
                                            onClick={() => handleConversationClick(conv.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar 
                                                        size={40} 
                                                        src={getAvatarUrl(convParticipant?.avatar)} 
                                                    />
                                                    {convParticipant?.online && (
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium text-gray-900 truncate">
                                                            {convParticipant?.name || 'Unknown'}
                                                        </h3>
                                                        <span className="text-xs text-gray-500">
                                                            {conv.last_message ? formatTime(conv.last_message.sent_at) : ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {conv.last_message?.content || 'No messages yet'}
                                                        </p>
                                                        {conv.unread_count > 0 && (
                                                            <Badge count={conv.unread_count} size="small" />
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

                    {/* Chat Messages */}
                    <div className="flex-1 flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
                        {selectedConversationId && participant ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200" style={{ backgroundColor: '#FFFFFF' }}>
                                    <div className="flex items-center gap-3">
                                        <Avatar size={40} src={getAvatarUrl(participant.avatar)} />
                                        <div>
                                            <h3 className="font-medium text-gray-900">{participant.name}</h3>
                                            <p className={`text-sm ${participant.online ? 'text-green-600' : 'text-gray-500'}`}>
                                                {participant.online ? 'Online' : participant.last_seen ? `Last seen ${formatTime(participant.last_seen)}` : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <Spin size="large" />
                                        </div>
                                    ) : currentMessages.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            <p>ไม่มีข้อความ เริ่มสนทนาใหม่ได้เลย!</p>
                                        </div>
                                    ) : (
                                        <>
                                            {currentMessages.length > 0 && (
                                                <div className="text-center">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(currentMessages[0]?.sent_at).toLocaleDateString('th-TH', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            )}

                                            {currentMessages.map((msg) => {
                                                const isMine = msg.sender.id === currentUser?.id;
                                                return (
                                                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`flex gap-2 max-w-xs lg:max-w-md ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                                                            {!isMine && (
                                                                <Avatar size={32} src={getAvatarUrl(msg.sender.avatar)} />
                                                            )}
                                                            <div className="flex flex-col">
                                                                <div 
                                                                    className={`rounded-2xl px-4 py-2 ${
                                                                        isMine 
                                                                            ? 'bg-blue-500 text-white' 
                                                                            : 'bg-gray-100 text-gray-900'
                                                                    }`}
                                                                >
                                                                    <p>{msg.content}</p>
                                                                </div>
                                                                <div className={`text-xs text-gray-500 mt-1 flex items-center gap-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                                    <span>{formatMessageTime(msg.sent_at)}</span>
                                                                    {isMine && (
                                                                        <span className="text-blue-500">
                                                                            {msg.read_at ? '✓✓' : msg.delivered_at ? '✓' : '○'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            
                                            {/* Typing indicator */}
                                            {currentTypingUsers.length > 0 && (
                                                <div className="flex justify-start">
                                                    <div className="flex gap-2 items-center">
                                                        <Avatar size={32} src={getAvatarUrl(currentTypingUsers[0]?.avatar)} />
                                                        <div className="bg-gray-100 rounded-2xl px-4 py-2">
                                                            <div className="flex gap-1">
                                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-200" style={{ backgroundColor: '#FFFFFF' }}>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <TextArea
                                                value={inputValue}
                                                onChange={(e) => handleInputChange(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Write your message..."
                                                autoSize={{ minRows: 1, maxRows: 4 }}
                                                className="resize-none"
                                                disabled={isSending || !isConnected}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleSendMessage}
                                            disabled={!inputValue.trim() || isSending || !isConnected}
                                            className={`px-4 py-2 rounded-lg ${
                                                !inputValue.trim() || isSending || !isConnected
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            {isSending ? (
                                                <Spin size="small" />
                                            ) : (
                                                <SendOutlined />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <p className="text-lg">เลือกการสนทนาเพื่อเริ่มแชท</p>
                                    <p className="text-sm mt-2">Select a conversation to start chatting</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            
            {/* Approval Status Modal */}
            <ApprovalModal isOpen={!isLoadingApproval && !isApproved} />
        </div>
    );
}
