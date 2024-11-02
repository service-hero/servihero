import React from 'react';
import { Calendar, CheckCircle2, Clock, Tag } from 'lucide-react';
import type { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
}

export default function TaskList({ tasks, onTaskComplete }: TaskListProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority];
  };

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      {tasks.map((task) => (
        <div key={task.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => onTaskComplete(task.id)}
                className={`mt-1 ${
                  task.completed
                    ? 'text-green-500 hover:text-green-600'
                    : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>
              <div>
                <h3 className={`text-sm font-medium ${
                  task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {task.estimatedTime} hrs
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                {task.tags.length > 0 && (
                  <div className="mt-2 flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8 rounded-full"
                src={task.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name)}`}
                alt={task.assignee.name}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}