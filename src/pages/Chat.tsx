import React, { useState } from 'react';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import ContactDetails from '../components/chat/ContactDetails';
import type { ChatRoom, ChatMessage, ChatParticipant } from '../types/chat';

const MOCK_PARTICIPANTS: ChatParticipant[] = [
  {
    id: '1',
    name: 'John Doe',
    status: 'online',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Jane Smith',
    status: 'away',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    lastSeen: new Date(),
  },
];

const MOCK_ROOMS: (ChatRoom & { participant: ChatParticipant })[] = [
  {
    id: '1',
    participants: ['current-user', '1'],
    participant: MOCK_PARTICIPANTS[0],
    unreadCount: 2,
    lastMessage: {
      id: '1',
      senderId: '1',
      receiverId: 'current-user',
      content: "Hey, how's the project coming along?",
      timestamp: new Date(),
      status: 'delivered',
      type: 'text',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    participants: ['current-user', '2'],
    participant: MOCK_PARTICIPANTS[1],
    unreadCount: 0,
    lastMessage: {
      id: '2',
      senderId: 'current-user',
      receiverId: '2',
      content: "I'll send the report by tomorrow.",
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
      type: 'text',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1',
      senderId: '1',
      receiverId: 'current-user',
      content: "Hey, how's the project coming along?",
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
      type: 'text',
    },
    {
      id: '2',
      senderId: 'current-user',
      receiverId: '1',
      content: "Making good progress! I'll share an update in our next meeting.",
      timestamp: new Date(Date.now() - 1800000),
      status: 'delivered',
      type: 'text',
    },
  ],
};

export default function Chat() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleSendMessage = (content: string) => {
    if (!selectedRoom) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      receiverId: selectedRoom.participants.find(id => id !== 'current-user')!,
      content,
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
    };

    setMessages(prev => ({
      ...prev,
      [selectedRoom.id]: [...(prev[selectedRoom.id] || []), newMessage],
    }));

    setRooms(prev =>
      prev.map(room =>
        room.id === selectedRoom.id
          ? { ...room, lastMessage: newMessage, unreadCount: 0 }
          : room
      )
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Chat List */}
        <div className="col-span-3">
          <ChatList
            rooms={rooms}
            selectedRoomId={selectedRoom?.id}
            onRoomSelect={setSelectedRoom}
          />
        </div>

        {/* Chat Window */}
        <div className="col-span-6">
          {selectedRoom ? (
            <ChatWindow
              participant={rooms.find(r => r.id === selectedRoom.id)!.participant}
              messages={messages[selectedRoom.id] || []}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-white rounded-lg shadow">
              <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
          )}
        </div>

        {/* Contact Details */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow h-full">
            <ContactDetails 
              contactId={selectedRoom?.participants.find(id => id !== 'current-user') || null} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}