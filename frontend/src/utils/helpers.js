import { format, isBefore, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(parseISO(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(parseISO(date), 'MMM dd, yyyy HH:mm');
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return isBefore(parseISO(dueDate), new Date());
};

export const getStatusColor = (status) => {
  const colors = {
    todo: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-slate-100 text-slate-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
