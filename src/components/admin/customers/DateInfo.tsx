// components/DateInfo.tsx
import React from 'react';
import { Calendar } from 'lucide-react';

interface DateInfoProps {
  date: string;
  formatDate: (date: string) => string;
}

export const DateInfo: React.FC<DateInfoProps> = ({ date, formatDate }) => (
  <div className="flex items-center text-sm text-gray-900">
    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
    {formatDate(date)}
  </div>
);