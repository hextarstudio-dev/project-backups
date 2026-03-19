import React, { useState, useRef, useEffect } from 'react';
import BrandAvatar from '../../../components/BrandAvatar';
import { Notification } from '../types';
import { authFetch } from '../../../utils/authFetch';

interface HeaderProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  onLogout: () => void;
  title?: string;
  showSearch?: boolean;
  onOpenProfile?: () => void;
  onOpenPurchases?: () => void;
  onOpenSupport?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string;
  userId?: string | null;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm = '',
  setSearchTerm,
  onLogout,
  title,
  showSearch = true,
  onOpenProfile,
  onOpenPurchases,
  onOpenSupport,
  userName,
  userEmail,
  userAvatarUrl,
  userId,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Buscar notificações
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const response = await authFetch(`/hub/users/${userId}/notifications`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await authFetch(`/hub/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      await authFetch(`/hub/users/${userId}/notifications/read-all`, {
        method: 'PUT',
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resolvedUserName = userName || 'Raquel Monteiro';
  const resolvedUserEmail = userEmail || 'raquel@eidosstudio.com.br';

  return (
    <header className="h-24 min-h-24 px-10 flex items-center justify-between bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
      <div>
        {title ? (
          <h2 className="text-2xl font-bold font-baloo text-white flex items-center gap-2">
            {title}
          </h2>
        ) : (
          <>
            <h2 className="text-2xl font-bold font-baloo text-white flex items-center gap-2">
              Olá, {resolvedUserName.split(' ')[0]}
            </h2>
            <p className="text-brand-gray-400 text-sm">Bem-vinda ao seu Eidos Pack.</p>
          </>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Search & Notification */}
        {showSearch && setSearchTerm && (
          <div className="relative hidden md:block">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-500 text-sm"></i>
            <input
              type="text"
              placeholder="Buscar conteúdo..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-white outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all w-64 placeholder:text-brand-gray-600"
            />
          </div>
        )}

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all relative"
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-primary rounded-full border border-[#0f0f0f]"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div
            className={`absolute top-full right-0 mt-4 w-80 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-200 origin-top-right z-50 ${isNotifOpen ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 -translate-y-2 scale-95 invisible'}`}
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">Notificações</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] text-brand-primary hover:text-brand-primary/80 transition-colors uppercase font-bold tracking-wider"
                >
                  Marcar todas lidas
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.is_read ? 'bg-brand-primary/10' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <p
                          className={`text-sm ${!notif.is_read ? 'text-white font-bold' : 'text-brand-gray-400'}`}
                        >
                          {notif.title}
                        </p>
                        <p
                          className={`text-xs mt-1 ${!notif.is_read ? 'text-brand-gray-300' : 'text-brand-gray-500'}`}
                        >
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-brand-gray-600 mt-2">
                          {new Date(notif.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-primary/20 flex items-center justify-center text-white/50 hover:text-brand-primary transition-colors flex-shrink-0"
                          title="Marcar como lida"
                        >
                          <i className="fas fa-check text-[10px]"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 text-brand-gray-600">
                    <i className="fas fa-bell-slash text-xl"></i>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">Tudo limpo por aqui</p>
                  <p className="text-xs text-brand-gray-500">
                    Nenhuma notificação nova no momento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Profile Bar with Dropdown */}
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 pl-6 border-l border-white/10 transition-all group outline-none opacity-100`}
          >
            <div
              className={`text-right hidden md:block transition-opacity ${isDropdownOpen ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
            >
              <p className="font-bold text-white text-sm leading-tight group-hover:text-brand-primary transition-colors">
                {resolvedUserName}
              </p>
              <p className="text-[10px] text-brand-gray-500 font-bold uppercase tracking-wider">
                Membro Pro
              </p>
            </div>

            <div className="relative">
              <BrandAvatar
                name={resolvedUserName}
                imageUrl={userAvatarUrl}
                size="md"
                className="ring-2 ring-transparent group-hover:ring-brand-primary/30 transition-all"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
              >
                <i className="fas fa-chevron-down text-[8px] text-white"></i>
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute top-full right-0 mt-4 w-60 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-200 origin-top-right z-50 ${isDropdownOpen ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 -translate-y-2 scale-95 invisible'}`}
          >
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <BrandAvatar name={resolvedUserName} imageUrl={userAvatarUrl} size="sm" />
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm truncate">{resolvedUserName}</p>
                <p className="text-xs text-brand-gray-500 truncate">{resolvedUserEmail}</p>
              </div>
            </div>

            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenProfile?.();
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-brand-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group"
              >
                <i className="fas fa-user text-brand-gray-600 group-hover:text-brand-primary transition-colors w-4"></i>{' '}
                Meu perfil
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenPurchases?.();
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-brand-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group"
              >
                <i className="fas fa-receipt text-brand-gray-600 group-hover:text-brand-primary transition-colors w-4"></i>{' '}
                Histórico de compras
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenSupport?.();
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-brand-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group"
              >
                <i className="fas fa-headset text-brand-gray-600 group-hover:text-brand-primary transition-colors w-4"></i>{' '}
                Suporte
              </button>
            </div>

            <div className="border-t border-white/5 p-2">
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-brand-primary/80 hover:text-white hover:bg-brand-primary/20 transition-all flex items-center gap-3 border border-transparent hover:border-brand-primary/30"
              >
                <i className="fas fa-sign-out-alt w-4"></i> Sair do Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
