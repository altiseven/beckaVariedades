'use client';

import React, { useState, useEffect } from 'react';
import { CRMProvider, useCRM } from '@/lib/crm-context';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import DashboardTab from '@/components/dashboard-tab';
import ClientsTab from '@/components/clients-tab';
import SalesTab from '@/components/sales-tab';
import InventoryTab from '@/components/inventory-tab';
import { NewTransactionModal, DbSettingsModal } from '@/components/modals';
import LoginScreen from '@/components/login-screen';

function MainCRMApp() {
  const { activeTab, setActiveTab } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const [isDbSettingsOpen, setIsDbSettingsOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionUser, setSessionUser] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      setIsMounted(true);
      if (typeof window !== 'undefined') {
        const savedAuth = localStorage.getItem('becka_auth');
        const savedUser = localStorage.getItem('becka_user');
        if (savedAuth === 'true') {
          setIsAuthenticated(true);
          setSessionUser(savedUser || 'Admin');
        }
      }
    });
  }, []);

  const handleLoginSuccess = (usr: string) => {
    setIsAuthenticated(true);
    setSessionUser(usr);
    localStorage.setItem('becka_auth', 'true');
    localStorage.setItem('becka_user', usr);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionUser(null);
    localStorage.removeItem('becka_auth');
    localStorage.removeItem('becka_user');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Clients':
        return <ClientsTab searchQuery={searchQuery} />;
      case 'Sales':
        return <SalesTab searchQuery={searchQuery} />;
      case 'Inventory':
        return <InventoryTab searchQuery={searchQuery} />;
      default:
        return <DashboardTab searchQuery={searchQuery} />;
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-850 rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-bold tracking-wider">Carregando CRM...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-sans flex animate-in fade-in duration-300">
      {/* SideNavBar Menu */}
      <Sidebar
        onOpenNewTransaction={() => setIsNewTxOpen(true)}
        onLogout={handleLogout}
        onOpenDbSettings={() => setIsDbSettingsOpen(true)}
      />

      {/* Main Column Wrapper */}
      <div className="ml-64 flex flex-col flex-1 min-h-screen">
        {/* Navigation Top Bar */}
        <Header activeTab={activeTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Dynamic Tab Panel */}
        <main className="p-lg flex-grow overflow-auto bg-background">
          <div className="max-w-7xl mx-auto w-full">
            {renderActiveTab()}
          </div>
        </main>

        {/* Copyright & Technical legal links */}
        <footer className="mt-auto py-lg px-xl border-t border-outline-variant bg-white flex flex-col md:flex-row justify-between items-center gap-md text-xs font-semibold text-on-surface-variant">
          <p>© 2026 Becka Variedades. All rights reserved.</p>
          <div className="flex gap-lg">
            <button
              onClick={() => setIsDbSettingsOpen(true)}
              className="hover:text-secondary hover:underline transition-colors focus:outline-none cursor-pointer"
            >
              Database Integration
            </button>
            <button
              onClick={() => alert('Termos de Privacidade de Becka Variedades e CRM Ativo!')}
              className="hover:text-secondary hover:underline transition-colors focus:outline-none cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => alert('Termos de Serviço Técnico e Operacional de Becka Variedades!')}
              className="hover:text-secondary hover:underline transition-colors focus:outline-none cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </footer>
      </div>

      {/* Instant modal for billing registration */}
      <NewTransactionModal isOpen={isNewTxOpen} onClose={() => setIsNewTxOpen(false)} />

      {/* Database settings for Supabase */}
      <DbSettingsModal isOpen={isDbSettingsOpen} onClose={() => setIsDbSettingsOpen(false)} />
    </div>
  );
}

export default function Page() {
  return (
    <CRMProvider>
      <MainCRMApp />
    </CRMProvider>
  );
}
