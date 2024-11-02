import React from 'react';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Building2,
  Tag,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import type { Contact } from '../../types';

interface ContactTableProps {
  contacts: Contact[];
  onContactSelect: (contact: Contact) => void;
}

export default function ContactTable({ contacts, onContactSelect }: ContactTableProps) {
  return (
    <div className="min-w-full divide-y divide-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tags
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <motion.tr
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
              onClick={() => onContactSelect(contact)}
              className="cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar} alt={`${contact.firstName} ${contact.lastName}`} />
                    <AvatarFallback>
                      {contact.firstName[0]}{contact.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Phone className="h-4 w-4" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                {contact.company && (
                  <div className="flex items-center">
                    {contact.company.logo ? (
                      <img
                        src={contact.company.logo}
                        alt={contact.company.name}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-400" />
                    )}
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.company.name}
                      </div>
                      {contact.position && (
                        <div className="text-sm text-gray-500">
                          {contact.position}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  contact.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {contact.status === 'active' ? (
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-1" />
                  )}
                  {contact.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}