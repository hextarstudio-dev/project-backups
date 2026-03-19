import React, { useState } from 'react';
import CourseGrid from '../components/CourseGrid';
import { Course } from '../types';

interface StoreProps {
  courses: Course[];
  categories: string[];
  searchTerm: string;
  onOpenCourse: (course: Course) => void;
}

const Store: React.FC<StoreProps> = ({ courses, categories, searchTerm, onOpenCourse }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* View Mode Toggle */}
      <div className="px-10 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <p className="text-brand-gray-400 text-sm">
            {courses.length} produto{courses.length !== 1 ? 's' : ''} disponí{courses.length !== 1 ? 'veis' : 'vel'}
          </p>

          <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-1 border border-white/5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                viewMode === 'grid'
                  ? 'bg-brand-primary text-[#1a1a1a]'
                  : 'text-brand-gray-500 hover:text-white'
              }`}
            >
              <i className="fas fa-th mr-2"></i>
              Cards
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                viewMode === 'list'
                  ? 'bg-brand-primary text-[#1a1a1a]'
                  : 'text-brand-gray-500 hover:text-white'
              }`}
            >
              <i className="fas fa-list mr-2"></i>
              Lista
            </button>
          </div>
        </div>
      </div>

      <CourseGrid
        courses={courses}
        categories={categories}
        onOpenCourse={onOpenCourse}
        searchTerm={searchTerm}
        viewMode={viewMode}
      />
    </div>
  );
};

export default Store;
