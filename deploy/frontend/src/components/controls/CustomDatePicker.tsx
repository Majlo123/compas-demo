import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import classNameBuilder from '@/utils/classNameBuilder';

type CustomDatePickerProps = {
  label?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (dateString: string) => void;
  min?: string;
  disabledDates?: string[];
  className?: string;
};

const CustomDatePicker = React.forwardRef<HTMLDivElement, CustomDatePickerProps>(
  (
    {
      label,
      required,
      error,
      value,
      onChange,
      min,
      disabledDates = [],
      className = '',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pickerPosition, setPickerPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const selectedDate = value ? new Date(value + 'T00:00:00') : undefined;
    const minDate = min ? new Date(min + 'T00:00:00') : undefined;

    // Disable dates that are:
    // 1. Before today (min)
    // 2. In the disabledDates array (collective days off)
    // 3. Weekends (Saturday and Sunday)
    const isDateDisabled = (date: Date): boolean => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayOfWeek = date.getDay();
      
      // Check if weekend (0 = Sunday, 6 = Saturday)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return true;
      }
      
      // Check if before min date
      if (minDate && date < minDate) {
        return true;
      }
      
      // Check if in disabled dates
      return disabledDates.includes(dateStr);
    };

    // Close picker when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const clickedInsideWrapper = wrapperRef.current?.contains(target);
        const clickedInsideCalendar = calendarRef.current?.contains(target);
        
        if (!clickedInsideWrapper && !clickedInsideCalendar) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isOpen]);

    const handleDateChange = (date: Date) => {
      if (!isDateDisabled(date)) {
        const dateStr = format(date, 'yyyy-MM-dd');
        onChange?.(dateStr);
        setIsOpen(false);
      }
    };

    // Calculate position for calendar popover to avoid clipping
    useEffect(() => {
      if (!isOpen || !wrapperRef.current) return;

      const updatePosition = () => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        // Use actual calendar height if available, otherwise estimate
        const calendarHeight = calendarRef.current?.offsetHeight || 280;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Position above only if absolutely not enough space below AND there's space above
        const shouldPositionAbove = spaceBelow < calendarHeight + 20 && spaceAbove > calendarHeight + 20;
        
        setPickerPosition({
          top: shouldPositionAbove 
            ? rect.top + window.scrollY - calendarHeight - 8
            : rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      };

      updatePosition();
      // Small delay to get actual calendar dimensions
      const timeoutId = setTimeout(updatePosition, 10);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [isOpen]);

    return (
      <div ref={ref || wrapperRef} className={classNameBuilder(className, 'relative')}>
        {label && (
          <label className="flex items-center text-p2 text-pureBlack mb-sm">
            <span className="mr-1">{label}</span>
            {required && <span className="text-red">*</span>}
          </label>
        )}

        {/* Date Input Display */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={classNameBuilder(
            'w-full p-md border rounded-lg transition-colors cursor-pointer',
            'flex items-center justify-between',
            !error && !isOpen && 'border-someGrey hover:border-grey',
            error && '!border-red',
            isOpen && '!border-primary'
          )}
        >
          <input
            type="text"
            value={selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
            readOnly
            placeholder="Select date"
            className="outline-none border-none bg-transparent text-p2 px-0 py-0 text-darkGrey cursor-pointer"
          />
          <span className="icon-calendar" />
        </div>

        {error && (
          <span
            className="flex flex-col justify-center text-p2 h-8 w-full text-red"
            aria-live="polite"
            role={error ? 'alert' : undefined}
          >
            {error}
          </span>
        )}

        {/* Calendar Picker */}
        {isOpen && pickerPosition &&
          createPortal(
            <div
              ref={calendarRef}
              className="fixed bg-white border border-someGrey rounded-lg shadow-lg calendar-picker-wrapper pointer-events-auto"
              style={{
                top: pickerPosition.top,
                left: pickerPosition.left,
                zIndex: 9999,
              }}
            >
              <div className="p-2">
                <Calendar
                  value={selectedDate}
                  onChange={handleDateChange}
                  minDate={minDate}
                  tileDisabled={({ date, view }) => view === 'month' ? isDateDisabled(date) : false}
                  className="react-calendar-custom"
                />
              </div>
            </div>,
            document.body
          )}

        <style>{`
          .calendar-picker-wrapper {
            max-width: fit-content;
          }
          .calendar-picker-wrapper .react-calendar {
            border: none;
            font-family: inherit;
            width: 100%;
            max-width: 300px;
          }
          .calendar-picker-wrapper .react-calendar__tile {
            padding: 0.375rem;
            font-size: 0.8rem;
          }
          .calendar-picker-wrapper .react-calendar__tile--active {
            background-color: #0066CC;
            color: white;
          }
          .calendar-picker-wrapper .react-calendar__tile--disabled {
            color: #ccc;
            cursor: not-allowed;
            opacity: 0.5;
          }
          .calendar-picker-wrapper .react-calendar__tile:hover:not(:disabled) {
            background-color: #e6f0ff;
          }
        `}</style>
      </div>
    );
  }
);

CustomDatePicker.displayName = 'CustomDatePicker';

export default CustomDatePicker;
