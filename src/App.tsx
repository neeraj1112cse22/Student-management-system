/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSession, AdminView, Student, StudentModalView } from './types';
import { dataService } from './services/dataService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AddStudentPage } from './pages/AddStudentPage';
import { AttendancePage } from './pages/AttendancePage';
import { AssignmentPage } from './pages/AssignmentPage';
import { DeleteStudentPage } from './pages/DeleteStudentPage';
import { StudentPortal } from './pages/StudentPortal';

export default function App() {
  // Session state: null means logged out
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('eduportal_session_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to admin for immediate exploration
    return {
      role: 'admin',
      name: 'Dr. Arthur Sterling',
      email: 'admin@eduportal.edu',
    };
  });

  // Current view in admin panel
  const [adminView, setAdminView] = useState<AdminView>('dashboard');

  // Student active modal
  const [studentModal, setStudentModal] = useState<StudentModalView>('none');

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active students list synchronized with dataService
  const [students, setStudents] = useState<Student[]>(() =>
    dataService.getStudents()
  );

  // Toast notifications
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    localStorage.setItem('eduportal_session_v2', JSON.stringify(newSession));
    setAdminView('dashboard');
    setStudentModal('none');
    showToast(`Signed in successfully as ${newSession.name}`, 'success');
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('eduportal_session_v2');
    showToast('Signed out of EduPortal', 'info');
  };

  const handleSwitchDemoRole = () => {
    if (session?.role === 'admin') {
      // Switch to Student Alexander Wright
      const student = dataService.getStudentByRollNumber('BT202401') || students[0];
      const studentSession: UserSession = {
        role: 'student',
        name: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        studentProfile: student,
      };
      setSession(studentSession);
      localStorage.setItem('eduportal_session_v2', JSON.stringify(studentSession));
      setStudentModal('none');
      showToast(`Switched view to Student (${student.name})`, 'info');
    } else {
      // Switch to Admin
      const adminSession: UserSession = {
        role: 'admin',
        name: 'Dr. Arthur Sterling',
        email: 'admin@eduportal.edu',
      };
      setSession(adminSession);
      localStorage.setItem('eduportal_session_v2', JSON.stringify(adminSession));
      setAdminView('dashboard');
      showToast('Switched view to Administrator', 'info');
    }
  };

  // Handlers for student data mutations
  const handleStudentAdded = (newStudent: Student) => {
    setStudents(dataService.getStudents());
  };

  const handleStudentDeleted = (deletedId: string) => {
    setStudents(dataService.getStudents());
  };

  // Titles & breadcrumbs for views
  const getHeaderMeta = () => {
    if (!session) return { title: 'Sign In', subtitle: '', breadcrumbs: ['EduPortal', 'Sign In'] };

    if (session.role === 'admin') {
      switch (adminView) {
        case 'dashboard':
          return {
            title: 'Administrator Dashboard',
            subtitle: 'EduPortal Academic Management Console',
            breadcrumbs: ['EduPortal', 'Administration', 'Overview'],
          };
        case 'add-student':
          return {
            title: 'Add Student Record',
            subtitle: 'Institutional Student Enrollment & Registry',
            breadcrumbs: ['EduPortal', 'Administration', 'Add Student'],
          };
        case 'attendance':
          return {
            title: 'Attendance Register',
            subtitle: 'Daily Student Presence & Absence Auditing',
            breadcrumbs: ['EduPortal', 'Administration', 'Attendance Register'],
          };
        case 'assignment':
          return {
            title: 'Course Assignments',
            subtitle: 'Curriculum Material Publication & Vault',
            breadcrumbs: ['EduPortal', 'Administration', 'Assignments'],
          };
        case 'delete-student':
          return {
            title: 'Delete Student Record',
            subtitle: 'Searchable Student Removal Directory',
            breadcrumbs: ['EduPortal', 'Administration', 'Delete Student Record'],
          };
      }
    } else {
      return {
        title: 'Student Academic Portal',
        subtitle: `Enrolled in ${session.studentProfile?.course || 'B.Tech'} — Section ${session.studentProfile?.section || 'A'}`,
        breadcrumbs: ['EduPortal', 'Student Portal', session.name],
      };
    }
  };

  // If not logged in, render the Login Page
  if (!session) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    );
  }

  const { title, subtitle, breadcrumbs } = getHeaderMeta();
  const studentProfile =
    session.role === 'student'
      ? session.studentProfile ||
        dataService.getStudentByRollNumber(session.rollNumber || 'BT202401') ||
        students[0]
      : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={adminView}
        onSelectView={(v) => setAdminView(v)}
        session={session}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenStudentModal={(modal) => setStudentModal(modal)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Sticky Header */}
        <Header
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          session={session}
          onLogout={handleLogout}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onSwitchRole={handleSwitchDemoRole}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {session.role === 'admin' ? (
            <>
              {adminView === 'dashboard' && (
                <AdminDashboard
                  onNavigate={(view) => setAdminView(view)}
                  students={students}
                />
              )}

              {adminView === 'add-student' && (
                <AddStudentPage
                  onBack={() => setAdminView('dashboard')}
                  onStudentAdded={handleStudentAdded}
                  showToast={showToast}
                />
              )}

              {adminView === 'attendance' && (
                <AttendancePage
                  students={students}
                  showToast={showToast}
                />
              )}

              {adminView === 'assignment' && (
                <AssignmentPage showToast={showToast} />
              )}

              {adminView === 'delete-student' && (
                <DeleteStudentPage
                  students={students}
                  onBack={() => setAdminView('dashboard')}
                  onStudentDeleted={handleStudentDeleted}
                  showToast={showToast}
                />
              )}
            </>
          ) : (
            studentProfile && (
              <StudentPortal
                student={studentProfile}
                activeModal={studentModal}
                onSetModal={(modal) => setStudentModal(modal)}
              />
            )
          )}
        </main>

        {/* Clean Light Footer */}
        <footer className="mt-auto px-6 py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="font-medium text-slate-600">EduPortal · Student Management System</span>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="text-emerald-600 font-semibold">● Database Connected</span>
              <span>·</span>
              <span>Session 2026–2027</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
