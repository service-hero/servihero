import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '../ui/use-toast';
import CustomFieldsRenderer from '../customFields/CustomFieldsRenderer';
import { CustomFieldService } from '../../services/customFields/CustomFieldService';
import { Mail, Phone, Building2, Tag, Calendar, Edit2, Trash2 } from 'lucide-react';
import type { Contact } from '../../types';
import type { CustomField } from '../../types/customFields';

interface ContactModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
}

export default function ContactModal({ 
  contact, 
  isOpen, 
  onClose,
  onEdit,
  onDelete 
}: ContactModalProps) {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState('details');
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (contact) {
      loadCustomFields();
    }
  }, [contact]);

  const loadCustomFields = async () => {
    try {
      const fields = await CustomFieldService.getFields('contact');
      setCustomFields(fields);
      
      if (contact) {
        const values = await CustomFieldService.getFieldValues(contact.id);
        setCustomFieldValues(values);
      }
    } catch (error) {
      console.error('Failed to load custom fields:', error);
      toast({
        title: "Error",
        description: "Failed to load custom fields",
        variant: "destructive",
      });
    }
  };

  const handleCustomFieldChange = async (fieldId: string, value: any) => {
    if (!contact) return;

    try {
      await CustomFieldService.setFieldValue(contact.id, fieldId, value);
      setCustomFieldValues(prev => ({
        ...prev,
        [fieldId]: value
      }));
      toast({
        title: "Success",
        description: "Custom field updated",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to update custom field value:', error);
      toast({
        title: "Error",
        description: "Failed to update custom field",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!contact || !onDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete(contact.id);
      toast({
        title: "Success",
        description: "Contact deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {contact.firstName} {contact.lastName}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(contact)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="custom">Custom Fields</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="details" className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{contact.email}</span>
                  </div>
                </div>

                {contact.phone && (
                  <div className="space-y-1">
                    <label className="text-sm text-gray-500">Phone</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm text-gray-500">Company</label>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{contact.company}</span>
                  </div>
                </div>

                {contact.position && (
                  <div className="space-y-1">
                    <label className="text-sm text-gray-500">Position</label>
                    <span className="text-sm">{contact.position}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {contact.tags.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Tags</label>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {contact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Last Contact */}
              {contact.lastContact && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Last Contact</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {new Date(contact.lastContact).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom">
              <CustomFieldsRenderer
                fields={customFields}
                values={customFieldValues}
                onChange={handleCustomFieldChange}
              />
            </TabsContent>

            <TabsContent value="activity">
              <div className="text-center text-gray-500 py-8">
                Activity timeline coming soon
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}