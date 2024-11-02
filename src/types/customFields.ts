export type FieldType = 
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone';

export interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  entityType: 'contact' | 'company' | 'deal' | 'lead';
  required: boolean;
  description?: string;
  placeholder?: string;
  defaultValue?: any;
  options?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FieldValue {
  fieldId: string;
  entityId: string;
  value: any;
  updatedAt: Date;
}