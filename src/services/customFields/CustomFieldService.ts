import type { CustomField, FieldValue } from '../../types/customFields';
import { MOCK_CUSTOM_FIELDS } from './mockData';

// In-memory storage for development
let mockFields = [...MOCK_CUSTOM_FIELDS];
const mockFieldValues: Record<string, Record<string, any>> = {};

export class CustomFieldService {
  static async createField(data: Partial<CustomField>): Promise<CustomField> {
    const field = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as CustomField;

    mockFields.push(field);
    return field;
  }

  static async updateField(id: string, data: Partial<CustomField>): Promise<CustomField> {
    const fieldIndex = mockFields.findIndex(f => f.id === id);
    if (fieldIndex === -1) throw new Error('Field not found');

    const updatedField = {
      ...mockFields[fieldIndex],
      ...data,
      updatedAt: new Date(),
    };

    mockFields[fieldIndex] = updatedField;
    return updatedField;
  }

  static async deleteField(id: string): Promise<void> {
    mockFields = mockFields.filter(f => f.id !== id);
    // Clean up any values for this field
    Object.keys(mockFieldValues).forEach(entityId => {
      delete mockFieldValues[entityId][id];
    });
  }

  static async getFields(entityType: CustomField['entityType']): Promise<CustomField[]> {
    return mockFields.filter(f => f.entityType === entityType);
  }

  static async getFieldValues(entityId: string): Promise<Record<string, any>> {
    return mockFieldValues[entityId] || {};
  }

  static async setFieldValue(entityId: string, fieldId: string, value: any): Promise<void> {
    if (!mockFieldValues[entityId]) {
      mockFieldValues[entityId] = {};
    }
    mockFieldValues[entityId][fieldId] = value;
  }

  // Helper method to reset mock data (useful for testing)
  static resetMockData(): void {
    mockFields = [...MOCK_CUSTOM_FIELDS];
    Object.keys(mockFieldValues).forEach(key => delete mockFieldValues[key]);
  }
}