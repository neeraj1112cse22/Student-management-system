import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  ClipboardCheck,
  FileText,
  UserMinus,
  GraduationCap,
  X,
  CalendarCheck,
  BookOpenCheck,
} from 'lucide-react';
import { AdminView, UserSession } from '../types';

interface SidebarProps {
  currentView: AdminView;
  onSelectView: (view: AdminView) => void;
  session: UserSession;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenStudentModal?: (view: 'attendance' | 'assignment') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  session,
  isOpenMobile,
  onCloseMobile,
  onOpenStudentModal,
}) => {
  const isAdmin = session.role === 'admin';

  const adminNavItems: { id: AdminView; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-4 h-4 stroke-[2]" />,
      desc: 'System summary & metrics',
    },
    {
      id: 'add-student',
      label: 'Add Student',
      icon: <UserPlus className="w-4 h-4 stroke-[2]" />,
      desc: 'Register new enrollment',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <ClipboardCheck className="w-4 h-4 stroke-[2]" />,
      desc: 'Record & audit presence',
    },
    {
      id: 'assignment',
      label: 'Assignment',
      icon: <FileText className="w-4 h-4 stroke-[2]" />,
      desc: 'Course materials & files',
    },
    {
      id: 'delete-student',
      label: 'Delete Student Record',
      icon: <UserMinus className="w-4 h-4 stroke-[2]" />,
      desc: 'Purge & archive profile',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 md:w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                EduPortal
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 block">
                Student Management
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {isAdmin ? (
            <div>
              <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                Administration
              </div>
              <nav className="space-y-1" aria-label="Admin Navigation">
                {adminNavItems.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectView(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 truncate">
                        <div className="font-semibold tracking-tight">
                          {item.label}
                        </div>
                        <div
                          className={`text-[11px] truncate ${
                            isActive ? 'text-blue-600/80' : 'text-slate-400'
                          }`}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          ) : (
            <div>
              <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                Student Portal
              </div>
              <nav className="space-y-1" aria-label="Student Navigation">
                <button
                  type="button"
                  onClick={() => {
                    onSelectView('dashboard');
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                    <LayoutDashboard className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Portal Dashboard</div>
                    <div className="text-[11px] text-slate-500">Profile & quick cards</div>
                  </div>
                </button>

                {onOpenStudentModal && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenStudentModal('attendance');
                        onCloseMobile();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                        <CalendarCheck className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">My Attendance</div>
                        <div className="text-[11px] text-slate-400">Today & history logs</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onOpenStudentModal('assignment');
                        onCloseMobile();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                        <BookOpenCheck className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">My Assignments</div>
                        <div className="text-[11px] text-slate-400">Coursework & files</div>
                      </div>
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium">System Status</span>
              <span className="font-mono text-emerald-600 text-[11px] font-semibold">Online</span>
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-1 truncate">
              {session.email || session.rollNumber || 'eduportal.edu'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
