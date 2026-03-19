import React from 'react';
import Button from '../Button';
import { Service } from '../../types';

interface ServiceEditorProps {
  service: Partial<Service>;
  onUpdate: (updates: Partial<Service>) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  tempItem: string;
  onTempItemChange: (value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const ServiceEditor: React.FC<ServiceEditorProps> = ({
  service,
  onUpdate,
  onSave,
  onCancel,
  onImageUpload,
  uploading,
  tempItem,
  onTempItemChange,
  onAddItem,
  onRemoveItem,
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-baloo text-brand-neutral">
            {service.id ? 'Editar Serviço' : 'Criar Novo Serviço'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Preencha as informações do serviço abaixo.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <i className="fas fa-times text-gray-500"></i>
        </button>
      </div>

      <form onSubmit={onSave} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              Título
            </label>
            <input
              type="text"
              required
              value={service.title}
              onChange={e => onUpdate({ title: e.target.value })}
              className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              Ícone
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={service.icon}
                onChange={e => onUpdate({ icon: e.target.value })}
                className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-mono text-sm"
              />
              <div className="w-11 h-11 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary text-lg flex-shrink-0">
                <i className={`fas ${service.icon || 'fa-question'}`}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Descrição
          </label>
          <textarea
            rows={3}
            required
            value={service.desc}
            onChange={e => onUpdate({ desc: e.target.value })}
            className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Imagem de Capa (Visualização Card)
          </label>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative w-full max-w-[320px] group/preview">
              {/* Image Container h-48 */}
              <div className="h-48 w-full bg-gray-50 rounded-t-3xl overflow-hidden relative border-2 border-dashed border-gray-200 hover:border-brand-primary transition-colors z-0">
                {service.image ? (
                  <img src={service.image} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
                    <span className="text-xs font-bold uppercase">Upload</span>
                  </div>
                )}
                {/* Input covers image */}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  onChange={onImageUpload}
                  disabled={uploading}
                />

                {/* Overlay text on hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity pointer-events-none z-10">
                  <span className="text-white font-bold text-sm uppercase">
                    <i className="fas fa-pencil-alt mr-2"></i>Alterar
                  </span>
                </div>
              </div>

              {/* Fake Content Body to complete the look */}
              <div className="bg-brand-gray-50 border-x border-b border-brand-gray-100 rounded-b-3xl p-6 h-24 relative -mt-1 -z-10 flex flex-col justify-end">
                <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
              </div>

              {/* Floating Icon */}
              <div className="absolute top-[160px] left-8 w-14 h-14 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-lg z-10 border-[4px] border-brand-gray-50">
                <i
                  className={`fas ${service.icon?.replace('fa-', '') || 'question'} text-xl`}
                ></i>
              </div>
            </div>

            <div className="flex-1 text-xs text-gray-400 italic pt-4">
              <p>
                A largura foi fixada para simular a visualização no grid (320px). A altura da
                capa é fixa em 192px.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Lista de Itens
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempItem}
              onChange={e => onTempItemChange(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), onAddItem())}
              placeholder="Adicionar item..."
              className="flex-grow bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
            />
            <button
              type="button"
              onClick={onAddItem}
              className="px-4 bg-brand-neutral text-white rounded-lg hover:bg-brand-primary transition-colors"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {service.items?.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-100 pl-3 pr-2 py-1.5 rounded-md flex items-center gap-2 text-xs font-medium border border-gray-200"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => onRemoveItem(idx)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-neutral transition-colors"
          >
            Cancelar
          </button>
          <Button type="submit" disabled={uploading} className="py-2.5 px-8 text-sm">
            {uploading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceEditor;
