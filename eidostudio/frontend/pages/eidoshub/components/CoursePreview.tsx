import React from 'react';
import { Course } from '../types';
import { useNavigate } from 'react-router-dom';

interface CoursePreviewProps {
  course: Course;
  onClose: () => void;
}

const CoursePreview: React.FC<CoursePreviewProps> = ({ course, onClose }) => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    navigate(`/hub/checkout/${course.id}`, { state: { course } });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 bg-[#0f0f0f] overflow-y-auto custom-scrollbar">
      {/* Header with Back Button */}
      <div className="h-24 min-h-[6rem] px-6 md:px-10 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#0f0f0f]/90 backdrop-blur-md z-50">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
        >
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-brand-gray-500 uppercase tracking-widest hidden md:inline">
            Loja
          </span>
          <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
          <span className="font-bold text-sm text-brand-primary uppercase tracking-widest">
            {course.category}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto w-full px-6 md:px-10 py-12 flex flex-col lg:flex-row gap-12">
        {/* Left Column: Image & Details */}
        <div className="flex-1 space-y-8">
          {/* Hero Image */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 bg-[#1a1a1a]">
            {course.image ? (
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i className="fas fa-image text-6xl text-white/10"></i>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent"></div>
          </div>

          <div className="space-y-6 text-white text-left">
            <h1 className="text-4xl md:text-5xl font-bold font-baloo leading-tight">
              {course.title}
            </h1>

            <p className="text-lg md:text-xl text-brand-gray-400 font-light leading-relaxed">
              {course.description ||
                'Descubra como estruturar sua apresentação e elevar o nível da sua entrega neste material completo focado na experiência do cliente.'}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <img
                    src="https://cdn.eidostudio.com.br/assets/site/logos/isotipo-preto-2.svg"
                    alt="Autor"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brand-gray-500 uppercase tracking-widest">
                    Autor
                  </p>
                  <p className="text-sm font-medium text-white">{course.author}</p>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 text-brand-primary">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brand-gray-500 uppercase tracking-widest">
                    Duração / Formato
                  </p>
                  <p className="text-sm font-medium text-white">{course.duration}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: CTA & Contents */}
        <div className="w-full lg:w-[400px] flex-shrink-0 space-y-6">
          {/* Checkout Card */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-[50px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            <h3 className="text-2xl font-bold font-baloo text-white mb-2">Garante o seu acesso</h3>
            <p className="text-sm text-brand-gray-400 mb-8 leading-relaxed">
              Liberado imediatamente na sua conta após a confirmação do pagamento.
            </p>

            <button
              onClick={handlePurchase}
              className="w-full py-4 bg-brand-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-primary-light transition-all shadow-lg hover:shadow-brand-primary/30 flex items-center justify-center gap-3 text-sm hover:-translate-y-1"
            >
              <i className="fas fa-lock text-white/50"></i> Comprar Agora
            </button>

            <div className="mt-6 flex flex-col gap-3 text-xs text-brand-gray-400 font-medium">
              <div className="flex items-center gap-3">
                <i className="fas fa-check text-green-400 flex-shrink-0"></i> Acesso vitalício ao
                conteúdo
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-check text-green-400 flex-shrink-0"></i> Acesso a todas as
                atualizações
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-check text-green-400 flex-shrink-0"></i> Suporte pela
                comunidade
              </div>
            </div>
          </div>

          {/* Module Contents List */}
          {course.lessons && course.lessons.length > 0 && (
            <div className="bg-[#151515] rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h4 className="font-bold text-white font-baloo">O que está incluso?</h4>
              </div>
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {course.lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    className="flex gap-4 p-4 rounded-xl bg-[#1a1a1a] border border-transparent"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-white/50 text-xs border border-white/10">
                      {lesson.type === 'video' && <i className="fas fa-play ml-0.5"></i>}
                      {lesson.type === 'pdf' && <i className="fas fa-file-pdf"></i>}
                      {lesson.type === 'text' && <i className="fas fa-align-left"></i>}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white/90 mb-1 leading-tight">
                        {lesson.title}
                      </h5>
                      <span className="text-[10px] text-brand-gray-500 font-medium uppercase tracking-wider block">
                        {lesson.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
