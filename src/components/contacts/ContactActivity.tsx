import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  Clock,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { ContactActivity } from '../../types';

interface ContactActivityProps {
  contactId: string;
}

export default function ContactActivity({ contactId }: ContactActivityProps) {
  const [activities, setActivities] = useState<ContactActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.accountId || !contactId) return;

    const q = query(
      collection(db, 'contactActivities'),
      where('contactId', '==', contactId),
      where('accountId', '==', user.accountId),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedActivities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as ContactActivity[];

      setActivities(loadedActivities);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [contactId, user?.accountId]);

  const getActivityIcon = (type: ContactActivity['type']) => {
    switch (type) {
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Activity Timeline</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute left-0 top-6 bottom-0 w-px bg-gray-200" />

              <div className="relative flex items-start">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  activity.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                } ring-8 ring-white`}>
                  {getActivityIcon(activity.type)}
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {activity.description && (
                    <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                  )}

                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(activity.date).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src="" alt={activity.assigneeName} />
                        <AvatarFallback>
                          {activity.assigneeName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-1.5 text-xs text-gray-500">
                        {activity.assigneeName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No activities found
            </div>
          )}
        </div>
      )}
    </div>
  );
}