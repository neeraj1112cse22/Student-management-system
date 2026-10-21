import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileImage,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Course, Section, Assignment } from '../types';
import { dataService } from '../services/dataService';
import { FilePreviewModal } from '../components/FilePreviewModal';

interface AssignmentPageProps {
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const AssignmentPage: React.FC<AssignmentPageProps> = ({ showToast }) => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState<Course>('B.Tech');
  const [section, setSection] = useState<Section>('A');
  const [description, setDescription] = useState('');

  // Selected file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview modal for existing assignments
  const [previewAssignment, setPreviewAssignment] = useState<Assignment | null>(null);

  // List of assignments
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    dataService.getAssignments()
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  const validateAndProcessFile = (file: File) => {
    setFileError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(ext) && !allowedMimeTypes.includes(file.type)) {
      setFileError('Unsupported file type. Please upload a PDF, JPG, JPEG, or PNG file.');
      return false;
    }

    // Size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB institutional upload limit.');
      return false;
    }

    setSelectedFile(file);

    // Read for preview
    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileDataUrl(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFileError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFileError('Assignment title is required.');
      return;
    }

    if (!selectedFile) {
      setFileError('Please select or drag-and-drop a curriculum file before saving.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = dataService.addAssignment({
        title: trimmedTitle,
        course,
        section,
        description: description.trim() || undefined,
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
        fileType: selectedFile.type || 'application/octet-stream',
        fileDataUrl: fileDataUrl || undefined,
      });

      setIsSubmitting(false);

      if (res.success) {
        showToast('Assignment saved successfully', 'success');

        // Refresh list
        setAssignments(dataService.getAssignments());

        // Reset form
        setTitle('');
        setDescription('');
        handleRemoveFile();
      } else {
        setFileError('Failed to persist assignment. Please retry.');
      }
    }, 300);
  };

  return (
    <div className="space-y-7 animate-in fade-in">
      {/* File Preview Modal */}
      <FilePreviewModal
        assignment={previewAssignment}
        onClose={() => setPreviewAssignment(null)}
      />

      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Course Assignment Management
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload and publish course assignments with attached problem sets, rubrics, and downloadable files.
        </p>
      </div>

      {/* Main Upload Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
            <UploadCloud className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              New Assignment Publication
            </h3>
            <p className="text-xs text-slate-500">
              Target student cohorts by program and section.
            </p>
          </div>
        </div>

        {fileError && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <span className="leading-relaxed font-medium">{fileError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Assignment Title */}
          <div>
            <label
              htmlFor="assignmentTitle"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Assignment Title
            </label>
            <input
              id="assignmentTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Module 4: Relational Query Optimization & Execution Trees"
              required
              className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
            />
          </div>

          {/* Course and Section Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="asgCourse"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Target Degree Program
              </label>
              <select
                id="asgCourse"
                value={course}
                onChange={(e) => setCourse(e.target.value as Course)}
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                <option value="M.Tech">M.Tech (Master of Technology)</option>
                <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                <option value="BBA">BBA (Bachelor of Business Administration)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="asgSection"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Classroom Section
              </label>
              <select
                id="asgSection"
                value={section}
                onChange={(e) => setSection(e.target.value as Section)}
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>
          </div>

          {/* Optional Description */}
          <div>
            <label
              htmlFor="asgDescription"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Description / Instructions{' '}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="asgDescription"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide submission guidelines, due date requirements, or deliverables..."
              className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors resize-none"
            />
          </div>

          {/* Drag & Drop Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Course Material Attachment (PDF, JPG, JPEG, PNG)
            </label>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/70'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
                  <UploadCloud className="w-6 h-6 stroke-[1.8]" />
                </div>

                <div className="text-xs font-semibold text-slate-800">
                  Drag and drop coursework file here, or{' '}
                  <span className="text-blue-600 underline font-bold">browse file</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supported formats: PDF, JPG, JPEG, PNG (Maximum size: 10MB)
                </p>
              </div>
            ) : (
              /* File Selected Info & Remove/Replace actions */
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    {selectedFile.type.includes('pdf') ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <FileImage className="w-5 h-5" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{selectedFile.type || 'Document'}</span>
                      <span>·</span>
                      <span className="font-mono-numbers">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace File</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/png,image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submission Bar */}
          <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setDescription('');
                handleRemoveFile();
              }}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg cursor-pointer transition-colors"
            >
              Clear Form
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
                  <span>Save Assignment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Published Assignments Directory */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Published Course Materials
            </h3>
            <p className="text-xs text-slate-500">
              Active assignments distributed across student cohorts.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500">
            {assignments.length} Total Assignments
          </span>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            No assignments recorded yet. Use the form above to upload coursework.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between hover:border-blue-300 hover:bg-slate-50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="font-semibold text-blue-700">
                      {asg.course} — Sec {asg.section}
                    </span>
                    <span className="font-mono-numbers">
                      {new Date(asg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1.5 leading-snug">
                    {asg.title}
                  </h4>
                  {asg.description && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-3">
                      {asg.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600 truncate max-w-[170px]">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{asg.fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewAssignment(asg)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
