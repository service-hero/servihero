import type { CustomField } from '../../types/customFields';

export const MOCK_CUSTOM_FIELDS: CustomField[] = [
  {
    id: '1',
    name: 'LinkedIn Profile',
    type: 'url',
    entityType: 'contact',
    required: false,
    placeholder: 'Enter LinkedIn URL',
    description: 'Professional LinkedIn profile URL',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Industry',
    type: 'select',
    entityType: 'company',
    required: true,
    options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'],
    defaultValue: 'Technology',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Deal Source',
    type: 'select',
    entityType: 'deal',
    required: true,
    options: ['Website', 'Referral', 'Cold Call', 'Event', 'Other'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Lead Score',
    type: 'number',
    entityType: 'lead',
    required: false,
    description: 'Automated lead scoring (0-100)',
    defaultValue: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];