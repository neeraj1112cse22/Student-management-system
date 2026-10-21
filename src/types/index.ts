export type Course = 'B.Tech' | 'M.Tech' | 'BCA' | 'BBA';
export type Section = 'A' | 'B' | 'C' | 'D';
export type AttendanceStatus = 'Present' | 'Absent';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  course: Course;
  section: Section;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  rollNumber: string;
  studentName: string;
  course: Course;
  section: Section;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  course: Course;
  section: Section;
  description?: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  fileDataUrl?: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'student';

export interface UserSession {
  role: UserRole;
  name: string;
  email?: string;
  rollNumber?: string;
  studentProfile?: Student;
}

export type AdminView = 
  | 'dashboard' 
  | 'add-student' 
  | 'attendance' 
  | 'assignment' 
  | 'delete-student';

export type StudentModalView = 'none' | 'attendance' | 'assignment';
