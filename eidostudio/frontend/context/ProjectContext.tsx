import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Service, Category } from '../types';
import { useConfirm } from './ConfirmContext';
import { apiClient } from '../utils/apiClient';

interface ProjectContextType {
  projects: Project[];
  services: Service[];
  categories: Category[];
  isLoading: boolean;
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addService: (service: Service) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  refreshProjects: () => void;
  refreshServices: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { confirm } = useConfirm();

  const fetchProjects = async () => {
    try {
      const data = await apiClient.get<Project[]>('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await apiClient.get<Service[]>('/services');
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiClient.get<Category[]>('/categories');
      // Add 'all' category for frontend filter
      setCategories([{ id: 'all', name: 'Todos', count: 0 }, ...data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProjects(), fetchServices(), fetchCategories()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const refreshProjects = () => {
    fetchProjects();
  };

  const refreshServices = () => {
    fetchServices();
  };

  // --- ACTIONS: PROJETOS ---

  const addProject = async (project: Project) => {
    setIsLoading(true);
    try {
      await apiClient.post('/projects', project);
      await fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (project: Project) => {
    setIsLoading(true);
    try {
      await apiClient.put(`/projects/${project.id}`, project);
      await fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    const confirmed = await confirm('Tem certeza que deseja excluir este projeto?');
    if (!confirmed) return;
    setIsLoading(true);
    try {
      await apiClient.delete(`/projects/${id}`);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ACTIONS: SERVIÇOS ---

  const addService = async (service: Service) => {
    setIsLoading(true);
    try {
      await apiClient.post('/services', service);
      await fetchServices();
    } catch (error) {
      console.error('Error adding service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateService = async (service: Service) => {
    setIsLoading(true);
    try {
      await apiClient.put(`/services/${service.id}`, service);
      await fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    const confirmed = await confirm('Tem certeza que deseja excluir este serviço?');
    if (!confirmed) return;
    setIsLoading(true);
    try {
      await apiClient.delete(`/services/${id}`);
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        services,
        categories,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        refreshProjects,
        addService,
        updateService,
        deleteService,
        refreshServices,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within a ProjectProvider');
  return context;
};
