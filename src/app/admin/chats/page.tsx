'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/shared/Sidebar';
import { Avatar, Input, Tabs } from 'antd';
import { SmileOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface ChatUser {
    id: string;
    name: string;
    avatar?: string;
    online: boolean;
    lastMessage: string;
    time: string;
    unreadCount?: number;
}

interface Message {
    id: string;
    sender: 'user' | 'admin';
    content: string;
    time: string;
    logo?: boolean;
}

export default function AdminChats() {
    const [selectedChat, setSelectedChat] = useState<string>('1');
    const [messageText, setMessageText] = useState('');
    const [activeTab, setActiveTab] = useState('open');

    // Mock data for chat list
    const chatUsers: ChatUser[] = [
        {
            id: '1',
            name: 'Andreana Viola',
            online: true,
            lastMessage: 'Hi, How are you today?',
            time: '1m ago',
            unreadCount: 2
        },
        // Add more chat users as needed
    ];

    // Mock data for messages
    const messages: Message[] = [
        {
            id: '1',
            sender: 'user',
            content: 'แข่งงออกบริการที่งกองพัก',
            time: '9:00 AM'
        },
        {
            id: '2',
            sender: 'admin',
            content: 'สวัสดีค่ะ กรุงอนาคอตถึอแแแนอนอกอขาแพอคบิน',
            time: '9:10 AM',
            logo: true
        },
        {
            id: '3',
            sender: 'user',
            content: 'โรงเเรม สุขสม หมายนขทองกิมสเเล็ค 4015 พอตต็บปตตือง',
            time: '9:11 AM'
        },
        {
            id: '4',
            sender: 'admin',
            content: 'ขอบคุณค่ะ เผื่งกะหะระป์ละานะรรมะทำแท็บที่',
            time: '10:10 AM',
            logo: true
        }
    ];

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
                    <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                        หน้าแชท
                    </h1>
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
                                activeKey={activeTab}
                                onChange={setActiveTab}
                                items={tabItems}
                                style={{ marginBottom: 0 }}
                            />
                        </div>

                        {/* Chat List */}
                        <div style={{ overflowY: 'auto', height: 'calc(100% - 140px)' }}>
                            {chatUsers.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedChat(user.id)}
                                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    style={{
                                        backgroundColor: selectedChat === user.id ? '#F5F5F5' : 'transparent',
                                        borderBottom: '1px solid #F0F0F0'
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar
                                                size={48}
                                                src="/api/placeholder/48/48"
                                                style={{ backgroundColor: '#FDB930' }}
                                            >
                                                {user.name.charAt(0)}
                                            </Avatar>
                                            {user.online && (
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
                                                    {user.name}
                                                </h3>
                                                <span className="text-xs" style={{ color: '#999999' }}>
                                                    {user.time}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm truncate" style={{ color: '#666666' }}>
                                                    {user.lastMessage}
                                                </p>
                                                {user.unreadCount && (
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
                                                        {user.unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Chat Conversation */}
                    <div className="flex-1 flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b" style={{ borderColor: '#E0E0E0' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar
                                                size={40}
                                                src="/api/placeholder/40/40"
                                                style={{ backgroundColor: '#FDB930' }}
                                            >
                                                A
                                            </Avatar>
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
                                        </div>
                                        <div>
                                            <h3 className="font-semibold" style={{ color: '#000000' }}>
                                                Alexandra Michu
                                            </h3>
                                            <p className="text-sm" style={{ color: '#52C41A' }}>
                                                Online
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 p-6 overflow-y-auto" style={{ backgroundColor: '#FAFAFA' }}>
                                    {/* Today Divider */}
                                    <div className="text-center mb-4">
                                        <span className="text-sm" style={{ color: '#999999' }}>
                                            Today
                                        </span>
                                    </div>

                                    {/* Messages */}
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`mb-4 flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {message.sender === 'user' && (
                                                <div className="flex gap-2 items-start max-w-[60%]">
                                                    <Avatar
                                                        size={32}
                                                        src="/api/placeholder/32/32"
                                                        style={{ backgroundColor: '#FDB930', flexShrink: 0 }}
                                                    >
                                                        A
                                                    </Avatar>
                                                    <div>
                                                        <div
                                                            className="p-3 rounded-lg"
                                                            style={{
                                                                backgroundColor: '#F0F0F0',
                                                                color: '#000000'
                                                            }}
                                                        >
                                                            {message.content}
                                                        </div>
                                                        <div className="text-xs mt-1" style={{ color: '#999999' }}>
                                                            {message.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {message.sender === 'admin' && (
                                                <div className="flex gap-2 items-start max-w-[60%]">
                                                    <div>
                                                        <div
                                                            className="p-3 rounded-lg"
                                                            style={{
                                                                backgroundColor: '#1890FF',
                                                                color: '#FFFFFF'
                                                            }}
                                                        >
                                                            {message.content}
                                                        </div>
                                                        <div className="text-xs mt-1 text-right" style={{ color: '#999999' }}>
                                                            {message.time}
                                                        </div>
                                                    </div>
                                                    {message.logo && (
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
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Typing Indicator */}
                                    <div className="flex gap-2 items-start max-w-[60%]">
                                        <Avatar
                                            size={32}
                                            src="/api/placeholder/32/32"
                                            style={{ backgroundColor: '#FDB930' }}
                                        >
                                            A
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
                                            <div className="text-xs mt-1" style={{ color: '#999999' }}>
                                                10:40 AM
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t" style={{ borderColor: '#E0E0E0' }}>
                                    <div className="flex items-center gap-2">
                                        <TextArea
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="Write your message..."
                                            autoSize={{ minRows: 1, maxRows: 3 }}
                                            style={{
                                                flex: 1,
                                                borderRadius: '20px',
                                                padding: '8px 16px'
                                            }}
                                        />
                                        <div className="flex gap-2">
                                            <div
                                                className="cursor-pointer"
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#F5F5F5'
                                                }}
                                            >
                                                <SmileOutlined style={{ fontSize: 18, color: '#999999' }} />
                                            </div>
                                            <div
                                                className="cursor-pointer"
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#F5F5F5'
                                                }}
                                            >
                                                <PaperClipOutlined style={{ fontSize: 18, color: '#999999' }} />
                                            </div>
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
