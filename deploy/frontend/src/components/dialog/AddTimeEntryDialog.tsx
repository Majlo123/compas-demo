import React, { FC, useState, useEffect } from 'react';
import './add-time-entry-dialog.css';

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
      <div className="modal-overlay" onClick={handleCancel}></div>

      {/* Dialog */}
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title">Add time entry</h2>
            <button
              className="modal-close-btn"
              onClick={handleCancel}
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Time and Date Section */}
            <div className="time-date-section">
              <h3 className="section-title">Time and date</h3>
              <div className="time-date-row">
                <div className="time-display">
                  {formatTime(formData.hours, formData.minutes)}
                </div>
                <div className="time-input-group">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    className="time-input"
                    value={String(formData.hours).padStart(2, '0')}
                    onChange={(e) => setFormData({ ...formData, hours: Math.max(0, parseInt(e.target.value) || 0) })}
                  />
                  <span className="time-separator">-</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="time-input"
                    value={String(formData.minutes).padStart(2, '0')}
                    onChange={(e) => setFormData({ ...formData, minutes: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)) })}
                  />
                </div>
                <span className="date-picker-icon">📅</span>
                <div className="date-display">
                  {selectedDate ? formatDate(selectedDate) : 'No date'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                className="form-input textarea"
                placeholder="What have you worked on?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Project Dropdown */}
            <div className="form-group">
              <label htmlFor="project" className="form-label">
                Project <span className="required">*</span>
              </label>
              <select
                id="project"
                className="form-input"
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
            <div className="toggle-section">
              <div className="toggle-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={formData.overtime}
                    onChange={(e) => setFormData({ ...formData, overtime: e.target.checked })}
                  />
                  <span className="toggle-switch"></span>
                  <span className="toggle-text">Overtime</span>
                </label>
              </div>

              <div className="toggle-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={formData.billable}
                    onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                  />
                  <span className="toggle-switch"></span>
                  <span className="toggle-text">Billable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              className="btn btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
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
