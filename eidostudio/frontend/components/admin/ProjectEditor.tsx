import React from 'react';
import Button from '../Button';
import CustomDropdown from '../CustomDropdown';
import { Project, ProjectSection, GalleryLayout, ImageFormat, Category } from '../../types';

interface ProjectEditorProps {
  project: Partial<Project>;
  categories: Category[];
  autoSaveState: 'idle' | 'pending' | 'saving' | 'saved' | 'error' | 'waiting';
  lastAutoSaveAt: Date | null;
  isAutoSaving: boolean;
  uploading: boolean;
  isSaving: boolean;
  onUpdate: (updates: Partial<Project>) => void;
  onSave: () => void;
  onCancel: () => void;
  onMainImageUpload: (e: React.ChangeEvent<HTMLInputElement>, field: 'cardImageUrl' | 'coverImageUrl') => void;
  onSectionImageUpload: (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, imgIdx: number) => void;
  onAddSection: (type: 'text' | 'gallery' | 'palette') => void;
  onRemoveSection: (id: string) => void;
  onUpdateSection: (id: string, updates: Partial<ProjectSection>) => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({
  project,
  categories,
  autoSaveState,
  lastAutoSaveAt,
  isAutoSaving,
  uploading,
  isSaving,
  onUpdate,
  onSave,
  onCancel,
  onMainImageUpload,
  onSectionImageUpload,
  onAddSection,
  onRemoveSection,
  onUpdateSection,
}) => {
  const categoryOptions = categories
    .filter(cat => cat.id !== 'all')
    .map(cat => ({ value: cat.id, label: cat.name }));

  const formatOptions = [
    { value: 'portrait', label: 'Retrato (4:5)', icon: 'shape-portrait' },
    { value: 'square', label: 'Quadrado (1:1)', icon: 'shape-square' },
    { value: 'landscape', label: 'Paisagem (16:9)', icon: 'shape-landscape' },
    { value: 'carousel', label: 'Carrossel', icon: 'shape-carousel' },
  ];

  const layoutOptions = [
    { value: 'grid-1', label: '1 Coluna' },
    { value: 'grid-2', label: '2 Colunas' },
    { value: 'grid-3', label: '3 Colunas' },
    { value: 'grid-4', label: '4 Colunas' },
    { value: 'grid-5', label: '5 Colunas' },
    { value: 'grid-6', label: '6 Colunas' },
    { value: 'masonry', label: 'Mosaico' },
  ];

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold font-baloo text-brand-neutral">
            {project.id ? 'Editar Projeto' : 'Criar Novo Projeto'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`text-[10px] font-bold uppercase tracking-widest ${
              autoSaveState === 'saving'
                ? 'text-brand-primary'
                : autoSaveState === 'saved'
                  ? 'text-green-600'
                  : autoSaveState === 'error'
                    ? 'text-red-500'
                    : autoSaveState === 'waiting'
                      ? 'text-amber-600'
                      : 'text-gray-400'
            }`}
          >
            {autoSaveState === 'saving' && 'Auto-save: salvando...'}
            {autoSaveState === 'saved' &&
              `Auto-save: salvo${lastAutoSaveAt ? ` • ${lastAutoSaveAt.toLocaleTimeString()}` : ''}`}
            {autoSaveState === 'error' && 'Auto-save: erro ao salvar'}
            {autoSaveState === 'waiting' && 'Auto-save: aguardando título'}
            {autoSaveState === 'pending' && 'Auto-save: aguardando alterações'}
            {autoSaveState === 'idle' && 'Auto-save: pronto'}
          </div>
          <button
            onClick={onCancel}
            className="text-sm font-bold text-gray-500 hover:text-brand-neutral"
          >
            Cancelar
          </button>
          <Button
            onClick={onSave}
            disabled={uploading || isSaving || isAutoSaving}
            size="sm"
          >
            {uploading || isSaving || isAutoSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="p-8">
        <form className="space-y-12">
          {/* Seção 1: Dados Principais */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-neutral border-b pb-2 mb-4">
                Informações Básicas
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Título
                  </label>
                  <input
                    type="text"
                    value={project.title || ''}
                    onChange={e => onUpdate({ title: e.target.value })}
                    className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Cliente
                  </label>
                  <input
                    type="text"
                    value={project.client || ''}
                    onChange={e => onUpdate({ client: e.target.value })}
                    className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Data
                    </label>
                    <input
                      type="date"
                      value={project.date || ''}
                      onChange={e => onUpdate({ date: e.target.value })}
                      className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="mt-6">
                      <CustomDropdown
                        options={categoryOptions}
                        value={project.category || 'branding'}
                        onChange={val => onUpdate({ category: val })}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Resumo
                  </label>
                  <textarea
                    value={project.description || ''}
                    onChange={e => onUpdate({ description: e.target.value })}
                    rows={4}
                    className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-brand-primary resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-neutral border-b pb-2 mb-4">
                Imagens de Capa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Card (Grade)
                  </label>
                  <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden relative group border border-gray-200">
                    <img
                      src={project.cardImageUrl}
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <span className="text-white text-xs font-bold uppercase">Alterar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => onMainImageUpload(e, 'cardImageUrl')}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Banner (Interno)
                  </label>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative group border border-gray-200">
                    <img
                      src={project.coverImageUrl}
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <span className="text-white text-xs font-bold uppercase">Alterar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => onMainImageUpload(e, 'coverImageUrl')}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2: Construtor de Conteúdo */}
          <div className="border-t border-gray-100 pt-10">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-xl font-bold font-baloo text-brand-neutral">
                  Conteúdo do Projeto
                </h3>
                <p className="text-sm text-gray-500">
                  Adicione seções para construir a página do case.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onAddSection('text')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold uppercase text-brand-neutral transition-colors"
                >
                  + Texto
                </button>
                <button
                  type="button"
                  onClick={() => onAddSection('gallery')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold uppercase text-brand-neutral transition-colors"
                >
                  + Galeria
                </button>
                <button
                  type="button"
                  onClick={() => onAddSection('palette')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold uppercase text-brand-neutral transition-colors"
                >
                  + Cores
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {project.sections?.map((section, idx) => (
                <div
                  key={section.id}
                  className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative group"
                >
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-200 text-gray-400">
                      Seção {idx + 1}: {section.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveSection(section.id)}
                      className="w-6 h-6 bg-red-100 text-red-500 rounded flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>

                  {/* Render fields based on section type */}
                  <div className="pr-20">
                    {section.type === 'text' && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Título (Opcional)"
                          value={section.title || ''}
                          onChange={e => onUpdateSection(section.id, { title: e.target.value })}
                          className="bg-transparent font-bold text-lg outline-none placeholder:text-gray-400 w-full"
                        />
                        <textarea
                          value={section.content || ''}
                          onChange={e =>
                            onUpdateSection(section.id, { content: e.target.value })
                          }
                          rows={3}
                          className="w-full bg-white p-3 rounded-lg border border-gray-200 text-sm outline-none"
                          placeholder="Conteúdo do texto..."
                        />
                      </div>
                    )}

                    {section.type === 'gallery' && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Título da Galeria (Opcional)"
                          value={section.title || ''}
                          onChange={e => onUpdateSection(section.id, { title: e.target.value })}
                          className="bg-transparent font-bold text-sm outline-none placeholder:text-gray-400 w-full"
                        />
                        <div className="flex gap-4 mb-4">
                          <div className="w-48">
                            <CustomDropdown
                              label="Formato"
                              options={formatOptions}
                              value={section.imageFormat || 'portrait'}
                              onChange={val =>
                                onUpdateSection(section.id, { imageFormat: val as ImageFormat })
                              }
                            />
                          </div>
                          {section.imageFormat !== 'carousel' && (
                            <div className="w-48">
                              <CustomDropdown
                                label="Layout"
                                options={layoutOptions}
                                value={section.layout || 'grid-1'}
                                onChange={val =>
                                  onUpdateSection(section.id, { layout: val as GalleryLayout })
                                }
                              />
                            </div>
                          )}
                          {section.imageFormat === 'carousel' && (
                            <div className="flex items-end pb-2 gap-2">
                              <span className="text-xs font-bold text-gray-500">Slides:</span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateSection(section.id, {
                                    slidesCount: Math.max(1, (section.slidesCount || 1) - 1),
                                  })
                                }
                                className="px-2 bg-gray-200 rounded hover:bg-brand-primary hover:text-white transition-colors font-bold w-8 h-8"
                              >
                                -
                              </button>
                              <span className="font-mono text-lg font-bold w-6 text-center">
                                {section.slidesCount || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateSection(section.id, {
                                    slidesCount: Math.min(10, (section.slidesCount || 1) + 1),
                                  })
                                }
                                className="px-2 bg-gray-200 rounded hover:bg-brand-primary hover:text-white transition-colors font-bold w-8 h-8"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Image Uploader Preview */}
                        {section.imageFormat === 'carousel' ? (
                          <div className="flex flex-col items-center justify-center w-full py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 px-6">
                            <div
                              className="relative bg-white shadow-sm transition-all duration-300 ease-out group/c-preview overflow-hidden mx-auto"
                              style={{
                                width: '100%',
                                maxWidth: `${300 * (((section.slidesCount || 1) * 4) / 5)}px`,
                                aspectRatio: `${(section.slidesCount || 1) * 4} / 5`,
                              }}
                            >
                              {section.images?.[0]?.url ? (
                                <>
                                  <img
                                    src={section.images[0].url}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => onUpdateSection(section.id, { images: [] })}
                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/c-preview:opacity-100 transition-opacity z-20"
                                  >
                                    <i className="fas fa-times text-[10px]"></i>
                                  </button>
                                </>
                              ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-gray-400 hover:text-brand-primary">
                                  <i className="fas fa-plus mb-2"></i>
                                  <span className="text-[10px] font-bold uppercase">
                                    Upload Imagem Única
                                  </span>
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={e => onSectionImageUpload(e, section.id, 0)}
                                    disabled={uploading}
                                  />
                                </label>
                              )}

                              {/* Grid Lines Overlay */}
                              <div className="absolute inset-0 pointer-events-none flex z-10">
                                {Array.from({ length: section.slidesCount || 1 }).map(
                                  (_, i) => (
                                    <div
                                      key={i}
                                      className="flex-1 border-r border-white/40 last:border-r-0 relative"
                                    >
                                      <span className="absolute bottom-1 right-1 text-[8px] text-white/70 font-bold bg-black/20 px-1 rounded">
                                        {i + 1}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-4 text-center">
                              A largura aumenta conforme o número de slides.
                              <br />
                              Proporção Total:{' '}
                              <span className="font-bold text-brand-neutral">
                                {(section.slidesCount || 1) * 4}:5
                              </span>
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {section.images?.map((img, i) => (
                              <div
                                key={i}
                                className="aspect-square bg-white rounded-lg overflow-hidden relative group/img border border-gray-200"
                              >
                                <img src={img.url} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateSection(section.id, {
                                      images: section.images?.filter((_, idx) => idx !== i),
                                    })
                                  }
                                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                >
                                  <i className="fas fa-times text-[10px]"></i>
                                </button>
                              </div>
                            ))}
                            <label className="aspect-square bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary text-gray-400 hover:text-brand-primary transition-colors">
                              <i className="fas fa-plus"></i>
                              <input
                                type="file"
                                className="hidden"
                                onChange={e =>
                                  onSectionImageUpload(
                                    e,
                                    section.id,
                                    section.images?.length || 0
                                  )
                                }
                                disabled={uploading}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    )}

                    {section.type === 'palette' && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={section.title || ''}
                          onChange={e => onUpdateSection(section.id, { title: e.target.value })}
                          className="bg-transparent font-bold text-sm outline-none placeholder:text-gray-400 w-full"
                          placeholder="Título da Paleta"
                        />
                        <div className="flex gap-2">
                          {section.colors?.map((color, i) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full border border-gray-200 relative group/col"
                              style={{ backgroundColor: color }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateSection(section.id, {
                                    colors: section.colors?.filter((_, idx) => idx !== i),
                                  })
                                }
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/col:opacity-100"
                              >
                                <i className="fas fa-times text-[8px]"></i>
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateSection(section.id, {
                                colors: [...(section.colors || []), '#CCCCCC'],
                              })
                            }
                            className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {(!project.sections || project.sections.length === 0) && (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-400 text-sm">
                    Nenhuma seção adicionada. Use os botões acima para começar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEditor;
