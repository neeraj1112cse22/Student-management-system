import React from 'react';
import {
  Users,
  ClipboardCheck,
  FileText,
  UserPlus,
  UserMinus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AdminView, Student } from '../types';
import { dataService } from '../services/dataService';

interface AdminDashboardProps {
  onNavigate: (view: AdminView) => void;
  students: Student[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  students,
}) => {
  const stats = dataService.getAdminStats();

  const featureCards = [
    {
      id: 'add-student' as AdminView,
      title: '1. Add Student',
      subtitle: 'Student Registration & Enrollment',
      description:
        'Register new student entries with name, roll number, institutional email, course selection, and assigned section.',
      icon: <UserPlus className="w-5 h-5 stroke-[2]" />,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      actionLabel: 'Launch Enrollment Form',
    },
    {
      id: 'attendance' as AdminView,
      title: '2. Attendance',
      subtitle: 'Daily Roster & Verification',
      description:
        'Filter cohort by program, section, and date. Audit presence, mark daily records, and commit updates to database.',
      icon: <ClipboardCheck className="w-5 h-5 stroke-[2]" />,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      actionLabel: 'Open Attendance Register',
    },
    {
      id: 'assignment' as AdminView,
      title: '3. Assignment',
      subtitle: 'Curriculum & Course Materials',
      description:
        'Publish coursework with title, description, and attached PDF/image materials. Manage downloadable assets.',
      icon: <FileText className="w-5 h-5 stroke-[2]" />,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      actionLabel: 'Manage Course Assignments',
    },
    {
      id: 'delete-student' as AdminView,
      title: '4. Delete Student Record',
      subtitle: 'Student Roster De-enrollment',
      description:
        'Searchable registry directory. Safely remove duplicate or graduated student profiles with confirmation audits.',
      icon: <UserMinus className="w-5 h-5 stroke-[2]" />,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      actionLabel: 'View Removal Directory',
      isDestructive: true,
    },
  ];

  // Course distribution counts from actual database
  const courseCounts = {
    'B.Tech': students.filter((s) => s.course === 'B.Tech').length,
    'M.Tech': students.filter((s) => s.course === 'M.Tech').length,
    'BCA': students.filter((s) => s.course === 'BCA').length,
    'BBA': students.filter((s) => s.course === 'BBA').length,
  };

  return (
    <div className="space-y-7 animate-in fade-in">
      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Operations Console
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management for student cohorts, daily attendance tracking, and curriculum materials.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
            <span className="text-slate-400">Academic Year:</span>
            <span className="font-semibold text-slate-900">2026–2027</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards with genuine database metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Students */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Students
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono-numbers text-3xl font-bold text-slate-900 tracking-tight">
            {stats.totalStudents}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Enrolled Students</span>
            <span>·</span>
            <span className="text-blue-600 font-medium">4 Degree Programs</span>
          </div>
        </div>

        {/* KPI 2: Attendance Records */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Attendance Records
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono-numbers text-3xl font-bold text-slate-900 tracking-tight">
            {stats.totalAttendanceRecords}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Total Logs</span>
            <span>·</span>
            <span className="text-emerald-700 font-medium font-mono-numbers">{stats.todayMarkedCount} marked today</span>
          </div>
        </div>

        {/* KPI 3: Total Assignments */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Assignments
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono-numbers text-3xl font-bold text-slate-900 tracking-tight">
            {stats.totalAssignments}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Published Tasks</span>
            <span>·</span>
            <span className="text-indigo-600 font-medium">PDF & Images</span>
          </div>
        </div>

        {/* KPI 4: Today Attendance Ratio */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Today's Attendance
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono-numbers text-3xl font-bold text-slate-900 tracking-tight">
            {stats.todayPresentRate}%
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-emerald-600 font-semibold">Active Session</span>
            <span>·</span>
            <span>Attendance Rate</span>
          </div>
        </div>
      </div>

      {/* Four Primary Feature Cards */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Core Academic Modules
          </h3>
          <span className="text-xs text-slate-400">
            Quick Navigation Actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between mb-3.5">
                  <div className={`p-2.5 rounded-xl border ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-400">
                    0{card.title.charAt(0)}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h4>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {card.subtitle}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                  {card.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  {card.actionLabel}
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Distribution & Enrollment Registry Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
              Enrollment by Degree Program
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Student cohort division across curriculum tracks
            </p>

            <div className="space-y-3.5">
              {(Object.entries(courseCounts) as [string, number][]).map(([course, count]) => {
                const total = students.length || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={course} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{course}</span>
                      <span className="font-mono-numbers text-slate-500">
                        {count} students ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sections: A, B, C, D</span>
            <button
              onClick={() => onNavigate('add-student')}
              className="text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer"
            >
              + Add Student
            </button>
          </div>
        </div>

        {/* Recently Added Students */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:col-span-2 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Student Enrollees
              </h4>
              <p className="text-xs text-slate-500">
                Active students registered in database repository
              </p>
            </div>
            <button
              onClick={() => onNavigate('delete-student')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
            >
              View Full Directory
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 bg-slate-50/50">
                  <th className="py-2.5 px-3 font-semibold">Roll No</th>
                  <th className="py-2.5 px-3 font-semibold">Name</th>
                  <th className="py-2.5 px-3 font-semibold">Course</th>
                  <th className="py-2.5 px-3 font-semibold">Section</th>
                  <th className="py-2.5 px-3 font-semibold">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.slice(0, 5).map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono-numbers text-slate-900 font-semibold">
                      {student.rollNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{student.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{student.course}</td>
                    <td className="py-2.5 px-3 text-slate-500">Sec {student.section}</td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[150px]">
                      {student.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
