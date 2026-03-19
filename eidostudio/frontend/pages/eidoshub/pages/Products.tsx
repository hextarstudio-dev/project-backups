import React, { useMemo } from 'react';
import { Course } from '../types';

interface ProductsProps {
  courses: Course[];
  categories: string[];
  searchTerm: string;
  onOpenCourse: (course: Course) => void;
  userId?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

const PACK_IDS = new Set(['eidos-pack', 'prod_TxLHC5q9ckSUwI']);

const Products: React.FC<ProductsProps> = ({
  courses,
  searchTerm,
  onOpenCourse,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
}) => {
  const ownedPack = useMemo(() => courses.find(c => PACK_IDS.has(c.id)), [courses]);
  const individualCourses = useMemo(() => courses.filter(c => !PACK_IDS.has(c.id)), [courses]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return individualCourses;
    const q = searchTerm.toLowerCase();
    return individualCourses.filter(
      c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [individualCourses, searchTerm]);

  const completedCount = useMemo(
    () => filtered.filter(c => (c.progress || 0) >= 1).length,
    [filtered]
  );
  const avgProgress = useMemo(() => {
    if (!filtered.length) return 0;
    const sum = filtered.reduce((acc, c) => acc + Math.round((c.progress || 0) * 100), 0);
    return Math.round(sum / filtered.length);
  }, [filtered]);

  if (filtered.length === 0 && !ownedPack && emptyTitle) {
    return (
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-box-open text-brand-primary text-xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-white font-baloo mb-2">{emptyTitle}</h3>
          {emptyDescription && (
            <p className="text-sm text-brand-gray-400 mb-6">{emptyDescription}</p>
          )}
          {emptyActionLabel && onEmptyAction && (
            <button
              onClick={onEmptyAction}
              className="px-6 py-3 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-primary-dark transition-all"
            >
              {emptyActionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6">
        {ownedPack && (
          <section className="rounded-2xl border border-brand-primary/30 bg-brand-primary/10 p-5 md:p-6">
            <p className="text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-1">
              Categoria: Pacote
            </p>
            <h3 className="text-xl md:text-2xl font-baloo font-bold text-white mb-2">
              Eidos Pack Completo
            </h3>
            <p className="text-sm text-brand-gray-300 mb-4">
              Produto agregado com acesso aos módulos individuais já incluídos na sua conta.
            </p>
            <button
              onClick={() => onOpenCourse(ownedPack)}
              className="px-5 py-2.5 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-primary-dark transition-colors"
            >
              Ver itens do pacote
            </button>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-[10px] uppercase tracking-widest text-brand-gray-400 font-bold mb-1">
              Meus produtos
            </p>
            <p className="text-2xl text-white font-baloo font-bold">{filtered.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-[10px] uppercase tracking-widest text-brand-gray-400 font-bold mb-1">
              Concluídos
            </p>
            <p className="text-2xl text-white font-baloo font-bold">{completedCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-[10px] uppercase tracking-widest text-brand-gray-400 font-bold mb-1">
              Progresso médio
            </p>
            <p className="text-2xl text-white font-baloo font-bold">{avgProgress}%</p>
          </div>
        </section>

        <section className="space-y-4">
          {filtered.map(course => {
            const progress = Math.max(0, Math.min(100, Math.round((course.progress || 0) * 100)));
            return (
              <article
                key={course.id}
                className="group rounded-2xl border border-white/10 bg-[#151515] hover:bg-[#1b1b1b] transition-colors overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-0 md:gap-6">
                  <div className="h-40 md:h-full">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 md:py-6 md:pl-0">
                    <p className="text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-2">
                      {course.category}
                    </p>
                    <h3 className="text-xl md:text-2xl font-baloo font-bold text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-brand-gray-400 mb-4">
                      {course.lessons?.length || 0} conteúdos • Vídeo Aula + Material
                    </p>
                    <div>
                      <div className="flex items-center justify-between text-xs text-brand-gray-400 mb-2">
                        <span>Progresso</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-primary to-brand-orange"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex md:flex-col items-center justify-between md:justify-center gap-3 min-w-[170px]">
                    <button
                      onClick={() => onOpenCourse(course)}
                      className="w-full md:w-auto px-5 py-3 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-primary-dark transition-colors"
                    >
                      Acessar produto
                    </button>
                    <span className="text-[10px] uppercase tracking-widest text-brand-gray-500">
                      {progress >= 100 ? 'Concluído' : 'Em andamento'}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Products;
