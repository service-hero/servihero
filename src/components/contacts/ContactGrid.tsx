import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Building2, 
  MoreHorizontal,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import type { Contact } from '../../types';

interface ContactGridProps {
  contacts: Contact[];
  onContactSelect: (contact: Contact) => void;
}

export default function ContactGrid({ contacts, onContactSelect }: ContactGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {contacts.map((contact) => (
        <motion.div
          key={contact.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          onClick={() => onContactSelect(contact)}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contact.avatar} alt={`${contact.firstName} ${contact.lastName}`} />
                <AvatarFallback>
                  {contact.firstName[0]}{contact.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {contact.firstName} {contact.lastName}
                </h3>
                {contact.company && (
                  <p className="text-sm text-gray-500">
                    {contact.position} at {contact.company.name}
                  </p>
                )}
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                {contact.email}
              </div>

              {contact.phone && (
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  {contact.phone}
                </div>
              )}

              {contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {contact.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {contact.tags.length > 2 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{contact.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                contact.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {contact.status === 'active' ? (
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                {contact.status}
              </span>
              {contact.lastActivity && (
                <span className="text-xs text-gray-500">
                  Last active {new Date(contact.lastActivity).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}