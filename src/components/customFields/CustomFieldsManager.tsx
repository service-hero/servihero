import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CustomFieldService } from '../../services/customFields/CustomFieldService';
import type { CustomField, FieldType } from '../../types/customFields';

interface CustomFieldsManagerProps {
  entityType: CustomField['entityType'];
  onClose: () => void;
  isOpen: boolean;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Single Select' },
  { value: 'multiselect', label: 'Multi Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
];

export default function CustomFieldsManager({ entityType, onClose, isOpen }: CustomFieldsManagerProps) {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: '',
    type: 'text',
    entityType,
    required: false,
  });
  const [showNewFieldForm, setShowNewFieldForm] = useState(false);

  useEffect(() => {
    loadFields();
  }, [entityType]);

  const loadFields = async () => {
    try {
      const loadedFields = await CustomFieldService.getFields(entityType);
      setFields(loadedFields);
    } catch (error) {
      console.error('Failed to load fields:', error);
    }
  };

  const handleCreateField = async () => {
    if (!newField.name || !newField.type) return;

    try {
      await CustomFieldService.createField(newField);
      await loadFields();
      setNewField({ name: '', type: 'text', entityType, required: false });
      setShowNewFieldForm(false);
    } catch (error) {
      console.error('Failed to create field:', error);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      await CustomFieldService.deleteField(fieldId);
      await loadFields();
    } catch (error) {
      console.error('Failed to delete field:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Custom Fields Manager - {entityType.charAt(0).toUpperCase() + entityType.slice(1)}s</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Existing Fields */}
          <div className="space-y-4">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{field.name}</p>
                  <p className="text-sm text-gray-500">
                    Type: {FIELD_TYPES.find(t => t.value === field.type)?.label}
                    {field.required && ' • Required'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteField(field.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No custom fields defined for {entityType}s yet
              </div>
            )}
          </div>

          {/* New Field Form */}
          {showNewFieldForm ? (
            <div className="mt-6 space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Field Name</label>
                <Input
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  placeholder="Enter field name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Field Type</label>
                <Select
                  value={newField.type}
                  onValueChange={(value) => setNewField({ ...newField, type: value as FieldType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] bg-white border shadow-lg" position="popper">
                    {FIELD_TYPES.map((type) => (
                      <SelectItem 
                        key={type.value} 
                        value={type.value}
                        className="hover:bg-gray-100 cursor-pointer"
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(newField.type === 'select' || newField.type === 'multiselect') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Options</label>
                  <Input
                    placeholder="Enter options (comma-separated)"
                    onChange={(e) => setNewField({
                      ...newField,
                      options: e.target.value.split(',').map(o => o.trim())
                    })}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="required" className="text-sm text-gray-700">
                  Required field
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNewFieldForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateField}
                  disabled={!newField.name || !newField.type}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Create Field
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowNewFieldForm(true)}
              className="mt-6 w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Field
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}