import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Tag, Calendar } from 'lucide-react';
import type { Contact } from '../../types';

interface ContactListProps {
  contacts: Contact[];
  onContactSelect: (contact: Contact) => void;
}

export default function ContactList({ contacts, onContactSelect }: ContactListProps) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {contacts.map((contact) => (
          <motion.li
            key={contact.id}
            whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
            onClick={() => onContactSelect(contact)}
            className="cursor-pointer"
          >
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 truncate">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {contact.firstName} {contact.lastName}
                      </p>
                      {contact.status === 'active' && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {contact.position} at {contact.company}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex flex-col items-end text-sm text-gray-500">
                    {contact.lastContact && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {new Date(contact.lastContact).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {contact.email}
                  </div>
                  {contact.phone && (
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {contact.phone}
                    </div>
                  )}
                </div>
                {contact.tags.length > 0 && (
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <Tag className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span className="truncate">
                      {contact.tags.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}