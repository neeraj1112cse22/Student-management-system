import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Student } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  student: Student | null;
  onCancel: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  student,
  onCancel,
  onConfirm,
  isProcessing = false,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-xl transition-transform animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3
                id="modal-title"
                className="text-base font-bold text-slate-900 tracking-tight"
              >
                Confirm Record Deletion
              </h3>
              <p className="text-xs text-slate-500">
                Permanent database removal
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Are you sure you want to delete the academic record for this student? This action cannot be undone.
          </p>

          <div className="space-y-2 border-t border-slate-200/80 pt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-900">{student.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Roll Number:</span>
              <span className="font-mono-numbers font-semibold text-slate-900 tracking-wider">
                {student.rollNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Program & Section:</span>
              <span className="text-slate-800 font-medium">
                {student.course} — Sec {student.section}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registered Email:</span>
              <span className="text-slate-700">{student.email}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            {isProcessing ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
