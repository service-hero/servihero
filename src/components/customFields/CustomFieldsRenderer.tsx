import React from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import type { CustomField, FieldValue } from '../../types/customFields';

interface CustomFieldsRendererProps {
  fields: CustomField[];
  values: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
  readOnly?: boolean;
}

export default function CustomFieldsRenderer({
  fields,
  values,
  onChange,
  readOnly = false
}: CustomFieldsRendererProps) {
  const renderField = (field: CustomField) => {
    const value = values[field.id] ?? field.defaultValue;

    switch (field.type) {
      case 'text':
      case 'url':
      case 'email':
      case 'phone':
        return (
          <Input
            type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'}
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={readOnly}
            required={field.required}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.valueAsNumber)}
            placeholder={field.placeholder}
            disabled={readOnly}
            required={field.required}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={readOnly}
            required={field.required}
          />
        );

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(v) => onChange(field.id, v)}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <Select
            value={value}
            onValueChange={(v) => onChange(field.id, v)}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select options'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <Checkbox
            checked={value || false}
            onCheckedChange={(checked) => onChange(field.id, checked)}
            disabled={readOnly}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.name}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.description && (
            <p className="text-xs text-gray-500">{field.description}</p>
          )}
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}