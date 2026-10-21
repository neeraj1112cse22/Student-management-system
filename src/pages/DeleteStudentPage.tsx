import React, { useState } from 'react';
import {
  UserMinus,
  Search,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Users,
} from 'lucide-react';
import { Student } from '../types';
import { dataService } from '../services/dataService';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface DeleteStudentPageProps {
  students: Student[];
  onBack: () => void;
  onStudentDeleted: (id: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const DeleteStudentPage: React.FC<DeleteStudentPageProps> = ({
  students,
  onBack,
  onStudentDeleted,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter students based on search query and optional course filter
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.section.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse =
      filterCourse === 'all' || s.course === filterCourse;

    return matchesSearch && matchesCourse;
  });

  const handleOpenConfirm = (student: Student) => {
    setStudentToDelete(student);
  };

  const handleConfirmDelete = () => {
    if (!studentToDelete) return;

    setIsDeleting(true);

    setTimeout(() => {
      const res = dataService.deleteStudent(studentToDelete.id);
      setIsDeleting(false);

      if (res.success) {
        onStudentDeleted(studentToDelete.id);
        // Exact requirement
        showToast('Student data deleted successfully', 'success');
        setStudentToDelete(null);
      } else {
        showToast(res.error || 'Failed to delete student record.', 'error');
      }
    }, 250);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={studentToDelete !== null}
        student={studentToDelete}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
        isProcessing={isDeleting}
      />

      {/* Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs text-red-600 font-medium flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Roster Deletion Directory</span>
        </span>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Delete Student Record
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Search directory and safely remove student enrollment records with confirmation verification.
        </p>
      </div>

      {/* Search and Filter Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 relative">
            <label
              htmlFor="studentSearch"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Search Student Directory
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="studentSearch"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Roll Number, Name, Email, or Section..."
                className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="filterDegree"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Filter by Program
            </label>
            <select
              id="filterDegree"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="all">All Degree Programs</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Searchable Student Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            Matching Students: <span className="font-mono-numbers text-blue-600">{filteredStudents.length}</span>
          </span>
          <span className="text-slate-500">
            Confirmation required prior to database removal
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-900">
              No Matching Student Records
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No students match "{searchQuery}". Clear your search query to display the full student roster.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    Roll Number
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    Student Name
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    Institutional Email
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    Course
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    Section
                  </th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono-numbers font-semibold text-slate-900 tracking-wide">
                      {student.rollNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-medium">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {student.email}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {student.course}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      Sec {student.section}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {/* Delete Action Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenConfirm(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                        title={`Delete record for ${student.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
