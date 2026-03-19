import React from 'react';
import { menuItems } from '../data';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  activeMenu: string;
  onNavigate: (id: string) => void;
  onLogoClick: () => void;
  onLogout: () => void;
  hasActiveCourse: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleCollapse,
  activeMenu,
  onNavigate,
  onLogoClick,
  hasActiveCourse,
}) => {
  return (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#101010] border-r border-brand-primary/30 flex flex-col h-full flex-shrink-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.4)] hidden md:flex transition-all duration-300 relative group/sidebar overflow-visible`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3.5 top-9 w-7 h-7 bg-brand-primary rounded-full text-white flex items-center justify-center text-[10px] z-50 border border-[#101010] shadow-[0_0_10px_rgba(242,61,179,0.5)] hover:scale-110 transition-transform cursor-pointer outline-none"
        title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
      >
        <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
      </button>

      {/* Logo Area */}
      <div
        className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} cursor-pointer h-24 transition-all`}
        onClick={onLogoClick}
      >
        <img
          src="https://i.ibb.co/7djcTLBx/Principal-simbolo-branca-38.png"
          alt="Eidos Studio"
          className={`${isCollapsed ? 'h-10' : 'h-12'} w-auto object-contain hover:scale-105 transition-all`}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar mt-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center rounded-xl transition-all duration-300 group relative ${
              isCollapsed ? 'justify-center px-0 py-4' : 'justify-start gap-4 px-4 py-4'
            } ${
              activeMenu === item.id && !hasActiveCourse
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                : 'text-brand-gray-400 hover:bg-white/5 hover:text-brand-primary'
            }`}
            title={isCollapsed ? item.label : ''}
          >
            <i
              className={`fas ${item.icon} text-lg ${activeMenu === item.id && !hasActiveCourse ? 'text-white' : 'text-brand-gray-500 group-hover:text-brand-primary'}`}
            ></i>

            {!isCollapsed && (
              <>
                <span className="font-bold text-sm tracking-wide whitespace-nowrap overflow-hidden transition-all">
                  {item.label}
                </span>
                {activeMenu === item.id && !hasActiveCourse && (
                  <i className="fas fa-chevron-right ml-auto text-xs opacity-50"></i>
                )}
              </>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
