import React from 'react';
import BrandAvatar from '../../../components/BrandAvatar';

interface ProfileViewProps {
  onEdit?: () => void;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
  profileFields?: {
    phone?: string | null;
    company?: string | null;
    role?: string | null;
  };
}

const ProfileView: React.FC<ProfileViewProps> = ({
  onEdit,
  userName,
  userEmail,
  avatarUrl,
  profileFields,
}) => {
  const displayValue = (value?: string | null) => (value && value.trim().length ? value : '-');
  const resolvedName = displayValue(userName);
  const resolvedEmail = displayValue(userEmail);
  const resolvedPhone = displayValue(profileFields?.phone);
  const resolvedCompany = displayValue(profileFields?.company);
  const resolvedRole = displayValue(profileFields?.role);
  const avatarName = userName && userName.trim().length ? userName : 'User';

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-baloo text-white">Meu Perfil</h2>
          <p className="text-brand-gray-400 text-sm mt-2">
            Veja seus dados e personalize sua presenca no Hub.
          </p>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-primary-dark transition-all"
          >
            Editar perfil
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <BrandAvatar
              name={avatarName}
              imageUrl={avatarUrl || undefined}
              size="lg"
              className="ring-2 ring-brand-primary/30"
            />
            <div>
              <p className="text-white font-bold text-lg">{resolvedName}</p>
              <p className="text-brand-gray-400 text-xs">{resolvedEmail}</p>
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

        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                Nome
              </span>
              <div className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white">
                {resolvedName}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                Email
              </span>
              <div className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white">
                {resolvedEmail}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                Telefone
              </span>
              <div className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white">
                {resolvedPhone}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                Empresa
              </span>
              <div className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white">
                {resolvedCompany}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
              Cargo
            </span>
            <div className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white">
              {resolvedRole}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
