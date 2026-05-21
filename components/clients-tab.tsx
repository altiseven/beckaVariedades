'use client';

import React, { useState } from 'react';
import { useCRM, Client } from '@/lib/crm-context';
import { UserPlus, TrendingUp, Sparkles, Filter, ArrowUpDown, ChevronLeft, ChevronRight, BarChart3, Download } from 'lucide-react';
import { AddClientModal, ClientDetailsModal, EditClientModal } from '@/components/modals';

interface ClientsTabProps {
  searchQuery: string;
}

export default function ClientsTab({ searchQuery }: ClientsTabProps) {
  const { clients, metrics, deleteClient } = useCRM();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedClientForView, setSelectedClientForView] = useState<Client | null>(null);
  const [selectedClientForEdit, setSelectedClientForEdit] = useState<Client | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Sorting and Filtering States
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [sortBySpend, setSortBySpend] = useState<boolean>(true); // true = highest to lowest
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search logic + filter state
  const tempFiltered = clients.filter(c => {
    // Search query constraint
    const matchesSearch = searchQuery
      ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery))
      : true;

    // Status filter constraint
    const matchesStatus = statusFilter === 'All' ? true : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sorting logic
  const sortedAndFilteredClients = [...tempFiltered].sort((a, b) => {
    return sortBySpend ? b.totalSpent - a.totalSpent : a.totalSpent - b.totalSpent;
  });

  // Pagination logic
  const totalItems = sortedAndFilteredClients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedClients = sortedAndFilteredClients.slice(indexOfFirstItem, indexOfLastItem);

  const handleExportCSV = () => {
    try {
      // 1. Prepare header and content rows
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Member Since', 'Total Spent ($)', 'Transactions Count'];
      const rows = sortedAndFilteredClients.map(client => [
        client.id,
        `"${client.name.replace(/"/g, '""')}"`,
        `"${client.email.replace(/"/g, '""')}"`,
        `"${(client.phone || '').replace(/"/g, '""')}"`,
        client.status,
        client.memberSince,
        client.totalSpent.toFixed(2),
        client.transactionsCount
      ]);

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

      // 2. Add BOM for proper UTF-8 Excel support (e.g. Portuguese names like Lúcia)
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // 3. Create download trigger
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `becka_clientes_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting clients to CSV:', error);
      alert('Ocorreu um erro ao exportar a lista de clientes.');
    }
  };

  const handleToggleSort = () => {
    setSortBySpend(!sortBySpend);
    setCurrentPage(1);
  };

  const cycleStatusFilter = () => {
    if (statusFilter === 'All') setStatusFilter('Active');
    else if (statusFilter === 'Active') setStatusFilter('Inactive');
    else setStatusFilter('All');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-xl">
      {/* 1. Header Block */}
      <section className="flex flex-col md:flex-row md:items-center justify-between mb-xl gap-md">
        <div>
          <h2 className="font-sans text-2xl font-bold text-primary tracking-tight">Client Management</h2>
          <p className="font-sans text-sm text-on-surface-variant font-medium">
            Manage your customer database, track spending patterns, and nurture relationships.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-sm bg-secondary text-on-secondary px-lg py-sm rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-xs font-semibold text-sm"
        >
          <UserPlus className="w-5 h-5 text-on-secondary" />
          <span>ADD CLIENT</span>
        </button>
      </section>

      {/* 2. Bento Stats Panel */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
        <div className="bg-white p-lg border border-outline-variant rounded-xl flex flex-col justify-between">
          <p className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-xs">Total Clients</p>
          <div className="flex items-end justify-between">
            <span className="font-sans text-3xl font-extrabold text-primary">{metrics.totalClientsCount}</span>
            <span className="text-secondary font-sans text-xs font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 12%
            </span>
          </div>
        </div>

        <div className="bg-white p-lg border border-outline-variant rounded-xl flex flex-col justify-between">
          <p className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-xs">Active This Month</p>
          <div className="flex items-end justify-between">
            <span className="font-sans text-3xl font-extrabold text-primary">{metrics.activeClientsCount}</span>
            <span className="text-secondary font-sans text-xs font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 5%
            </span>
          </div>
        </div>

        <div className="bg-white p-lg border border-outline-variant rounded-xl flex flex-col justify-between">
          <p className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-xs">Avg. Lifetime Value</p>
          <div className="flex items-end justify-between">
            <span className="font-sans text-3xl font-extrabold text-primary">${metrics.avgOrderValue.toFixed(0)}</span>
            <span className="text-on-surface-variant font-sans text-xs font-semibold">
              Stable
            </span>
          </div>
        </div>

        <div className="bg-white p-lg border border-outline-variant rounded-xl flex flex-col justify-between">
          <p className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-xs">Satisfaction Rate</p>
          <div className="flex items-end justify-between">
            <span className="font-sans text-3xl font-extrabold text-primary">98%</span>
            <span className="text-secondary font-sans text-xs font-bold">
              ★ High
            </span>
          </div>
        </div>
      </section>

      {/* 3. Filter Actions Control Header */}
      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low flex-wrap gap-md">
          <div className="flex items-center gap-md">
            {/* Filter Toggle */}
            <button
              onClick={cycleStatusFilter}
              className="flex items-center gap-xs px-md py-1.5 bg-white border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-on-surface-variant" />
              <span>Filter: {statusFilter === 'All' ? 'Todos' : statusFilter === 'Active' ? 'Ativos' : 'Inativos'}</span>
            </button>

            {/* Sort Order Toggle */}
            <button
              onClick={handleToggleSort}
              className="flex items-center gap-xs px-md py-1.5 bg-white border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-on-surface-variant" />
              <span>Ordenação: {sortBySpend ? 'Maior Gasto' : 'Menor Gasto'}</span>
            </button>
          </div>
          <div className="text-on-surface-variant font-sans text-xs font-semibold">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} clients
          </div>
        </div>

        {/* 4. Table view */}
        <div className="overflow-x-auto">
          {paginatedClients.length === 0 ? (
            <div className="text-center py-xl text-on-surface-variant text-sm font-semibold">
              Nenhum cliente encontrado com os critérios fornecidos.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Client Name</th>
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contact Information</th>
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Spent</th>
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paginatedClients.map(client => {
                  const initials = client.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  const isActive = client.status === 'Active';

                  return (
                    <tr key={client.id} className="hover:bg-surface-container-low/75 transition-all group">
                      {/* Name */}
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
                            {initials}
                          </div>
                          <div>
                            <p className="font-sans text-sm font-bold text-primary">{client.name}</p>
                            <p className="font-sans text-[11px] font-medium text-on-surface-variant">Member since {client.memberSince}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-lg py-md">
                        <p className="font-sans text-sm font-medium text-primary">{client.email}</p>
                        <p className="font-sans text-xs text-on-surface-variant font-medium">{client.phone || ''}</p>
                      </td>

                      {/* Spent */}
                      <td className="px-lg py-md">
                        <p className="font-sans text-sm font-bold text-primary">${client.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="font-sans text-xs font-bold text-secondary">{client.transactionsCount} Transactions</p>
                      </td>

                      {/* Status */}
                      <td className="px-lg py-md">
                        <span className={`px-md py-1 rounded-full text-xs font-bold border ${
                          isActive
                            ? 'bg-secondary-container text-on-secondary-container border-secondary'
                            : 'bg-surface-container-highest text-on-surface-variant border-outline'
                        }`}>
                          {client.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-lg py-md text-right">
                        <div className="flex justify-end gap-2 items-center">
                          {deleteConfirmId === client.id ? (
                            <div className="flex items-center gap-1 animate-in fade-in duration-100">
                              <button
                                onClick={() => {
                                  deleteClient(client.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="bg-red-600 text-white px-md py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-all cursor-pointer"
                              >
                                Excluir?
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="bg-slate-100 border border-slate-300 px-sm py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => setSelectedClientForView(client)}
                                className="bg-white border border-primary text-primary px-sm py-1 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-xs cursor-pointer"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => setSelectedClientForEdit(client)}
                                className="bg-white border border-slate-300 text-slate-700 px-sm py-1 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all shadow-xs cursor-pointer"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(client.id)}
                                className="p-1 hover:text-error rounded-md text-on-surface-variant transition-colors cursor-pointer font-sans text-lg font-bold"
                                title="Descartar cliente"
                              >
                                ×
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 5. Pagination controls */}
        {totalPages > 1 && (
          <div className="p-lg border-t border-outline-variant flex justify-between items-center bg-surface-container-low">
            <span className="font-sans text-xs font-bold text-on-surface-variant">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded font-sans text-xs font-bold flex items-center justify-center transition-all ${
                    p === currentPage
                      ? 'bg-secondary text-white'
                      : 'border border-outline-variant hover:bg-surface-container-high text-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 6. Lower CTA Promo Content */}
      <section className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Analyze Patterns banner */}
        <div className="md:col-span-2 relative overflow-hidden bg-primary text-white rounded-xl p-xl flex flex-col justify-center min-h-[200px] border border-outline-variant/30">
          <div className="relative z-10 space-y-md">
            <h3 className="font-sans text-lg font-bold text-white mb-xs">Analyze Spending Patterns</h3>
            <p className="font-sans text-xs text-on-primary-container max-w-lg leading-relaxed">
              Unlock deep insights into your most valuable customers. Identify trends, predict churn, and automate personalized marketing campaigns with one click.
            </p>
            <button
              onClick={() => alert('Análise de IA de Comportamento de Clientes carregada baseada nas últimas vendas!')}
              className="bg-secondary text-white px-lg py-sm rounded-lg font-sans text-sm font-semibold hover:opacity-90 transition-all self-start flex items-center gap-1.5 shadow-xs"
            >
              <BarChart3 className="w-4 h-4 text-on-secondary" />
              View Analytics Dashboard
            </button>
          </div>
        </div>

        {/* Quick export banner */}
        <div className="bg-secondary-container rounded-xl p-xl border border-secondary/20 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white mb-md shadow-xs">
              <Sparkles className="w-5 h-5 text-on-secondary" />
            </div>
            <h3 className="font-sans text-[16px] font-bold text-on-secondary-container mb-xs">Export Client List</h3>
            <p className="font-sans text-xs text-on-secondary-fixed-variant leading-relaxed">
              Need to share your data? Export the current view to CSV or Excel formatted for mail merge.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="mt-lg w-full py-2 border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-lg font-sans text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export to CSV
          </button>
        </div>
      </section>

      {/* Embedded Modals */}
      <AddClientModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <ClientDetailsModal isOpen={selectedClientForView !== null} onClose={() => setSelectedClientForView(null)} client={selectedClientForView} />
      <EditClientModal isOpen={selectedClientForEdit !== null} onClose={() => setSelectedClientForEdit(null)} client={selectedClientForEdit} />
    </div>
  );
}
