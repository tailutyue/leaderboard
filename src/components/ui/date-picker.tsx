import React from 'react';
import DatePicker from 'react-datepicker';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Button } from './button';

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

export function CustomDatePicker({
  selected,
  onChange,
  placeholder = 'Select date',
  className,
}: CustomDatePickerProps) {
  return (
    <div className={cn('relative', className)}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="MMMM d, yyyy"
        placeholderText={placeholder}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        customInput={
          <div className="relative flex items-center">
            <input
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
              value={selected ? selected.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              placeholder={placeholder}
              readOnly
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-0 h-full px-3 py-2 hover:bg-transparent"
            >
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </Button>
          </div>
        }
      />
    </div>
  );
}

export { CustomDatePicker as DatePicker }; 