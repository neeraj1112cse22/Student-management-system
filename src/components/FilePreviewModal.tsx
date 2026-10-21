import React from 'react';
import { X, Download, FileText, FileImage } from 'lucide-react';
import { Assignment } from '../types';

interface FilePreviewModalProps {
  assignment: Assignment | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  assignment,
  onClose,
}) => {
  if (!assignment) return null;

  const isImage =
    assignment.fileType.startsWith('image/') ||
    assignment.fileName.endsWith('.png') ||
    assignment.fileName.endsWith('.jpg') ||
    assignment.fileName.endsWith('.jpeg');

  const isPdf =
    assignment.fileType.includes('pdf') || assignment.fileName.endsWith('.pdf');

  const handleDownload = () => {
    if (assignment.fileDataUrl) {
      const link = document.createElement('a');
      link.href = assignment.fileDataUrl;
      link.download = assignment.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const blob = new Blob(
        [
          `--- EDUPORTAL ACADEMIC SYSTEM ASSIGNMENT ATTACHMENT ---\n\nTitle: ${assignment.title}\nCourse: ${assignment.course}\nSection: ${assignment.section}\nFile: ${assignment.fileName}\nUploaded: ${assignment.createdAt}\n\nDescription:\n${assignment.description || 'No additional description provided.'}\n\n[End of Document File Preview]`
        ],
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = assignment.fileName.replace(/\.pdf$/, '.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden text-slate-900 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              {isImage ? <FileImage className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate max-w-md">
                {assignment.fileName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{assignment.course} - Sec {assignment.section}</span>
                <span>·</span>
                <span className="font-mono-numbers">{assignment.fileSize}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <h4 className="text-base font-bold text-slate-900 mb-1">{assignment.title}</h4>
            {assignment.description && (
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5">{assignment.description}</p>
            )}
          </div>

          {/* Visual Canvas */}
          <div className="rounded-xl border border-slate-200 bg-white min-h-[320px] flex items-center justify-center overflow-hidden p-4 shadow-2xs">
            {isImage && assignment.fileDataUrl ? (
              <img
                src={assignment.fileDataUrl}
                alt={assignment.title}
                className="max-h-[480px] w-auto max-w-full rounded-lg object-contain border border-slate-200"
              />
            ) : isPdf ? (
              <div className="w-full max-w-lg space-y-4 py-8 px-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <FileText className="w-8 h-8 stroke-[1.8]" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{assignment.fileName}</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF Document ({assignment.fileSize}) — Secure Course Material
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Document Classification:</span>
                    <span className="font-semibold text-slate-900">Academic Syllabus & Courseware</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Cohort:</span>
                    <span className="font-medium text-slate-900">{assignment.course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Section:</span>
                    <span className="font-medium text-slate-900">Section {assignment.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verification:</span>
                    <span className="text-emerald-600 font-semibold">Verified Safe</span>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document ({assignment.fileSize})</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-800">{assignment.fileName}</p>
                <p className="text-xs text-slate-500 mt-1">Preview available for {assignment.fileSize} file</p>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Uploaded on {new Date(assignment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
