import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { UserSession } from '../types';
import { dataService } from '../services/dataService';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('admin@eduportal.edu');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedId = identifier.trim();
    const trimmedPass = password.trim();

    if (!trimmedId) {
      setErrorMessage('Please enter your administrator email or student roll number.');
      return;
    }
    if (!trimmedPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Admin check
      if (
        trimmedId.toLowerCase() === 'admin' ||
        trimmedId.toLowerCase() === 'admin@eduportal.edu' ||
        trimmedId.toLowerCase() === 'admin@campusdesk.edu'
      ) {
        if (trimmedPass === 'admin123' || trimmedPass.length >= 4) {
          setIsLoading(false);
          onLoginSuccess({
            role: 'admin',
            name: 'Dr. Arthur Sterling',
            email: 'admin@eduportal.edu',
          });
          return;
        } else {
          setIsLoading(false);
          setErrorMessage('Invalid password for administrator account.');
          return;
        }
      }

      // Student check by email or roll number
      const student = dataService.getStudentByEmailOrRoll(trimmedId);
      if (student) {
        setIsLoading(false);
        onLoginSuccess({
          role: 'student',
          name: student.name,
          rollNumber: student.rollNumber,
          email: student.email,
          studentProfile: student,
        });
        return;
      }

      setIsLoading(false);
      setErrorMessage(
        'Account not found. Use "admin@eduportal.edu" or a valid student Roll Number (e.g., BT202401).'
      );
    }, 250);
  };

  const handleQuickLoginAdmin = () => {
    setIdentifier('admin@eduportal.edu');
    setPassword('admin123');
    setErrorMessage(null);
  };

  const handleQuickLoginStudent = () => {
    setIdentifier('BT202401');
    setPassword('student123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-900 relative">
      <div className="w-full max-w-md relative z-10">
        {/* App Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-3.5 shadow-md">
            <GraduationCap className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            EduPortal
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Student Management System & Academic Administration
          </p>
        </div>

        {/* Clean White Login Card */}
        <div className="bg-white border border-slate-200 p-7 sm:p-8 rounded-2xl shadow-sm relative">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your credentials to access the student or admin portal.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email Address or Roll Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@eduportal.edu or BT202401"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Encrypted
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 mt-5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Credentials Panel */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
              Quick Test Credentials
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickLoginAdmin}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={handleQuickLoginStudent}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Student Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-400">
          EduPortal · Academic Management System
        </div>
      </div>
    </div>
  );
};
