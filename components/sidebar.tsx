'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { LayoutDashboard, Users, Receipt, Package, Settings, HelpCircle, Plus, LogOut } from 'lucide-react';

interface SidebarProps {
  onOpenNewTransaction: () => void;
  onLogout?: () => void;
  onOpenDbSettings?: () => void;
}

export default function Sidebar({ onOpenNewTransaction, onLogout, onOpenDbSettings }: SidebarProps) {
  const { activeTab, setActiveTab } = useCRM();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Clients', label: 'Clients', icon: Users },
    { id: 'Sales', label: 'Sales', icon: Receipt },
    { id: 'Inventory', label: 'Inventory', icon: Package },
  ] as const;

  return (
    <aside className="bg-white border-r border-outline-variant h-screen w-64 fixed left-0 top-0 flex flex-col py-lg px-md z-50">
      {/* Brand Header */}
      <div className="mb-xl px-sm">
        <h1 className="font-sans text-xl font-bold text-primary tracking-tight">Becka Variedades</h1>
        <p className="font-sans text-xs text-on-surface-variant font-medium tracking-wide border-b border-outline-variant/30 pb-sm">Retail CRM</p>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-sm">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-md px-md py-sm rounded-lg transition-all text-left ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-secondary font-bold' : 'text-on-surface-variant'}`} />
              <span className="font-sans text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="mt-auto space-y-sm pt-lg border-t border-outline-variant">
        {/* Floating trigger action */}
        <button
          onClick={onOpenNewTransaction}
          className="w-full py-sm px-md bg-secondary text-on-secondary rounded-lg font-semibold text-sm hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-sm shadow-sm"
        >
          <Plus className="w-4 h-4 text-on-secondary stroke-[3px]" />
          <span>New Transaction</span>
        </button>

        <button
          onClick={onOpenDbSettings}
          className="w-full flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg text-left cursor-pointer"
        >
          <Settings className="w-5 h-5 text-on-surface-variant" />
          <span className="font-sans text-sm font-medium">Settings (Supabase)</span>
        </button>
        <button
          onClick={() => alert('Fale com o suporte técnico de Becka Variedades. Email: altiseven@gmail.com')}
          className="w-full flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg text-left"
        >
          <HelpCircle className="w-5 h-5 text-on-surface-variant" />
          <span className="font-sans text-sm font-medium">Support</span>
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
  );
}
