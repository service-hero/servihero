import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Mail,
  Phone,
  Building2,
  MapPin,
  Tag,
  MoreHorizontal,
  FileText,
  MessageSquare,
  Calendar,
  Plus,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import ContactActivity from './ContactActivity';
import ContactDeals from './ContactDeals';
import DealFormModal from '../modals/DealFormModal';
import type { Contact } from '../../types';

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
}

export default function ContactDetails({ contact, onClose }: ContactDetailsProps) {
  const [showDealModal, setShowDealModal] = useState(false);
  const [activeTab, setActiveTab] = useState('activity');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contact.avatar} alt={`${contact.firstName} ${contact.lastName}`} />
              <AvatarFallback>
                {contact.firstName[0]}{contact.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {contact.firstName} {contact.lastName}
              </h2>
              {contact.company && (
                <p className="text-sm text-gray-500">
                  {contact.position} at {contact.company.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-3">
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs">Note</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-3">
            <MessageSquare className="h-5 w-5 mb-1" />
            <span className="text-xs">Message</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-3">
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">Schedule</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-3">
            <DollarSign className="h-5 w-5 mb-1" />
            <span className="text-xs">Deal</span>
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <span>{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.company && (
              <div className="flex items-center text-sm">
                <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                <span>{contact.company.name}</span>
              </div>
            )}
          </div>

          {contact.addresses.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Addresses</h3>
              {contact.addresses.map((address, index) => (
                <div key={index} className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {contact.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Tags</h3>
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
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-gray-200">
          <TabsList className="w-full flex">
            <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
            <TabsTrigger value="deals" className="flex-1">Deals</TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">Tasks</TabsTrigger>
            <TabsTrigger value="files" className="flex-1">Files</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="activity" className="h-full">
            <ContactActivity contactId={contact.id} />
          </TabsContent>

          <TabsContent value="deals" className="h-full">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Deals</h3>
                <Button
                  onClick={() => setShowDealModal(true)}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Deal
                </Button>
              </div>
              <ContactDeals contactId={contact.id} />
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="h-full">
            <div className="p-4">Tasks content coming soon</div>
          </TabsContent>

          <TabsContent value="files" className="h-full">
            <div className="p-4">Files content coming soon</div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Deal Modal */}
      <DealFormModal
        open={showDealModal}
        onOpenChange={setShowDealModal}
        contactId={contact.id}
        contactName={`${contact.firstName} ${contact.lastName}`}
        companyName={contact.company?.name}
      />
    </div>
  );
}