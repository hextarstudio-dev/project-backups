import React, { useEffect, useRef, useState } from 'react';
import BrandAvatar from '../../../components/BrandAvatar';
import { authFetch } from '../../../utils/authFetch';
const BRAND_AVATAR_URL = 'https://cdn.eidostudio.com.br/assets/site/logos/isotipo-preto-2.svg';

interface ProfileFields {
  phone?: string | null;
  company?: string | null;
  role?: string | null;
}

interface ProfileProps {
  onBack?: () => void;
  backLabel?: string;
  userName?: string;
  userEmail?: string;
  userId?: string | null;
  avatarUrl?: string | null;
  profileFields?: ProfileFields;
  onProfileUpdated?: (payload: {
    name?: string;
    email?: string;
    phone?: string | null;
    company?: string | null;
    role?: string | null;
    avatarUrl?: string | null;
  }) => void;
}

const Profile: React.FC<ProfileProps> = ({
  onBack,
  backLabel,
  userName,
  userEmail,
  userId,
  avatarUrl: initialAvatarUrl,
  profileFields,
  onProfileUpdated,
}) => {
  const [form, setForm] = useState({
    name: userName || '',
    email: userEmail || '',
    phone: profileFields?.phone || '',
    company: profileFields?.company || '',
    role: profileFields?.role || '',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isBrandAvatar = avatarUrl === BRAND_AVATAR_URL;
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm({
      name: userName || '',
      email: userEmail || '',
      phone: profileFields?.phone || '',
      company: profileFields?.company || '',
      role: profileFields?.role || '',
    });
  }, [userName, userEmail, profileFields?.phone, profileFields?.company, profileFields?.role]);

  useEffect(() => {
    setAvatarUrl(initialAvatarUrl || null);
  }, [initialAvatarUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('ID do usuário não encontrado.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const response = await authFetch(`/hub/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone,
          company: form.company,
          role: form.role,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar perfil.');
      }

      const data = await response.json();
      onProfileUpdated?.({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        role: data.role,
      });

      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError('Nao foi possivel salvar o perfil.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);
    setError(null);

    try {
      const folder = `eidoshub/users/${userId}/avatar`;
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await authFetch(`/upload?folder=${encodeURIComponent(folder)}`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Falha no upload da imagem.');
      }

      const uploadData = await uploadRes.json();

      const updateRes = await authFetch(`/hub/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: uploadData.url, avatarKey: uploadData.key }),
      });

      if (!updateRes.ok) {
        throw new Error('Falha ao salvar avatar.');
      }

      setAvatarUrl(uploadData.url);
      if (localPreview.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
      setPreviewUrl(null);
      onProfileUpdated?.({ avatarUrl: uploadData.url });
    } catch (err) {
      setError('Nao foi possivel atualizar a foto.');
      console.error(err);
      if (localPreview.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBrandAvatar = async () => {
    if (!userId) return;
    setIsUploading(true);
    setError(null);
    try {
      const response = await authFetch(`/hub/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: BRAND_AVATAR_URL, avatarKey: null }),
      });
      if (!response.ok) {
        throw new Error('Falha ao salvar avatar.');
      }
      setAvatarUrl(BRAND_AVATAR_URL);
      setPreviewUrl(null);
      onProfileUpdated?.({ avatarUrl: BRAND_AVATAR_URL });
    } catch (err) {
      setError('Nao foi possivel aplicar o avatar.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    if (!userId) return;
    setIsUploading(true);
    setError(null);
    try {
      const response = await authFetch(`/hub/users/${userId}/avatar`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao remover avatar.');
      }
      setAvatarUrl(null);
      setPreviewUrl(null);
      onProfileUpdated?.({ avatarUrl: null });
    } catch (err) {
      setError('Nao foi possivel remover a foto.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-baloo text-white">Editar Perfil</h2>
          <p className="text-brand-gray-400 text-sm mt-2">
            Atualize seus dados pessoais e preferencias.
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/70 border border-white/10 hover:border-brand-primary hover:text-brand-primary transition-all"
          >
            {backLabel || 'Voltar ao Hub'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <BrandAvatar
              name={form.name}
              imageUrl={avatarUrl || undefined}
              size="lg"
              className="ring-2 ring-brand-primary/30"
            />
            <div>
              <p className="text-white font-bold text-lg">{form.name}</p>
              <p className="text-brand-gray-400 text-xs">{form.email}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 mb-6">
            <div className="flex flex-col items-center gap-2">
              <BrandAvatar
                name={form.name}
                imageUrl={previewUrl || avatarUrl || undefined}
                size="xl"
                className="ring-2 ring-white/10"
              />
              {previewUrl && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500">
                  Pre-visualizacao
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !userId}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-primary-dark transition-all disabled:opacity-50"
              >
                {isUploading ? 'Enviando...' : 'Alterar foto'}
              </button>
              <button
                type="button"
                onClick={handleBrandAvatar}
                disabled={isUploading || !userId || isBrandAvatar}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-primary/40 text-white/80 hover:border-brand-primary hover:text-brand-primary transition-all disabled:opacity-50"
              >
                Usar avatar
              </button>
              <button
                type="button"
                onClick={handleAvatarRemove}
                disabled={isUploading || !avatarUrl || !userId}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 text-white/70 hover:border-brand-orange hover:text-brand-orange transition-all disabled:opacity-40"
              >
                Remover
              </button>
            </div>
          </div>

          <div className="space-y-4 text-sm text-brand-gray-400">
            <div className="flex items-center gap-3">
              <i className="fas fa-crown text-brand-primary w-5"></i>
              <span>Plano: Membro Pro</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-bolt text-brand-orange w-5"></i>
              <span>Acesso vitalicio aos packs</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-shield-alt text-brand-lilac w-5"></i>
              <span>Conta verificada</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                Nome
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                Telefone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                Empresa
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
              Cargo
            </label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 font-bold uppercase tracking-widest">{error}</div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${saved ? 'text-green-400' : 'text-brand-gray-500'}`}
            >
              {saved ? 'Alteracoes salvas' : 'Salvamento local'}
            </span>
            <button
              type="submit"
              disabled={isSaving || !userId}
              className="px-6 py-3 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-primary-dark transition-all disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
