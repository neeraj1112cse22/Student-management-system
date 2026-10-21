import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Check,
  X,
  Search,
  Filter,
  Save,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Course, Section, Student, AttendanceStatus, AttendanceRecord } from '../types';
import { dataService, getTodayDateString } from '../services/dataService';

interface AttendancePageProps {
  students: Student[];
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  students,
  showToast,
}) => {
  // Filters
  const [selectedCourse, setSelectedCourse] = useState<Course>('B.Tech');
  const [selectedSection, setSelectedSection] = useState<Section>('A');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Active query state
  const [hasQueried, setHasQueried] = useState<boolean>(true);
  const [activeCourse, setActiveCourse] = useState<Course>('B.Tech');
  const [activeSection, setActiveSection] = useState<Section>('A');
  const [activeDate, setActiveDate] = useState<string>(getTodayDateString());

  // Attendance status mapping in memory: studentId -> AttendanceStatus
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Filtered student list for active parameters
  const cohortStudents = students.filter(
    (s) => s.course === activeCourse && s.section === activeSection
  );

  // Load existing records from database for active cohort & date
  const loadAttendanceForCurrent = (course: Course, sec: Section, date: string) => {
    const existing = dataService.getAttendanceForSectionDate(course, sec, date);
    const newMap: Record<string, AttendanceStatus> = {};

    const currentCohort = students.filter((s) => s.course === course && s.section === sec);

    currentCohort.forEach((st) => {
      const match = existing.find((e) => e.studentId === st.id || e.rollNumber === st.rollNumber);
      if (match) {
        newMap[st.id] = match.status;
      } else {
        newMap[st.id] = 'Present';
      }
    });

    setAttendanceMap(newMap);
  };

  useEffect(() => {
    loadAttendanceForCurrent(activeCourse, activeSection, activeDate);
  }, [activeCourse, activeSection, activeDate, students]);

  const handleShowRecords = () => {
    setActiveCourse(selectedCourse);
    setActiveSection(selectedSection);
    setActiveDate(selectedDate);
    setHasQueried(true);
    loadAttendanceForCurrent(selectedCourse, selectedSection, selectedDate);
  };

  const handleToggleStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    cohortStudents.forEach((st) => {
      updated[st.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    if (cohortStudents.length === 0) {
      showToast('No students enrolled in this cohort to save.', 'error');
      return;
    }

    setIsSaving(true);

    const recordsToSave: AttendanceRecord[] = cohortStudents.map((st) => ({
      id: `att-${st.id}-${activeDate}`,
      studentId: st.id,
      rollNumber: st.rollNumber,
      studentName: st.name,
      course: activeCourse,
      section: activeSection,
      date: activeDate,
      status: attendanceMap[st.id] || 'Present',
      updatedAt: new Date().toISOString(),
    }));

    setTimeout(() => {
      dataService.saveAttendanceBatch(recordsToSave);
      setIsSaving(false);
      showToast('Attendance records saved successfully', 'success');
    }, 300);
  };

  // Stats calculation
  const totalInCohort = cohortStudents.length;
  const presentCount = cohortStudents.filter(
    (st) => (attendanceMap[st.id] || 'Present') === 'Present'
  ).length;
  const absentCount = totalInCohort - presentCount;
  const percentage = totalInCohort > 0 ? Math.round((presentCount / totalInCohort) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Attendance Register
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Record, verify, and persist daily student classroom presence across academic programs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={isSaving || cohortStudents.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Committing...' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Cohort & Date Selection</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Course dropdown */}
          <div>
            <label
              htmlFor="filterCourse"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Degree Program
            </label>
            <select
              id="filterCourse"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value as Course)}
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
              <option value="M.Tech">M.Tech (Master of Technology)</option>
              <option value="BCA">BCA (Bachelor of Computer Applications)</option>
              <option value="BBA">BBA (Bachelor of Business Administration)</option>
            </select>
          </div>

          {/* Section dropdown */}
          <div>
            <label
              htmlFor="filterSection"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Section
            </label>
            <select
              id="filterSection"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as Section)}
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>

          {/* Date picker */}
          <div>
            <label
              htmlFor="attendanceDate"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Session Date
            </label>
            <input
              id="attendanceDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Primary Button */}
          <div>
            <button
              type="button"
              onClick={handleShowRecords}
              className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Show Student Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cohort Stats & Batch Actions Bar */}
      {hasQueried && cohortStudents.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
              <span className="text-slate-400 font-medium">Selected Cohort:</span>
              <span>{activeCourse} — Sec {activeSection}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Total Enrolled:</span>
              <span className="font-mono-numbers text-slate-900 font-bold">
                {totalInCohort}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Present:</span>
              <span className="font-mono-numbers text-emerald-600 font-bold">
                {presentCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Absent:</span>
              <span className="font-mono-numbers text-red-600 font-bold">
                {absentCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Rate:</span>
              <span className="font-mono-numbers text-blue-600 font-bold">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Quick Mark All Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleMarkAll('Present')}
              className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Mark All Present</span>
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Absent')}
              className="px-2.5 py-1 text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {cohortStudents.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-900">
              No Student Records Found
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No students are currently enrolled under {activeCourse} - Section {activeSection}.
              Use the Add Student module to register students in this cohort.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    #
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    Roll Number
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    Student Name
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    Email Address
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">
                    Toggle Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cohortStudents.map((student, index) => {
                  const currentStatus = attendanceMap[student.id] || 'Present';
                  const isPresent = currentStatus === 'Present';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-400 font-mono-numbers">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-mono-numbers font-semibold text-slate-900 tracking-wide">
                        {student.rollNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {student.email}
                      </td>
                      <td className="py-3 px-4">
                        {/* Status Label with text & icon */}
                        {isPresent ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Present</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Absent</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {/* Segmented Present / Absent Toggle Buttons */}
                        <div className="inline-flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student.id, 'Present')}
                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                              isPresent
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            aria-label={`Mark ${student.name} as Present`}
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>Present</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student.id, 'Absent')}
                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                              !isPresent
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            aria-label={`Mark ${student.name} as Absent`}
                          >
                            <X className="w-3 h-3 stroke-[2.5]" />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {cohortStudents.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Showing {cohortStudents.length} student records for session date {activeDate}
            </span>
            <button
              type="button"
              onClick={handleSaveAttendance}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Attendance'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
