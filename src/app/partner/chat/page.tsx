'use client';

import { useState } from 'react';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, SmileOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Input, Avatar, Badge } from 'antd';

const { TextArea } = Input;

export default function Chat() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [message, setMessage] = useState('');

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Sample chat data
    const conversations = [
        {
            id: 1,
            name: 'Andreana Viola',
            lastMessage: 'Hi, How are you today?',
            time: '1m ago',
            unread: 2,
            avatar: '/api/placeholder/40/40'
        }
    ];

    const messages = [
        {
            id: 1,
            sender: 'other',
            content: 'แจ้งขอยกเลิกห้องพัก',
            time: '9:00 AM',
            avatar: '/api/placeholder/32/32'
        },
        {
            id: 2,
            sender: 'me',
            content: 'สวัสดีค่ะ กรุณายกเลิกโรงแรมของคุณ',
            time: '9:10 AM'
        },
        {
            id: 3,
            sender: 'other',
            content: 'โรงแรม สุขสม หมายเลขห้องที่แก้ไข 4015 พอดีมีปัญหา',
            time: '9:11 AM',
            avatar: '/api/placeholder/32/32'
        },
        {
            id: 4,
            sender: 'me',
            content: 'ขอบคุณค่ะ เดี้ยวทางการประกันจะไปให้ค่ะ',
            time: '10:10 AM'
        },
        {
            id: 5,
            sender: 'other',
            content: '• • •',
            time: '10:40 AM',
            avatar: '/api/placeholder/32/32',
            isTyping: true
        }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
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
                    </div>
                </header>

                {/* Chat Content */}
                <main className="flex-1 flex overflow-hidden">
                    {/* Chat List */}
                    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Chat</h2>
                            <div className="flex gap-4 mt-2">
                                <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                                    Open
                                </button>
                                <button className="text-gray-500 hover:text-gray-700">
                                    Archived
                                </button>
                            </div>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto">
                            {conversations.map((conv) => (
                                <div key={conv.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar size={40} src={conv.avatar} />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-gray-900 truncate">{conv.name}</h3>
                                                <span className="text-xs text-gray-500">{conv.time}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                                                {conv.unread > 0 && (
                                                    <Badge count={conv.unread} size="small" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 flex flex-col bg-white">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center gap-3">
                                <Avatar size={40} src="/api/placeholder/40/40" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Alexandra Michu</h3>
                                    <p className="text-sm text-green-600">Online</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="text-center">
                                <span className="text-sm text-gray-500">Today</span>
                            </div>

                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-2 max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {msg.sender === 'other' && (
                                            <Avatar size={32} src={msg.avatar} />
                                        )}
                                        <div className={`rounded-2xl px-4 py-2 ${
                                            msg.sender === 'me' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-100 text-gray-900'
                                        }`}>
                                            <p className={msg.isTyping ? 'text-lg' : ''}>{msg.content}</p>
                                        </div>
                                    </div>
                                    <div className={`text-xs text-gray-500 mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <TextArea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write your message..."
                                        autoSize={{ minRows: 1, maxRows: 4 }}
                                        className="resize-none border-gray-300 rounded-full"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-500 hover:text-gray-700">
                                        <SmileOutlined className="text-xl" />
                                    </button>
                                    <button className="p-2 text-gray-500 hover:text-gray-700">
                                        <PaperClipOutlined className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
