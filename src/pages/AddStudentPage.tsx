import React, { useState } from 'react';
import { UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Course, Section, Student } from '../types';
import { dataService } from '../services/dataService';

interface AddStudentPageProps {
  onBack: () => void;
  onStudentAdded: (student: Student) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const AddStudentPage: React.FC<AddStudentPageProps> = ({
  onBack,
  onStudentAdded,
  showToast,
}) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState<Course>('B.Tech');
  const [section, setSection] = useState<Section>('A');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form field trims
    const trimmedName = name.trim();
    const trimmedRoll = rollNumber.trim().toUpperCase();
    const trimmedEmail = email.trim();

    // Validations
    if (!trimmedName) {
      setValidationError('Student name is required.');
      return;
    }
    if (!trimmedRoll) {
      setValidationError('Roll number is required.');
      return;
    }
    if (!trimmedEmail) {
      setValidationError('Institutional email is required.');
      return;
    }

    // Email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setValidationError('Please enter a valid email address format.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = dataService.addStudent({
        name: trimmedName,
        rollNumber: trimmedRoll,
        email: trimmedEmail,
        course,
        section,
      });

      setIsSubmitting(false);

      if (!res.success) {
        setValidationError(res.error || 'Failed to add student record.');
        showToast(res.error || 'Failed to add student record.', 'error');
        return;
      }

      if (res.student) {
        onStudentAdded(res.student);
        // Exact requirement
        showToast('Student record saved successfully', 'success');

        // Reset form
        setName('');
        setRollNumber('');
        setEmail('');
      }
    }, 250);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
      {/* Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs text-slate-400 font-mono">
          FORM-REF: ENROLL-01
        </span>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Add Student Record
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Create and enroll a new student profile in the official institutional directory.
        </p>
      </div>

      {/* Main White Clean Form Surface */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
            <UserPlus className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Enrollment Information
            </h3>
            <p className="text-xs text-slate-500">
              All fields are required to maintain database schema compliance.
            </p>
          </div>
        </div>

        {validationError && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <span className="leading-relaxed font-medium">{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student Name */}
          <div>
            <label
              htmlFor="studentName"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Student Name
            </label>
            <input
              id="studentName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Jonathan Sterling"
              required
              className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Full legal name as registered on identification documents.
            </p>
          </div>

          {/* Roll Number and Email (2-Column) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="rollNumber"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Roll Number
              </label>
              <input
                id="rollNumber"
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g., BT202407"
                required
                className="w-full px-3.5 py-2.5 text-xs font-mono-numbers text-slate-900 bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors uppercase tracking-wider"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Must be unique across university database.
              </p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Institutional Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., j.sterling@eduportal.edu"
                required
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used for grade alerts and official notices.
              </p>
            </div>
          </div>

          {/* Course and Section Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="course"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Degree Program
              </label>
              <select
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value as Course)}
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer"
              >
                <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                <option value="M.Tech">M.Tech (Master of Technology)</option>
                <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                <option value="BBA">BBA (Bachelor of Business Administration)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="section"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Classroom Section
              </label>
              <select
                id="section"
                value={section}
                onChange={(e) => setSection(e.target.value as Section)}
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Writing to Database...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                  <span>Save Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
