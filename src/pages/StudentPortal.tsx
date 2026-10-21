import React, { useState } from 'react';
import {
  CalendarCheck,
  BookOpenCheck,
  User,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  FileText,
  ArrowRight,
  X,
} from 'lucide-react';
import { Student, StudentModalView, Assignment } from '../types';
import { dataService, getTodayDateString } from '../services/dataService';
import { FilePreviewModal } from '../components/FilePreviewModal';

interface StudentPortalProps {
  student: Student;
  activeModal: StudentModalView;
  onSetModal: (modal: StudentModalView) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  activeModal,
  onSetModal,
}) => {
  // Query attendance stats for this student from genuine database
  const attendanceStats = dataService.getStudentAttendanceStats(student.rollNumber);

  // Query assignments filtered strictly to student's course and section
  const studentAssignments = dataService.getAssignmentsForStudent(
    student.course,
    student.section
  );

  // Preview modal for assignment file viewing
  const [selectedAssignmentForPreview, setSelectedAssignmentForPreview] =
    useState<Assignment | null>(null);

  const todayStr = getTodayDateString();
  const isTodayPresent = attendanceStats.todayRecord?.status === 'Present';
  const hasTodayMarked = !!attendanceStats.todayRecord;

  return (
    <div className="space-y-7 animate-in fade-in">
      {/* File Preview Modal */}
      <FilePreviewModal
        assignment={selectedAssignmentForPreview}
        onClose={() => setSelectedAssignmentForPreview(null)}
      />

      {/* Student Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
              <User className="w-8 h-8 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {student.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="font-mono-numbers text-slate-900 font-semibold tracking-wide">
                  {student.rollNumber}
                </span>
                <span>·</span>
                <span className="text-blue-700 font-medium">
                  {student.course} — Section {student.section}
                </span>
                <span>·</span>
                <span className="text-slate-500">{student.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Real-Time Attendance Health Box */}
          <div className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-5">
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Overall Attendance
              </div>
              <div className="font-mono-numbers text-2xl font-bold text-slate-900 tracking-tight">
                {attendanceStats.percentage}%
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Today's Status
              </div>
              <div className="text-xs font-semibold mt-0.5">
                {hasTodayMarked ? (
                  isTodayPresent ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                      <XCircle className="w-3.5 h-3.5" /> Absent
                    </span>
                  )
                ) : (
                  <span className="text-slate-400">Pending Log</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Dashboard Heading */}
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Student Academic Portal
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Select an academic card to review verified attendance history or download active coursework materials.
        </p>
      </div>

      {/* Two Prominent Cards: 1. Show My Attendance 2. Show My Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Show My Attendance */}
        <div
          onClick={() => onSetModal('attendance')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md p-7 rounded-2xl flex flex-col justify-between cursor-pointer transition-all group shadow-xs"
        >
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <CalendarCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-xs font-mono font-medium text-slate-400">
                MODULE 01
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Show My Attendance
            </h4>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Attendance Records & Session Logs
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
              Review today's verified attendance status, total classroom sessions attended, absence history log, and cumulative percentage calculation.
            </p>

            {/* Quick in-card stat */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Sessions Attended:</span>
              <span className="font-mono-numbers text-slate-900 font-bold">
                {attendanceStats.presentCount} / {attendanceStats.totalSessions} Days Present
              </span>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
              Launch Attendance Register
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Card 2: Show My Assignment */}
        <div
          onClick={() => onSetModal('assignment')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md p-7 rounded-2xl flex flex-col justify-between cursor-pointer transition-all group shadow-xs"
        >
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <BookOpenCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-xs font-mono font-medium text-slate-400">
                MODULE 02
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Show My Assignment
            </h4>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Coursework & Material Files
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
              Access coursework assigned strictly to {student.course} Section {student.section}. Includes inline PDF previews, diagram inspectors, and direct downloads.
            </p>

            {/* Quick in-card stat */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Available Tasks:</span>
              <span className="font-mono-numbers text-slate-900 font-bold">
                {studentAssignments.length} Assignments Published
              </span>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
              View Active Assignments
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Show My Attendance View */}
      {activeModal === 'attendance' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[88vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <CalendarCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    My Attendance Record & History
                  </h3>
                  <div className="text-xs text-slate-500">
                    {student.name} · {student.rollNumber} ({student.course} Sec {student.section})
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSetModal('none')}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                aria-label="Close attendance modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Today's Status Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Today's Session ({todayStr})</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {hasTodayMarked ? (
                      isTodayPresent ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 stroke-[2.2]" /> Present in Class
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-4 h-4 stroke-[2.2]" /> Absent
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400">Unmarked / Session in Progress</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Cumulative Attendance</div>
                  <div className="font-mono-numbers text-2xl font-bold text-blue-600">
                    {attendanceStats.percentage}%
                  </div>
                </div>
              </div>

              {/* Attendance Breakdown Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">Total Sessions</div>
                  <div className="font-mono-numbers text-xl font-bold text-slate-900 mt-1">
                    {attendanceStats.totalSessions}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
                  <div className="text-[11px] text-emerald-800 font-semibold uppercase">Present</div>
                  <div className="font-mono-numbers text-xl font-bold text-emerald-700 mt-1">
                    {attendanceStats.presentCount}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-100 text-center">
                  <div className="text-[11px] text-red-800 font-semibold uppercase">Absent</div>
                  <div className="font-mono-numbers text-xl font-bold text-red-700 mt-1">
                    {attendanceStats.absentCount}
                  </div>
                </div>
              </div>

              {/* History Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Historical Session Logs
                </h4>

                {attendanceStats.history.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No attendance logs registered yet for this student.
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                          <th className="py-2.5 px-4 font-semibold">Date</th>
                          <th className="py-2.5 px-4 font-semibold">Course & Section</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attendanceStats.history.map((record) => {
                          const isRecPresent = record.status === 'Present';
                          return (
                            <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-4 font-mono-numbers text-slate-900 font-medium">
                                {record.date}
                              </td>
                              <td className="py-2.5 px-4 text-slate-600">
                                {record.course} - Section {record.section}
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                {isRecPresent ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Present</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Absent</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => onSetModal('none')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                Close Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Show My Assignment View */}
      {activeModal === 'assignment' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[88vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <BookOpenCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Assigned Coursework ({student.course} — Section {student.section})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assignments strictly filtered to your enrolled curriculum cohort.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSetModal('none')}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                aria-label="Close assignments modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {studentAssignments.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-900">
                    No Assignments Available
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    There are no assignments published for {student.course} Section {student.section} at this time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {studentAssignments.map((asg) => (
                    <div
                      key={asg.id}
                      className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-colors shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-[11px] text-slate-400 font-mono-numbers">
                            Published {new Date(asg.createdAt).toLocaleDateString()}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                            {asg.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedAssignmentForPreview(asg)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Preview</span>
                          </button>
                        </div>
                      </div>

                      {asg.description && (
                        <p className="text-xs text-slate-600 leading-relaxed mb-3.5">
                          {asg.description}
                        </p>
                      )}

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 overflow-hidden text-slate-600">
                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate font-medium">{asg.fileName}</span>
                          <span className="text-slate-400 font-mono-numbers shrink-0">
                            ({asg.fileSize})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedAssignmentForPreview(asg)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download / Inspect</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => onSetModal('none')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                Close Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
