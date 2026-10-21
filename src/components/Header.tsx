import React from 'react';
import { User, LogOut, Menu, Shield, ChevronRight } from 'lucide-react';
import { UserSession } from '../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: string[];
  session: UserSession;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  onSwitchRole?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = ['EduPortal', 'Workspace'],
  session,
  onLogout,
  onToggleSidebar,
  onSwitchRole,
}) => {
  const isAdmin = session.role === 'admin';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 shadow-xs">
      {/* Left: Mobile Menu & Breadcrumbs + Page Title */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb}>
                  <span className={isLast ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                    {crumb}
                  </span>
                  {!isLast && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: User Profile, Role Indicator & Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Role Switcher Demo Helper */}
        {onSwitchRole && (
          <button
            type="button"
            onClick={onSwitchRole}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer font-medium"
            title="Switch demo view between Admin and Student"
          >
            <span className="text-slate-400">View as:</span>
            <span className="font-semibold text-blue-600">
              {isAdmin ? 'Student' : 'Admin'}
            </span>
          </button>
        )}

        {/* User Card */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            {isAdmin ? (
              <Shield className="w-4 h-4 stroke-[2]" />
            ) : (
              <User className="w-4 h-4 stroke-[2]" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              {session.name}
            </div>
            <div className="text-[11px] text-slate-500 leading-tight mt-0.5 font-medium">
              {isAdmin ? 'Administrator' : `Roll: ${session.rollNumber}`}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Sign out of EduPortal"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
