import React, { useState } from 'react';
import { Link } from '../utils/router-types';
import { useProjects } from '../context/ProjectContext.tsx';
import { Project, ProjectSection, Service } from '../types';
import Button from '../components/Button';
import { getProjectFolderName } from '../utils/slug';
import { useAutoSave } from '../hooks/useAutoSave';
import { useImageUpload } from '../hooks/useImageUpload';
import ServiceEditor from '../components/admin/ServiceEditor';
import ProjectEditor from '../components/admin/ProjectEditor';

const Admin: React.FC = () => {
  const {
    projects,
    services,
    categories,
    addProject,
    updateProject,
    deleteProject,
    addService,
    updateService,
    deleteService,
  } = useProjects();

  // Estado para controlar a aba ativa (Projects ou Services)
  const [activeTab, setActiveTab] = useState<'projects' | 'services'>('projects');

  // Estado para Projetos
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});

  // Estado para Serviços
  const [isEditingService, setIsEditingService] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const [tempServiceItem, setTempServiceItem] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // Image upload hook
  const { uploading, uploadFile } = useImageUpload();

  // Normalize project data for saving
  const normalizeProjectForSave = (project: Partial<Project>): Project | null => {
    if (!project.id) return null;
    return {
      id: project.id,
      title: (project.title || '').trim(),
      client: project.client || '',
      category: project.category || 'branding',
      date: project.date ?? new Date().toISOString().split('T')[0],
      description: project.description || '',
      coverImageUrl: project.coverImageUrl || '',
      cardImageUrl: project.cardImageUrl || '',
      coverImageKey: project.coverImageKey || undefined,
      cardImageKey: project.cardImageKey || undefined,
      sections: project.sections || [],
    };
  };

  // Auto-save function for projects
  const saveProjectAuto = async (project: Project) => {
    const exists = autoSave.hasCreatedOnServer || projects.some(p => p.id === project.id);
    if (exists) {
      await updateProject(project);
      autoSave.setHasCreatedOnServer(true);
      return;
    }
    await addProject(project);
    autoSave.setHasCreatedOnServer(true);
  };

  // Auto-save hook
  const autoSave = useAutoSave({
    isEditing: isEditingProject,
    currentData: currentProject,
    saveFunction: saveProjectAuto,
    normalizeFunction: normalizeProjectForSave,
    dependencies: [projects, addProject, updateProject, uploading, isSaving],
  });

  // Utility functions
  const cardColors = ['bg-brand-primary', 'bg-brand-orange', 'bg-brand-lilac', 'bg-brand-neutral'];
  const getCardColor = (idx: number) => cardColors[idx % cardColors.length];

  const getProjectFolderBase = () => {
    if (!currentProject.id || !currentProject.title) {
      return `portfolio/projects/draft`;
    }
    const folderName = getProjectFolderName({
      id: currentProject.id,
      title: currentProject.title,
    });
    return `portfolio/projects/${folderName}`;
  };

  // --- LOGICA DE PROJETOS ---
  const handleOpenProjectForm = (project?: Project) => {
    if (project) {
      setCurrentProject(JSON.parse(JSON.stringify(project)));
      autoSave.setHasCreatedOnServer(true);
    } else {
      const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      setCurrentProject({
        id,
        title: '',
        client: '',
        date: new Date().toISOString().split('T')[0],
        category: 'branding',
        description: '',
        coverImageUrl: 'https://placehold.co/1920x1080/1A1A1A/FFFFFF?text=Banner',
        cardImageUrl: 'https://placehold.co/800x1000/F23DB3/FFFFFF?text=Card',
        sections: [],
      });
      autoSave.setHasCreatedOnServer(false);
    }
    setIsEditingProject(true);
    window.scrollTo(0, 0);
  };

  const handleSaveProject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (uploading || isSaving) return;

    setIsSaving(true);
    const projectToSave = { ...currentProject } as Project;
    const exists = projects.find(p => p.id === projectToSave.id);

    try {
      if (exists) {
        await updateProject(projectToSave);
      } else {
        await addProject(projectToSave);
        autoSave.setHasCreatedOnServer(true);
      }
      setIsEditingProject(false);
      setCurrentProject({});
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar projeto no banco de dados.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOGICA DE SERVIÇOS ---
  const handleOpenServiceForm = (service?: Service) => {
    if (service) {
      setCurrentService(JSON.parse(JSON.stringify(service)));
    } else {
      setCurrentService({
        title: '',
        desc: '',
        icon: 'fa-star', // default icon
        image: 'https://placehold.co/800x600',
        items: [],
      });
    }
    setIsEditingService(true);
    window.scrollTo(0, 0);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading || isSaving) return;

    setIsSaving(true);
    const serviceToSave = { ...currentService } as Service;

    try {
      if (serviceToSave.id && services.find(s => s.id === serviceToSave.id)) {
        await updateService(serviceToSave);
      } else {
        await addService(serviceToSave);
      }
      setIsEditingService(false);
      setCurrentService({});
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar serviço no banco de dados.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddServiceItem = () => {
    if (!tempServiceItem.trim()) return;
    setCurrentService(prev => ({
      ...prev,
      items: [...(prev.items || []), tempServiceItem],
    }));
    setTempServiceItem('');
  };

  const handleRemoveServiceItem = (index: number) => {
    setCurrentService(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index),
    }));
  };

  // --- IMAGE UPLOADS ---
  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { url, key } = await uploadFile(file, 'services');
        setCurrentService(prev => ({ ...prev, image: url, imageKey: key }));
      } catch (error) {
        console.error('Erro ao fazer upload da imagem do serviço:', error);
        alert('Erro ao fazer upload da imagem');
      }
    }
  };

  // ... (Project Section logic reused below)
  const addSection = (type: 'text' | 'gallery' | 'palette') => {
    const id = Math.random().toString(36).substr(2, 9);
    let newSection: ProjectSection;
    if (type === 'text') newSection = { id, type: 'text', title: '', content: 'Descreva...' };
    else if (type === 'palette')
      newSection = { id, type: 'palette', title: 'Paleta', colors: ['#F23DB3', '#FFFFFF'] };
    else
      newSection = {
        id,
        type: 'gallery',
        layout: 'grid-1',
        imageFormat: 'portrait',
        images: [],
        slidesCount: 1,
        title: '',
      };

    setCurrentProject(prev => ({ ...prev, sections: [...(prev.sections || []), newSection] }));
  };

  const removeSection = (id: string) =>
    setCurrentProject(prev => ({ ...prev, sections: prev.sections?.filter(s => s.id !== id) }));

  const updateSection = (id: string, updates: Partial<ProjectSection>) => {
    setCurrentProject(prev => ({
      ...prev,
      sections: prev.sections?.map(s => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const handleProjectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionId: string,
    imgIdx: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { url, key } = await uploadFile(file, `${getProjectFolderBase()}/sections`);
        setCurrentProject(prev => {
          const newSections = prev.sections?.map(s => {
            if (s.id === sectionId) {
              const newImages = [...(s.images || [])];
              if (imgIdx < newImages.length)
                newImages[imgIdx] = { ...newImages[imgIdx], url, imageKey: key };
              else newImages[imgIdx] = { url, alt: '', imageKey: key ?? '' };
              return { ...s, images: newImages };
            }
            return s;
          });
          return { ...prev, sections: newSections };
        });
      } catch (error) {
        console.error('Erro ao fazer upload da imagem da galeria:', error);
        alert('Erro ao fazer upload da imagem');
      }
    }
  };

  const handleMainProjectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'cardImageUrl' | 'coverImageUrl'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { url, key } = await uploadFile(file, getProjectFolderBase());
        const keyField = field === 'cardImageUrl' ? 'cardImageKey' : 'coverImageKey';
        setCurrentProject(prev => ({ ...prev, [field]: url, [keyField]: key }));
      } catch (error) {
        console.error('Erro ao fazer upload da imagem principal do projeto:', error);
        alert('Erro ao fazer upload da imagem');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* --- DASHBOARD NAVBAR --- */}
      <nav className="bg-white border-b border-gray-200 px-6 h-20 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link
            to="/admin"
            className="flex items-center gap-3 group"
            onClick={() => {
              setIsEditingProject(false);
              setIsEditingService(false);
            }}
          >
            <div className="w-10 h-10 bg-brand-neutral rounded-lg flex items-center justify-center text-white group-hover:bg-brand-primary transition-colors">
              <i className="fas fa-layer-group"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold font-baloo leading-none text-brand-neutral">
                Eidos Admin
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Dashboard
              </p>
            </div>
          </Link>

          {/* Navigation Tabs (in Navbar) */}
          {!isEditingProject && !isEditingService && (
            <div className="hidden md:flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'projects' ? 'bg-white text-brand-neutral shadow-sm' : 'text-gray-500 hover:text-brand-neutral'}`}
              >
                Projetos
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'services' ? 'bg-white text-brand-neutral shadow-sm' : 'text-gray-500 hover:text-brand-neutral'}`}
              >
                Serviços
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isEditingProject && !isEditingService && (
            <Button
              size="sm"
              onClick={() =>
                activeTab === 'projects' ? handleOpenProjectForm() : handleOpenServiceForm()
              }
            >
              <i className="fas fa-plus mr-2"></i> Novo{' '}
              {activeTab === 'projects' ? 'Projeto' : 'Serviço'}
            </Button>
          )}

          <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

          <Link
            to="/"
            className="text-gray-500 hover:text-brand-primary font-bold text-sm flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
            title="Voltar ao Site"
          >
            <i className="fas fa-external-link-alt"></i>{' '}
            <span className="hidden sm:inline">Ver Site</span>
          </Link>
        </div>
      </nav>

      {/* --- DASHBOARD CONTENT --- */}
      <main className="flex-grow p-6 md:p-10 max-w-[1600px] mx-auto w-full">
        {/* --- PROJECTS LIST VIEW --- */}
        {activeTab === 'projects' && !isEditingProject && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map(p => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all flex flex-col"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                  <img
                    src={p.cardImageUrl || p.coverImageUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleOpenProjectForm(p);
                      }}
                      className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-brand-neutral hover:text-brand-primary shadow-sm"
                    >
                      <i className="fas fa-pencil-alt text-xs"></i>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        deleteProject(p.id);
                      }}
                      className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white shadow-sm transition-colors"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/5 px-2 py-1 rounded">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {p.date?.split('-')[0]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-baloo leading-tight text-brand-neutral line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{p.client}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- SERVICES LIST VIEW (EXACT HOME CARD STYLE) --- */}
        {activeTab === 'services' && !isEditingService && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, index) => {
              const bgColorClass = getCardColor(index);
              return (
                <div
                  key={s.id}
                  className="group bg-brand-gray-50 rounded-3xl border border-brand-gray-100 h-full flex flex-col relative shadow-sm hover:shadow-xl transition-all duration-300 overflow-visible"
                >
                  {/* Thumb/Capa */}
                  <div className="h-48 w-full relative overflow-hidden rounded-t-3xl">
                    <div className="absolute inset-0 bg-brand-neutral/0 group-hover:bg-brand-neutral/0 transition-all z-10"></div>
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Admin Actions Overlay */}
                    <div className="absolute top-3 right-3 flex gap-2 z-30">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenServiceForm(s);
                        }}
                        className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-brand-neutral hover:text-brand-primary shadow-sm cursor-pointer"
                      >
                        <i className="fas fa-pencil-alt text-xs"></i>
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (s.id) deleteService(s.id);
                        }}
                        className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white shadow-sm transition-colors cursor-pointer"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>

                  {/* Badge Icon (Floating) */}
                  <div
                    className={`absolute top-[160px] left-8 w-14 h-14 ${bgColorClass} text-white rounded-2xl flex items-center justify-center shadow-lg z-20 group-hover:scale-110 transition-transform duration-300 border-[4px] border-brand-gray-50`}
                  >
                    <i className={`fas ${s.icon?.replace('fa-', '') || 'star'} text-xl`}></i>
                  </div>

                  {/* Content */}
                  <div className="pt-12 px-8 pb-8 flex flex-col flex-grow relative z-10">
                    <h3 className="text-xl font-bold font-baloo mb-3 text-brand-neutral">
                      {s.title}
                    </h3>
                    <p className="text-brand-gray-600 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                      {s.desc}
                    </p>

                    <div className="mt-auto pt-4 border-t border-brand-gray-200">
                      <div className="flex flex-wrap gap-1.5">
                        {s.items?.slice(0, 3).map((i, idx) => (
                          <span
                            key={idx}
                            className="bg-white text-[9px] px-2 py-1 rounded text-gray-500 border border-brand-gray-100"
                          >
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- SERVICE EDITOR FORM --- */}
        {isEditingService && (
          <ServiceEditor
            service={currentService}
            onUpdate={updates => setCurrentService(prev => ({ ...prev, ...updates }))}
            onSave={handleSaveService}
            onCancel={() => setIsEditingService(false)}
            onImageUpload={handleServiceImageUpload}
            uploading={uploading}
            tempItem={tempServiceItem}
            onTempItemChange={setTempServiceItem}
            onAddItem={handleAddServiceItem}
            onRemoveItem={handleRemoveServiceItem}
          />
        )}

        {/* --- PROJECT EDITOR FORM --- */}
        {isEditingProject && (
          <ProjectEditor
            project={currentProject}
            categories={categories}
            autoSaveState={autoSave.autoSaveState}
            lastAutoSaveAt={autoSave.lastAutoSaveAt}
            isAutoSaving={autoSave.isAutoSaving}
            uploading={uploading}
            isSaving={isSaving}
            onUpdate={updates => setCurrentProject(prev => ({ ...prev, ...updates }))}
            onSave={handleSaveProject}
            onCancel={() => setIsEditingProject(false)}
            onMainImageUpload={handleMainProjectImageUpload}
            onSectionImageUpload={handleProjectImageUpload}
            onAddSection={addSection}
            onRemoveSection={removeSection}
            onUpdateSection={updateSection}
          />
        )}
      </main>
    </div>
  );
};

export default Admin;
