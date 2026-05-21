'use client';

import React, { useState } from 'react';
import { useCRM, Transaction } from '@/lib/crm-context';
import { Receipt, Calendar, Download, Eye, Clock, Mail, ChevronLeft, ChevronRight, CheckCircle, Flame, ArrowRight, CornerRightUp } from 'lucide-react';
import { EditTransactionModal } from '@/components/modals';

interface SalesTabProps {
  searchQuery: string;
}

export default function SalesTab({ searchQuery }: SalesTabProps) {
  const { transactions, metrics, deleteTransaction, updateTransactionStatus } = useCRM();

  // Search, Filters and Pagination states
  const [periodFilter, setPeriodFilter] = useState<'30' | 'this_month' | 'quarter'>('30');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Cancelled'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [activeActionsMenu, setActiveActionsMenu] = useState<string | null>(null);
  const [selectedTransactionForEdit, setSelectedTransactionForEdit] = useState<Transaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Search + Filter Logic
  const filteredTransactions = transactions.filter(t => {
    // Top search bar match
    const matchesSearch = searchQuery
      ? t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.amount.toString().includes(searchQuery)
      : true;

    // Status select match
    const isSuccessState = t.status === 'Completed' || t.status === 'Paid';
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Paid'
        ? isSuccessState
        : t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const handleExport = () => {
    try {
      const headers = ['Order ID', 'Client Name', 'Date', 'Amount ($)', 'Status', 'Items Counter'];
      const rows = filteredTransactions.map(t => [
        t.id,
        `"${t.clientName.replace(/"/g, '""')}"`,
        t.date,
        t.amount.toFixed(2),
        t.status,
        t.items ? t.items.length : 0
      ]);

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `becka_vendas_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting transactions to CSV:', error);
      alert('Ocorreu um erro ao exportar o relatório de faturamento.');
    }
  };

  return (
    <div className="space-y-xl">
      {/* 1. Header Block */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
        <div>
          <h2 className="font-sans text-2xl font-bold text-primary tracking-tight">Sales Transactions</h2>
          <p className="font-sans text-sm text-on-surface-variant font-medium">Manage and monitor your retail sales performance.</p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={handleExport}
            className="flex items-center gap-sm px-lg py-sm bg-secondary text-on-secondary font-sans text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-on-secondary" />
            <span>Export Report</span>
          </button>
        </div>
      </section>

      {/* 2. Bento Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
        {/* Total Sales */}
        <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col justify-between hover:border-secondary transition-colors group">
          <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Sales (MTD)</span>
          <span className="font-sans text-2xl font-extrabold text-primary mt-1">
            ${metrics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-secondary font-sans text-xs font-bold flex items-center gap-xs mt-3">
            <CornerRightUp className="w-3.5 h-3.5" />
            +12% from last month
          </span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col justify-between hover:border-secondary transition-colors">
          <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pending Orders</span>
          <span className="font-sans text-2xl font-extrabold text-primary mt-1">
            {metrics.pendingOrdersCount}
          </span>
          <span className="text-on-surface-variant font-sans text-xs font-semibold mt-3">Requires attention</span>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col justify-between hover:border-secondary transition-colors">
          <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Avg. Order Value</span>
          <span className="font-sans text-2xl font-extrabold text-primary mt-1">
            ${metrics.avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-secondary font-sans text-xs font-bold flex items-center gap-xs mt-3">
            <CornerRightUp className="w-3.5 h-3.5" />
            +4% growth
          </span>
        </div>

        {/* Success Rate */}
        <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col justify-between hover:border-secondary transition-colors">
          <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Success Rate</span>
          <span className="font-sans text-2xl font-extrabold text-primary mt-1">
            {metrics.successRate.toFixed(1)}%
          </span>
          <span className="text-secondary font-sans text-xs font-bold flex items-center gap-xs mt-3">
            <CheckCircle className="w-3.5 h-3.5 text-secondary" />
            Optimal performance
          </span>
        </div>
      </section>

      {/* 3. Action Filter Header */}
      <section className="bg-white border border-outline-variant p-md rounded-xl mb-md flex flex-wrap items-center gap-md justify-between shadow-xs">
        <div className="flex flex-wrap items-center gap-md">
          {/* Period selector */}
          <div className="flex items-center gap-sm bg-white border border-outline-variant rounded-lg px-md py-1.5 hover:border-outline transition-colors">
            <Calendar className="w-4 h-4 text-on-surface-variant" />
            <select
              value={periodFilter}
              onChange={e => setPeriodFilter(e.target.value as any)}
              className="border-none bg-transparent font-sans text-xs font-bold text-primary focus:ring-0 cursor-pointer outline-none"
            >
              <option value="30">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-sm bg-white border border-outline-variant rounded-lg px-md py-1.5 hover:border-outline transition-colors">
            <Receipt className="w-4 h-4 text-on-surface-variant" />
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="border-none bg-transparent font-sans text-xs font-bold text-primary focus:ring-0 cursor-pointer outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="text-on-surface-variant font-sans text-xs font-semibold">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} transactions
        </div>
      </section>

      {/* 4. Transactions Table */}
      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {paginatedTransactions.length === 0 ? (
            <div className="text-center py-xl text-on-surface-variant text-sm font-semibold">
              Nenhuma transação correspondente aos filtros de busca atuais.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Order ID</th>
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Client</th>
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Amount</th>
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-lg py-md font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paginatedTransactions.map(trx => {
                  const initials = trx.clientName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  const isPaid = trx.status === 'Paid' || trx.status === 'Completed';
                  const isPending = trx.status === 'Pending';

                  return (
                    <tr key={trx.id} className="hover:bg-surface-container-low transition-colors duration-150">
                      {/* ID */}
                      <td className="px-lg py-md font-sans text-sm font-bold text-primary">{trx.id}</td>

                      {/* Client */}
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-[10px] ${
                            isPaid ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary-container'
                          }`}>
                            {initials}
                          </div>
                          <span className="font-sans text-sm font-medium text-primary">{trx.clientName}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-lg py-md font-sans text-sm font-medium text-on-surface-variant">{trx.date}</td>

                      {/* Amount */}
                      <td className="px-lg py-md font-sans text-sm font-bold text-primary">${trx.amount.toFixed(2)}</td>

                      {/* Status badge */}
                      <td className="px-lg py-md">
                        <span className={`px-sm py-1 rounded-sm font-sans text-[10px] uppercase font-bold inline-flex items-center gap-1.5 ${
                          isPaid
                            ? 'bg-green-100 text-green-800'
                            : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isPaid ? 'bg-green-600' : isPending ? 'bg-amber-600' : 'bg-red-600'
                          }`}></span>
                          {trx.status === 'Paid' || trx.status === 'Completed' ? 'Paid' : trx.status}
                        </span>
                      </td>

                      {/* Dynamic status toggle controls */}
                      <td className="px-lg py-md text-right relative">
                        <div className="flex justify-end gap-1 items-center">
                          <button
                            onClick={() => setActiveActionsMenu(activeActionsMenu === trx.id ? null : trx.id)}
                            className="p-1 hover:bg-surface-container rounded-md text-on-surface-variant hover:text-primary transition-all font-bold text-base"
                            title="Gerenciar transação"
                          >
                            ⚙
                          </button>
                        </div>

                        {/* Interactive status action list */}
                        {activeActionsMenu === trx.id && (
                          <div className="absolute right-6 top-[40px] bg-white border border-outline-variant rounded-lg p-1.5 shadow-md z-30 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-150 min-w-[150px]">
                            {deleteConfirmId === trx.id ? (
                              <div className="p-1 space-y-1">
                                <p className="text-[10px] text-red-600 font-bold px-1 text-center">Confirmar exclusão?</p>
                                <button
                                  onClick={() => {
                                    deleteTransaction(trx.id);
                                    setDeleteConfirmId(null);
                                    setActiveActionsMenu(null);
                                  }}
                                  className="w-full text-center text-xs font-bold block px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                  Sim, Deletar
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirmId(null);
                                  }}
                                  className="w-full text-center text-xs font-semibold block px-2 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    updateTransactionStatus(trx.id, 'Paid');
                                    setActiveActionsMenu(null);
                                  }}
                                  className="w-full text-left text-xs font-bold block px-2 py-1 hover:bg-green-50 text-green-700 rounded transition-colors cursor-pointer"
                                >
                                  Marcar Pago
                                </button>
                                <button
                                  onClick={() => {
                                    updateTransactionStatus(trx.id, 'Pending');
                                    setActiveActionsMenu(null);
                                  }}
                                  className="w-full text-left text-xs font-bold block px-2 py-1 hover:bg-amber-50 text-amber-700 rounded transition-colors cursor-pointer"
                                >
                                  Marcar Pendente
                                </button>
                                <button
                                  onClick={() => {
                                    updateTransactionStatus(trx.id, 'Cancelled');
                                    setActiveActionsMenu(null);
                                  }}
                                  className="w-full text-left text-xs font-bold block px-2 py-1 hover:bg-red-50 text-red-700 rounded transition-colors cursor-pointer"
                                >
                                  Marcar Cancelado
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTransactionForEdit(trx);
                                    setActiveActionsMenu(null);
                                  }}
                                  className="w-full text-left text-xs font-bold block px-2 py-1 hover:bg-slate-50 text-slate-700 rounded transition-colors cursor-pointer"
                                >
                                  Editar Valor/Status
                                </button>
                                <div className="h-px bg-outline-variant/50 my-1"></div>
                                <button
                                  onClick={() => {
                                    setDeleteConfirmId(trx.id);
                                  }}
                                  className="w-full text-left text-xs font-bold block px-2 py-1 hover:bg-red-50 text-red-600 rounded transition-colors cursor-pointer"
                                >
                                  Deletar Registro
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Action Pagination bar */}
        {totalPages > 1 && (
          <div className="px-lg py-md flex items-center justify-between bg-surface-container-lowest border-t border-outline-variant">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-md py-1.5 border border-outline-variant rounded-lg font-sans text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-sm disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex gap-sm">
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
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-md py-1.5 border border-outline-variant rounded-lg font-sans text-xs font-semibold text-primary hover:bg-surface-container transition-colors flex items-center gap-sm cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 5. Lower Highlight widgets */}
      <section className="mt-xl grid grid-cols-1 md:grid-cols-2 gap-lg">
        {/* Daily sales goal progress */}
        <div className="bg-[#1e293b] text-white p-lg rounded-xl flex flex-col justify-between relative overflow-hidden group border border-slate-700">
          <div className="relative z-10">
            <h4 className="font-sans text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Flame className="w-5 h-5 text-secondary-container" />
              Daily Sales Goal
            </h4>
            <p className="font-sans text-xs text-white/80 mb-lg">{"You've reached 75% of your target for today."}</p>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-sm">
              <div className="h-full bg-secondary-container w-[75%] rounded-full"></div>
            </div>
            <button
              onClick={() => alert('Parabéns! Sua meta diária de hoje é $400.00 e você atingiu $302.50 até o momento.')}
              className="text-secondary-container font-sans text-xs font-semibold flex items-center gap-xs hover:underline pt-2"
            >
              View details
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Support block */}
        <div className="bg-white border border-outline-variant p-lg rounded-xl flex items-center gap-md">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h4 className="font-sans text-[15px] font-bold text-primary">Support Needed?</h4>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Chat with our account managers for help with reconciliations.</p>
            <button
              onClick={() => alert('Fale com Becka: altiseven@gmail.com ou Whats +55 11 98765-4321')}
              className="bg-primary text-white py-1 px-md rounded-lg font-sans text-xs font-bold hover:opacity-90 transition-all shadow-xs"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <EditTransactionModal isOpen={selectedTransactionForEdit !== null} onClose={() => setSelectedTransactionForEdit(null)} transaction={selectedTransactionForEdit} />
    </div>
  );
}
