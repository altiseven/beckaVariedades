'use client';

import React from 'react';
import { Search, Bell, MessageSquare, ChevronDown, Menu, Sun, Moon } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  onMenuClick?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export default function Header({ searchQuery, setSearchQuery, activeTab, onMenuClick, theme = 'dark', onToggleTheme }: HeaderProps) {
  const getPlaceholder = () => {
    switch (activeTab) {
      case 'Clients':
        return 'Search clients by name, email or phone...';
      case 'Sales':
        return 'Search transactions by Order ID or client...';
      case 'Inventory':
        return 'Search products by SKU or name...';
      default:
        return 'Search orders, clients, or inventory...';
    }
  };

  const showNotificationAlert = () => {
    alert('Notificações de Becka Variedades:\n- 18 produtos estão com estoque baixo.\n- 2 pedidos pendentes atrasados precisam de faturamento.');
  };

  return (
    <header className="bg-white border-b border-outline-variant flex justify-between items-center px-lg h-16 w-full sticky top-0 z-40">
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="md:hidden mr-3 p-2 hover:bg-slate-100 rounded-lg text-primary focus:outline-none cursor-pointer flex items-center justify-center border border-slate-200/80 shadow-xs"
          title="Abrir Menu"
        >
          <Menu className="w-5 h-5 text-slate-650" />
        </button>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-md flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/70 border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-primary transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Top Controls */}
      <div className="flex items-center gap-lg">
        {/* Alerts and Chat */}
        <div className="flex gap-sm items-center">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 text-on-surface-variant hover:text-secondary rounded-full hover:bg-surface-container transition-all focus:outline-none cursor-pointer flex items-center justify-center"
              title={theme === 'light' ? 'Alternar para Modo Escuro' : 'Alternar para Modo Claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-650" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>
          )}

          <button
            onClick={showNotificationAlert}
            className="p-2 text-on-surface-variant hover:text-secondary rounded-full hover:bg-surface-container transition-all relative focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error border-2 border-white rounded-full"></span>
          </button>
          <button
            onClick={() => alert('Mensagens do CRM:\nConversa com gerente de estoque ativa - Nenhuma pendência crítica!')}
            className="p-2 text-on-surface-variant hover:text-secondary rounded-full hover:bg-surface-container transition-all focus:outline-none"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        {/* User Block */}
        <div className="flex items-center gap-sm pl-md border-l border-outline-variant cursor-pointer group hover:opacity-85 transition-opacity">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <Image
              alt="User profile photo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuApIKr2ciQeTYQMiBEdjLGejOgoTPq7Dyk7IFAbXJsLVKyuatcwBWAIvb8AQqw_jTpLPog8no-8iigctNVGr26_Us21lyt8kNLb5b1pTiSUSJ6fEMGp50-bZI-dglfQjafc4fTTFPH4VM2IyckrNFAjiQAPs-fW-2hi1aehk7Spg_V64dndBG-4Lwc_FYJzzYcP1xLf3BlsFtUomtknf9M5V3NR0liffEeC_wo-Z5egNKs1dAgkybdrBhWYOGRfc1200P63_2UGB2o"
              fill
              referrerPolicy="no-referrer"
              className="object-cover"
            />
          </div>
          <span className="font-sans text-sm font-bold text-primary">Admin</span>
          <ChevronDown className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
        </div>
      </div>
    </header>
  );
}
