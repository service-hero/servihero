import React from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { 
  Phone,
  Mail,
  User,
  AlertTriangle,
  PenSquare,
  Building2,
  MapPin,
  Calendar,
  Tag
} from 'lucide-react';
import type { ChatParticipant } from '../../types/chat';

interface ContactDetailsProps {
  contactId: string | null;
}

const UnknownContactPlaceholder: React.FC<{ onEdit?: () => void }> = ({ onEdit }) => (
  <div className="p-6 text-center">
    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertTriangle className="w-8 h-8 text-yellow-500" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Unknown Contact</h3>
    <p className="text-sm text-gray-500 mb-4">
      This contact hasn't been added to your contacts list yet.
    </p>
    <Button onClick={onEdit} variant="outline" className="inline-flex items-center">
      <PenSquare className="w-4 h-4 mr-2" />
      Add Contact Details
    </Button>
  </div>
);

export default function ContactDetails({ contactId }: ContactDetailsProps) {
  const handleEditContact = () => {
    console.log('Edit contact:', contactId);
  };

  // Mock contact data - In a real app, fetch this from your store/API
  const contact: ChatParticipant | null = contactId ? {
    id: contactId,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    status: 'online',
    company: 'Tech Corp',
    position: 'Senior Developer',
    location: 'San Francisco, CA',
    tags: ['client', 'priority'],
    lastSeen: new Date(),
  } : null;

  if (!contactId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a conversation to view contact details
      </div>
    );
  }

  if (!contact || (!contact.email && !contact.phone)) {
    return <UnknownContactPlaceholder onEdit={handleEditContact} />;
  }

  return (
    <motion.div
      key={contactId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Contact Header */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto">
                {contact.avatar ? (
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-medium text-white">
                    {contact.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                contact.status === 'online' ? 'bg-green-500' :
                contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
              }`} />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{contact.name}</h2>
            {contact.position && (
              <p className="text-sm text-gray-500">{contact.position}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {contact.email && (
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{contact.phone}</span>
              </div>
            )}
            {contact.company && (
              <div className="flex items-center space-x-3 text-gray-600">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{contact.company}</span>
              </div>
            )}
            {contact.location && (
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{contact.location}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-500">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-medium">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Last Activity */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Last Activity</span>
            </div>
            <p className="text-sm text-gray-600">
              {contact.lastSeen
                ? `Last seen ${new Date(contact.lastSeen).toLocaleString()}`
                : 'No recent activity'}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-3">
            <Button variant="outline" className="w-full justify-center" onClick={handleEditContact}>
              <PenSquare className="w-4 h-4 mr-2" />
              Edit Contact
            </Button>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}