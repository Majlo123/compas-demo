import React, { FC, useState, useEffect } from 'react';

type TimeEntryFormData = {
  project: string;
  description: string;
  hours: number;
  minutes: number;
  overtime: boolean;
  billable: boolean;
};

type Props = {
  isOpen: boolean;
  selectedDate?: Date;
  projects?: Array<{ id: string; name: string }>;
  onSubmit?: (data: TimeEntryFormData, date: Date) => void;
  onCancel?: () => void;
};

const AddTimeEntryDialog: FC<Props> = ({
  isOpen,
  selectedDate,
  projects = [],
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<TimeEntryFormData>({
    project: '',
    description: '',
    hours: 0,
    minutes: 0,
    overtime: false,
    billable: false
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        project: '',
        description: '',
        hours: 0,
        minutes: 0,
        overtime: false,
        billable: false
      });
    }
  }, [isOpen]);

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
        billable: false
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
      billable: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const formatTime = (hours: number, minutes: number) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
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
            <h2 className="text-xl font-semibold text-gray-900">Add time entry</h2>
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
            {/* Time and Date Section */}
            <div className="mb-8 pb-6 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">Time and date</h3>
              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold text-gray-900 min-w-max">
                  {formatTime(formData.hours, formData.minutes)}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    className="w-12 px-2 py-2 border border-gray-300 rounded text-center font-medium text-sm"
                    value={String(formData.hours).padStart(2, '0')}
                    onChange={(e) => setFormData({ ...formData, hours: Math.max(0, parseInt(e.target.value) || 0) })}
                  />
                  <span className="text-gray-300 mx-1">-</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="w-12 px-2 py-2 border border-gray-300 rounded text-center font-medium text-sm"
                    value={String(formData.minutes).padStart(2, '0')}
                    onChange={(e) => setFormData({ ...formData, minutes: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)) })}
                  />
                </div>
                <span className="text-lg cursor-pointer hover:opacity-70 transition-opacity">📅</span>
                <div className="text-sm font-medium text-gray-700 min-w-max">
                  {selectedDate ? formatDate(selectedDate) : 'No date'}
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
              ADD
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTimeEntryDialog;
