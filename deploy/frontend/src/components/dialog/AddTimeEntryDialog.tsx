import React, { FC, useState, useEffect } from 'react';

export type TimeEntryFormData = {
  project: string;
  description: string;
  hours: number;
  minutes: number;
  overtime: boolean;
  billable: boolean;
  startHour?: number;
  startMinute?: number;
};

export type TimeEntryInitialData = {
  id: string;
  project: string;
  description: string;
  hours: number;
  minutes: number;
  overtime: boolean;
  billable: boolean;
  startHour?: number;
  startMinute?: number;
};

type Props = {
  isOpen: boolean;
  selectedDate?: Date;
  projects?: Array<{ id: string; name: string }>;
  onSubmit?: (data: TimeEntryFormData, date: Date) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
  initialData?: TimeEntryInitialData;
  initialStartTime?: { hour: number; minute: number };
};

const AddTimeEntryDialog: FC<Props> = ({
  isOpen,
  selectedDate,
  projects = [],
  onSubmit,
  onCancel,
  mode = 'create',
  initialData,
  initialStartTime
}) => {
  const [formData, setFormData] = useState<TimeEntryFormData>({
    project: '',
    description: '',
    hours: 0,
    minutes: 0,
    overtime: false,
    billable: false,
    startHour: 8,
    startMinute: 0
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      // Pre-fill form with existing data for edit mode
      setFormData({
        project: initialData.project,
        description: initialData.description,
        hours: initialData.hours,
        minutes: initialData.minutes,
        overtime: initialData.overtime,
        billable: initialData.billable,
        startHour: initialData.startHour ?? 8,
        startMinute: initialData.startMinute ?? 0
      });
    } else if (isOpen && mode === 'create') {
      // Use initialStartTime if provided
      setFormData(prev => ({
        ...prev,
        startHour: initialStartTime?.hour ?? 8,
        startMinute: initialStartTime?.minute ?? 0
      }));
    } else if (!isOpen) {
      // Reset form when dialog closes
      setFormData({
        project: '',
        description: '',
        hours: 0,
        minutes: 0,
        overtime: false,
        billable: false,
        startHour: 8,
        startMinute: 0
      });
    }
  }, [isOpen, mode, initialData, initialStartTime]);

  const isFormValid = formData.project && formData.description && (formData.hours > 0 || formData.minutes > 0);

  const handleSubmit = () => {
    if (isFormValid && selectedDate) {
      onSubmit?.(formData, selectedDate);
      setFormData({
        project: '',
        description: '',
        hours: 0,
        minutes: 0,
        overtime: false,
        billable: false,
        startHour: 8,
        startMinute: 0
      });
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setFormData({
      project: '',
      description: '',
      hours: 0,
      minutes: 0,
      overtime: false,
      billable: false,
      startHour: 8,
      startMinute: 0
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const formatTime = (hour: number, minute: number) => {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  // Calculate End Time
  const getEndTime = () => {
    const startTotalMinutes = (formData.startHour || 0) * 60 + (formData.startMinute || 0);
    const durationMinutes = (formData.hours || 0) * 60 + (formData.minutes || 0);
    const endTotalMinutes = startTotalMinutes + durationMinutes;

    const endHour = Math.floor(endTotalMinutes / 60) % 24;
    const endMinute = endTotalMinutes % 60;

    return formatTime(endHour, endMinute);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancel}></div>

      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl max-w-xl w-11/12 max-h-screen flex flex-col">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Edit time entry' : 'Add time entry'}
            </h2>
            <button
              className="bg-none border-none text-2xl cursor-pointer text-gray-400 hover:text-gray-600 p-0 w-8 h-8 flex items-center justify-center transition-colors"
              onClick={handleCancel}
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 flex-1 overflow-y-auto">
            {/* Compact Time and Date Section */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-end gap-5">

                {/* Start Time Group */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">Start Time</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      className="w-14 px-2 py-2 border border-gray-300 rounded text-center font-medium text-lg focus:border-blue-500 focus:outline-none"
                      value={String(formData.startHour || 0).padStart(2, '0')}
                      onChange={(e) => setFormData({ ...formData, startHour: Math.min(23, Math.max(0, parseInt(e.target.value) || 0)) })}
                    />
                    <span className="text-gray-400 font-bold">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      className="w-14 px-2 py-2 border border-gray-300 rounded text-center font-medium text-lg focus:border-blue-500 focus:outline-none"
                      value={String(formData.startMinute || 0).padStart(2, '0')}
                      onChange={(e) => setFormData({ ...formData, startMinute: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)) })}
                    />
                  </div>
                </div>

                {/* Duration Group */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">Duration (hh:mm)</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      className="w-14 px-2 py-2 border border-gray-300 rounded text-center font-medium text-lg focus:border-blue-500 focus:outline-none"
                      value={String(formData.hours).padStart(2, '0')}
                      onChange={(e) => setFormData({ ...formData, hours: Math.max(0, parseInt(e.target.value) || 0) })}
                    />
                    <span className="text-gray-400 font-bold">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      className="w-14 px-2 py-2 border border-gray-300 rounded text-center font-medium text-lg focus:border-blue-500 focus:outline-none"
                      value={String(formData.minutes).padStart(2, '0')}
                      onChange={(e) => setFormData({ ...formData, minutes: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)) })}
                    />
                  </div>
                </div>

                {/* Info Group - Direct placement next to inputs */}
                <div className="flex items-center gap-4 pb-3 ml-2">
                  {/* Clock & Time Range */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <span style={{ fontSize: '1.2rem' }}>🕒</span>
                    <span className="font-semibold text-sm">
                      {formatTime(formData.startHour || 0, formData.startMinute || 0)}
                      {' - '}
                      {getEndTime()}
                    </span>
                  </div>

                  {/* Calendar & Date */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <span style={{ fontSize: '1.2rem' }}>📅</span>
                    <span className="font-semibold text-sm">
                      {selectedDate ? formatDate(selectedDate) : 'No date'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-sm resize-vertical min-h-20 placeholder-gray-400 transition-all focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                placeholder="What have you worked on?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Project Dropdown */}
            <div className="mb-6">
              <label htmlFor="project" className="block text-sm font-semibold text-gray-700 mb-2">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                id="project"
                className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-sm transition-all focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkboxes as Toggles */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.overtime}
                    onChange={(e) => setFormData({ ...formData, overtime: e.target.checked })}
                    className="hidden"
                  />
                  <span
                    className="relative w-11 h-6 bg-gray-300 rounded-full transition-colors flex-shrink-0"
                    style={formData.overtime ? { backgroundColor: '#3b82f6' } : {}}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all"
                      style={formData.overtime ? { left: '22px' } : {}}
                    ></span>
                  </span>
                  <span className="text-sm font-medium text-gray-700">Overtime</span>
                </label>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.billable}
                    onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                    className="hidden"
                  />
                  <span
                    className="relative w-11 h-6 bg-gray-300 rounded-full transition-colors flex-shrink-0"
                    style={formData.billable ? { backgroundColor: '#3b82f6' } : {}}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all"
                      style={formData.billable ? { left: '22px' } : {}}
                    ></span>
                  </span>
                  <span className="text-sm font-medium text-gray-700">Billable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-6 border-t border-gray-200 justify-end">
            <button
              className="bg-transparent text-blue-500 border-none font-semibold text-sm cursor-pointer hover:bg-gray-100 px-6 py-2.5 rounded transition-all"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className={`border-none rounded font-semibold text-sm transition-all px-6 py-2.5 ${isFormValid
                ? 'text-white cursor-pointer hover:bg-blue-600'
                : 'text-gray-500 cursor-not-allowed opacity-70'
                }`}
              style={{
                backgroundColor: isFormValid ? '#3b82f6' : '#d1d5db'
              }}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              {mode === 'edit' ? 'SAVE' : 'ADD'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTimeEntryDialog;
