import { Student, AttendanceRecord, Assignment, Course, Section } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'eduportal_students_v2',
  ATTENDANCE: 'eduportal_attendance_v2',
  ASSIGNMENTS: 'eduportal_assignments_v2',
};

// SVG data URI for a sample assignment diagram image with clean light normal styling
const SAMPLE_IMAGE_DATA = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f8fafc"/><rect x="40" y="40" width="720" height="520" rx="12" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><text x="400" y="100" fill="%230f172a" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">Software Engineering Architectural Diagram</text><text x="400" y="140" fill="%2364748b" font-family="sans-serif" font-size="14" text-anchor="middle">Module 3 System Decomposition</text><rect x="100" y="200" width="160" height="80" rx="8" fill="%23eff6ff" stroke="%232563eb" stroke-width="1.5"/><text x="180" y="245" fill="%231e3a8a" font-family="sans-serif" font-size="14" font-weight="600" text-anchor="middle">Client Presentation</text><rect x="320" y="200" width="160" height="80" rx="8" fill="%23eff6ff" stroke="%232563eb" stroke-width="1.5"/><text x="400" y="245" fill="%231e3a8a" font-family="sans-serif" font-size="14" font-weight="600" text-anchor="middle">Business Layer</text><rect x="540" y="200" width="160" height="80" rx="8" fill="%23eff6ff" stroke="%232563eb" stroke-width="1.5"/><text x="620" y="245" fill="%231e3a8a" font-family="sans-serif" font-size="14" font-weight="600" text-anchor="middle">Data Store</text><line x1="260" y1="240" x2="320" y2="240" stroke="%232563eb" stroke-width="2"/><line x1="480" y1="240" x2="540" y2="240" stroke="%232563eb" stroke-width="2"/><text x="400" y="460" fill="%2364748b" font-family="sans-serif" font-size="13" text-anchor="middle">Submission Requirements: Submit complete write-up before due date</text></svg>`;

// Seed students
const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Alexander Wright',
    rollNumber: 'BT202401',
    email: 'a.wright@eduportal.edu',
    course: 'B.Tech',
    section: 'A',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'std-2',
    name: 'Eleanor Vance',
    rollNumber: 'BT202402',
    email: 'e.vance@eduportal.edu',
    course: 'B.Tech',
    section: 'A',
    createdAt: '2026-09-01T08:15:00Z',
  },
  {
    id: 'std-3',
    name: 'Marcus Chen',
    rollNumber: 'BT202403',
    email: 'm.chen@eduportal.edu',
    course: 'B.Tech',
    section: 'A',
    createdAt: '2026-09-01T08:30:00Z',
  },
  {
    id: 'std-4',
    name: 'Sophia Patel',
    rollNumber: 'BT202404',
    email: 's.patel@eduportal.edu',
    course: 'B.Tech',
    section: 'A',
    createdAt: '2026-09-01T08:45:00Z',
  },
  {
    id: 'std-5',
    name: 'Julian Hayes',
    rollNumber: 'BT202405',
    email: 'j.hayes@eduportal.edu',
    course: 'B.Tech',
    section: 'B',
    createdAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 'std-6',
    name: 'Chloe Bennett',
    rollNumber: 'MT202401',
    email: 'c.bennett@eduportal.edu',
    course: 'M.Tech',
    section: 'A',
    createdAt: '2026-09-01T09:15:00Z',
  },
  {
    id: 'std-7',
    name: 'David O\'Connor',
    rollNumber: 'BCA202401',
    email: 'd.oconnor@eduportal.edu',
    course: 'BCA',
    section: 'A',
    createdAt: '2026-09-01T09:30:00Z',
  },
  {
    id: 'std-8',
    name: 'Amara Sterling',
    rollNumber: 'BBA202401',
    email: 'a.sterling@eduportal.edu',
    course: 'BBA',
    section: 'A',
    createdAt: '2026-09-01T09:45:00Z',
  },
  {
    id: 'std-9',
    name: 'Liam Gallagher',
    rollNumber: 'BT202406',
    email: 'l.gallagher@eduportal.edu',
    course: 'B.Tech',
    section: 'A',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'std-10',
    name: 'Elena Rostova',
    rollNumber: 'BCA202402',
    email: 'e.rostova@eduportal.edu',
    course: 'BCA',
    section: 'B',
    createdAt: '2026-09-01T10:15:00Z',
  },
];

// Helper to format date string YYYY-MM-DD
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Seed Attendance Records
const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Today's attendance for B.Tech Section A
  {
    id: 'att-1',
    studentId: 'std-1',
    rollNumber: 'BT202401',
    studentName: 'Alexander Wright',
    course: 'B.Tech',
    section: 'A',
    date: getTodayDateString(),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-2',
    studentId: 'std-2',
    rollNumber: 'BT202402',
    studentName: 'Eleanor Vance',
    course: 'B.Tech',
    section: 'A',
    date: getTodayDateString(),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-3',
    studentId: 'std-3',
    rollNumber: 'BT202403',
    studentName: 'Marcus Chen',
    course: 'B.Tech',
    section: 'A',
    date: getTodayDateString(),
    status: 'Absent',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-4',
    studentId: 'std-4',
    rollNumber: 'BT202404',
    studentName: 'Sophia Patel',
    course: 'B.Tech',
    section: 'A',
    date: getTodayDateString(),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-5',
    studentId: 'std-9',
    rollNumber: 'BT202406',
    studentName: 'Liam Gallagher',
    course: 'B.Tech',
    section: 'A',
    date: getTodayDateString(),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },

  // Past Day 1 for B.Tech Section A
  {
    id: 'att-6',
    studentId: 'std-1',
    rollNumber: 'BT202401',
    studentName: 'Alexander Wright',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(1),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-7',
    studentId: 'std-2',
    rollNumber: 'BT202402',
    studentName: 'Eleanor Vance',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(1),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-8',
    studentId: 'std-3',
    rollNumber: 'BT202403',
    studentName: 'Marcus Chen',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(1),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-9',
    studentId: 'std-4',
    rollNumber: 'BT202404',
    studentName: 'Sophia Patel',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(1),
    status: 'Absent',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-10',
    studentId: 'std-9',
    rollNumber: 'BT202406',
    studentName: 'Liam Gallagher',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(1),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },

  // Past Day 2
  {
    id: 'att-11',
    studentId: 'std-1',
    rollNumber: 'BT202401',
    studentName: 'Alexander Wright',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(2),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-12',
    studentId: 'std-2',
    rollNumber: 'BT202402',
    studentName: 'Eleanor Vance',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(2),
    status: 'Absent',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-13',
    studentId: 'std-3',
    rollNumber: 'BT202403',
    studentName: 'Marcus Chen',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(2),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-14',
    studentId: 'std-4',
    rollNumber: 'BT202404',
    studentName: 'Sophia Patel',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(2),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-15',
    studentId: 'std-9',
    rollNumber: 'BT202406',
    studentName: 'Liam Gallagher',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(2),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },

  // Past Day 3
  {
    id: 'att-16',
    studentId: 'std-1',
    rollNumber: 'BT202401',
    studentName: 'Alexander Wright',
    course: 'B.Tech',
    section: 'A',
    date: getPastDateString(3),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'att-17',
    studentId: 'std-7',
    rollNumber: 'BCA202401',
    studentName: 'David O\'Connor',
    course: 'BCA',
    section: 'A',
    date: getTodayDateString(),
    status: 'Present',
    updatedAt: new Date().toISOString(),
  },
];

// Seed Assignments
const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Distributed Systems & Microservices Architecture',
    course: 'B.Tech',
    section: 'A',
    description: 'Implement an asynchronous event-driven pipeline and provide system architectural diagram with component specifications.',
    fileName: 'Distributed_Systems_Specification.pdf',
    fileSize: '1.4 MB',
    fileType: 'application/pdf',
    createdAt: getPastDateString(1) + 'T10:00:00Z',
  },
  {
    id: 'asg-2',
    title: 'Software Engineering Diagram Analysis',
    course: 'B.Tech',
    section: 'A',
    description: 'Review the attached structural architecture flow chart and submit an assessment of loose coupling and test coverage boundaries.',
    fileName: 'Architecture_Flow_Diagram.png',
    fileSize: '840 KB',
    fileType: 'image/png',
    fileDataUrl: SAMPLE_IMAGE_DATA,
    createdAt: getPastDateString(2) + 'T14:30:00Z',
  },
  {
    id: 'asg-3',
    title: 'Database Normalization & B-Tree Indexing Case Study',
    course: 'B.Tech',
    section: 'B',
    description: 'Solve the 3NF and BCNF normalization exercises on the enterprise transaction ledger schema.',
    fileName: 'DB_Normalization_ProblemSet.pdf',
    fileSize: '2.1 MB',
    fileType: 'application/pdf',
    createdAt: getPastDateString(3) + 'T11:00:00Z',
  },
  {
    id: 'asg-4',
    title: 'Advanced Machine Learning - Optimization Bounds',
    course: 'M.Tech',
    section: 'A',
    description: 'Proof-of-convergence analysis for Stochastic Gradient Descent with momentum under non-convex loss surfaces.',
    fileName: 'Optimization_Convergence_Proof.pdf',
    fileSize: '3.2 MB',
    fileType: 'application/pdf',
    createdAt: getPastDateString(2) + 'T09:15:00Z',
  },
  {
    id: 'asg-5',
    title: 'Web Application Client-Side Security Review',
    course: 'BCA',
    section: 'A',
    description: 'Analyze common injection vulnerabilities and configure proper Content Security Policy directives.',
    fileName: 'CSP_Security_Guidelines.pdf',
    fileSize: '950 KB',
    fileType: 'application/pdf',
    createdAt: getPastDateString(1) + 'T16:00:00Z',
  },
];

// Service Methods with LocalStorage persistence
export const dataService = {
  // Students
  getStudents(): Student[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  addStudent(studentData: Omit<Student, 'id' | 'createdAt'>): { success: boolean; error?: string; student?: Student } {
    const students = this.getStudents();
    
    // Check duplicate roll number
    const rollExists = students.some(
      s => s.rollNumber.trim().toLowerCase() === studentData.rollNumber.trim().toLowerCase()
    );
    if (rollExists) {
      return { success: false, error: `Roll number '${studentData.rollNumber}' is already registered.` };
    }

    // Check duplicate email
    const emailExists = students.some(
      s => s.email.trim().toLowerCase() === studentData.email.trim().toLowerCase()
    );
    if (emailExists) {
      return { success: false, error: `Email '${studentData.email}' is already associated with an account.` };
    }

    const newStudent: Student = {
      id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...studentData,
      createdAt: new Date().toISOString(),
    };

    students.push(newStudent);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return { success: true, student: newStudent };
  },

  deleteStudent(id: string): { success: boolean; error?: string } {
    const students = this.getStudents();
    const student = students.find(s => s.id === id);
    if (!student) {
      return { success: false, error: 'Student record not found in database.' };
    }

    const filtered = students.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));

    // Also clean up or preserve attendance
    return { success: true };
  },

  getStudentByRollNumber(rollNumber: string): Student | undefined {
    const students = this.getStudents();
    return students.find(
      s => s.rollNumber.trim().toLowerCase() === rollNumber.trim().toLowerCase()
    );
  },

  getStudentByEmailOrRoll(query: string): Student | undefined {
    const students = this.getStudents();
    const q = query.trim().toLowerCase();
    return students.find(
      s => s.rollNumber.toLowerCase() === q || s.email.toLowerCase() === q
    );
  },

  // Attendance
  getAttendanceRecords(): AttendanceRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ATTENDANCE;
    }
  },

  getAttendanceForSectionDate(course: Course, section: Section, date: string): AttendanceRecord[] {
    const all = this.getAttendanceRecords();
    return all.filter(r => r.course === course && r.section === section && r.date === date);
  },

  saveAttendanceBatch(records: AttendanceRecord[]): { success: boolean } {
    const all = this.getAttendanceRecords();
    
    // Replace or add incoming records
    const updatedMap = new Map<string, AttendanceRecord>();
    all.forEach(r => {
      const key = `${r.studentId}_${r.date}`;
      updatedMap.set(key, r);
    });

    records.forEach(r => {
      const key = `${r.studentId}_${r.date}`;
      updatedMap.set(key, r);
    });

    const newAll = Array.from(updatedMap.values());
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(newAll));
    return { success: true };
  },

  getStudentAttendanceStats(rollNumber: string): {
    totalSessions: number;
    presentCount: number;
    absentCount: number;
    percentage: number;
    history: AttendanceRecord[];
    todayRecord?: AttendanceRecord;
  } {
    const all = this.getAttendanceRecords();
    const todayStr = getTodayDateString();
    const history = all
      .filter(r => r.rollNumber.trim().toLowerCase() === rollNumber.trim().toLowerCase())
      .sort((a, b) => (b.date > a.date ? 1 : -1));

    const totalSessions = history.length;
    const presentCount = history.filter(r => r.status === 'Present').length;
    const absentCount = history.filter(r => r.status === 'Absent').length;
    const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;
    const todayRecord = history.find(r => r.date === todayStr);

    return {
      totalSessions,
      presentCount,
      absentCount,
      percentage,
      history,
      todayRecord,
    };
  },

  // Assignments
  getAssignments(): Assignment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
      return INITIAL_ASSIGNMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  },

  getAssignmentsForStudent(course: Course, section: Section): Assignment[] {
    const all = this.getAssignments();
    return all.filter(a => a.course === course && a.section === section);
  },

  addAssignment(assignmentData: Omit<Assignment, 'id' | 'createdAt'>): { success: boolean; assignment: Assignment } {
    const assignments = this.getAssignments();
    const newAssignment: Assignment = {
      id: `asg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...assignmentData,
      createdAt: new Date().toISOString(),
    };
    assignments.unshift(newAssignment);
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    return { success: true, assignment: newAssignment };
  },

  // Overview Metrics for Admin Dashboard
  getAdminStats() {
    const students = this.getStudents();
    const attendance = this.getAttendanceRecords();
    const assignments = this.getAssignments();
    const today = getTodayDateString();
    const todayRecords = attendance.filter(r => r.date === today);
    const todayPresent = todayRecords.filter(r => r.status === 'Present').length;
    const todayRate = todayRecords.length > 0 ? Math.round((todayPresent / todayRecords.length) * 100) : 100;

    return {
      totalStudents: students.length,
      totalAttendanceRecords: attendance.length,
      totalAssignments: assignments.length,
      todayPresentRate: todayRate,
      todayMarkedCount: todayRecords.length,
    };
  },

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
  }
};
