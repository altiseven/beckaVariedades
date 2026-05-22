'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { LayoutDashboard, Users, Receipt, Package, Settings, HelpCircle, Plus, LogOut } from 'lucide-react';

interface SidebarProps {
  onOpenNewTransaction: () => void;
  onLogout?: () => void;
  onOpenDbSettings?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ onOpenNewTransaction, onLogout, onOpenDbSettings, isOpen = false, onClose }: SidebarProps) {
  const { activeTab, setActiveTab } = useCRM();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Clients', label: 'Clients', icon: Users },
    { id: 'Sales', label: 'Sales', icon: Receipt },
    { id: 'Inventory', label: 'Inventory', icon: Package },
  ] as const;

  const handleNavClick = (tabId: 'Dashboard' | 'Clients' | 'Sales' | 'Inventory') => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      <aside className={`bg-white border-r border-outline-variant h-screen w-64 fixed left-0 top-0 flex flex-col py-lg px-md z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Header */}
        <div className="mb-xl px-sm flex items-center justify-between">
          <div className="flex-1">
            <h1 className="font-sans text-xl font-bold text-primary tracking-tight">Becka Variedades</h1>
            <p className="font-sans text-[10px] text-on-surface-variant font-bold tracking-widest uppercase border-b border-outline-variant/30 pb-sm">Retail CRM</p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden ml-md p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer flex items-center justify-center border border-slate-200"
              title="Fechar menu"
            >
              <span className="font-sans text-sm font-black leading-none px-1">×</span>
            </button>
          )}
        </div>

        {/* Nav List */}
        <nav className="flex-1 space-y-sm">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-md px-md py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white font-bold shadow-xs'
                    : 'text-slate-650 hover:bg-slate-100/80 hover:text-primary font-semibold'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-secondary' : 'text-slate-400'}`} />
                <span className="font-sans text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

      {/* Footer Controls */}
      <div className="mt-auto space-y-sm pt-lg border-t border-outline-variant">
        {/* Floating trigger action */}
        <button
          onClick={onOpenNewTransaction}
          className="w-full py-2.5 px-md bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary-hover active:scale-98 transition-all flex items-center justify-center gap-sm shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white stroke-[3px]" />
          <span>New Transaction</span>
        </button>

        <button
          onClick={onOpenDbSettings}
          className="w-full flex items-center gap-md px-md py-2.5 text-slate-650 hover:bg-slate-100/80 hover:text-primary transition-all rounded-xl text-left cursor-pointer font-semibold"
        >
          <Settings className="w-5 h-5 text-slate-400" />
          <span className="font-sans text-sm">Settings (Supabase)</span>
        </button>
        <button
          onClick={() => alert('Fale com o suporte técnico de Becka Variedades. Email: altiseven@gmail.com')}
          className="w-full flex items-center gap-md px-md py-2.5 text-slate-650 hover:bg-slate-100/80 hover:text-primary transition-all rounded-xl text-left cursor-pointer font-semibold"
        >
          <HelpCircle className="w-5 h-5 text-slate-400" />
          <span className="font-sans text-sm">Support</span>
        </button>

        {onLogout && (
          showLogoutConfirm ? (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-sm space-y-2 text-center animate-in fade-in duration-100">
              <p className="text-xs font-bold text-red-700">Deseja realmente sair?</p>
              <div className="flex gap-2">
                <button
                  onClick={onLogout}
                  className="flex-1 py-1 px-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition-colors cursor-pointer text-center"
                >
                  Sair
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-1 px-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Voltar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-md px-md py-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-lg text-left font-bold cursor-pointer"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="font-sans text-sm">Sair do CRM</span>
            </button>
          )
        )}
      </div>
    </aside>
    </>
  );
}
