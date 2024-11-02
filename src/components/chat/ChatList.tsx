import React from 'react';
import { format } from 'date-fns';
import type { ChatRoom, ChatParticipant } from '../../types/chat';

interface ChatListProps {
  rooms: (ChatRoom & { participant: ChatParticipant })[];
  selectedRoomId?: string;
  onRoomSelect: (room: ChatRoom) => void;
}

export default function ChatList({ rooms, selectedRoomId, onRoomSelect }: ChatListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-medium text-gray-900">Messages</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onRoomSelect(room)}
            className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer ${
              selectedRoomId === room.id ? 'bg-gray-50' : ''
            }`}
          >
            <div className="relative">
              <img
                src={room.participant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(room.participant.name)}`}
                alt={room.participant.name}
                className="w-12 h-12 rounded-full"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                room.participant.status === 'online' ? 'bg-green-400' :
                room.participant.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
              }`} />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {room.participant.name}
                </p>
                {room.lastMessage && (
                  <p className="text-xs text-gray-500">
                    {format(room.lastMessage.timestamp, 'p')}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                {room.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {room.lastMessage.content}
                  </p>
                )}
                {room.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-indigo-600 rounded-full">
                    {room.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}