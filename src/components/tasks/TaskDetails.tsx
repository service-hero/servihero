import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Clock,
  Calendar,
  User2,
  Tag,
  MessageSquare,
  FileText,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/use-toast';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Task } from '../../types';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetails({ task, onClose }: TaskDetailsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    if (!user?.accountId) return;

    try {
      setLoading(true);
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        completed: !task.completed,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Success",
        description: `Task marked as ${task.completed ? 'incomplete' : 'complete'}`,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              task.completed ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Clock className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
              <p className="text-sm text-gray-500">
                Due {task.dueDate.toLocaleDateString()}
              </p>
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
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center py-3"
            onClick={handleToggleComplete}
            disabled={loading}
          >
            {task.completed ? (
              <XCircle className="h-5 w-5 mb-1" />
            ) : (
              <CheckCircle2 className="h-5 w-5 mb-1" />
            )}
            <span className="text-xs">
              {task.completed ? 'Mark Incomplete' : 'Complete'}
            </span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-3">
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs">Note</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-3">
            <MessageSquare className="h-5 w-5 mb-1" />
            <span className="text-xs">Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-3">
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">Reschedule</span>
          </Button>
        </div>
      </div>

      {/* Task Information */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <User2 className="h-4 w-4 text-gray-400 mr-2" />
              <div className="flex items-center">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="ml-2">{task.assignee.name}</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span>Due {task.dueDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span>Estimated {task.estimatedTime} hours</span>
            </div>
          </div>

          {task.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag) => (
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

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <p className="text-sm text-gray-500">{task.description}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="comments" className="flex-1">
        <div className="border-b border-gray-200">
          <TabsList className="w-full">
            <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
            <TabsTrigger value="subtasks" className="flex-1">Subtasks</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="comments" className="p-4">
          <div className="text-center text-gray-500">No comments yet</div>
        </TabsContent>

        <TabsContent value="activity" className="p-4">
          <div className="text-center text-gray-500">No activity yet</div>
        </TabsContent>

        <TabsContent value="subtasks" className="p-4">
          <div className="text-center text-gray-500">No subtasks yet</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}