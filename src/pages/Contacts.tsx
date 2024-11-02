import React from 'react';
import ContactListView from '../components/contacts/ContactListView';
import ContactDetails from '../components/contacts/ContactDetails';
import { useContacts } from '../hooks/useContacts';

export default function Contacts() {
  const { contacts, loading } = useContacts();
  const [selectedContact, setSelectedContact] = React.useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Main Content */}
      <div className="flex-1">
        <ContactListView onContactSelect={setSelectedContact} />
      </div>

      {/* Contact Details Sidebar */}
      {selectedContact && (
        <div className="w-[400px] border-l border-gray-200 bg-white overflow-y-auto">
          <ContactDetails 
            contact={selectedContact} 
            onClose={() => setSelectedContact(null)} 
          />
        </div>
      )}
    </div>
  );
}