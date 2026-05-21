'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { DollarSign, UserPlus, Clock, Package, TrendingUp, Calendar, Download, Info } from 'lucide-react';
import Image from 'next/image';

interface DashboardTabProps {
  searchQuery: string;
}

export default function DashboardTab({ searchQuery }: DashboardTabProps) {
  const { transactions, products, metrics, setActiveTab } = useCRM();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Filter transactions based on top search bar (if search query matches cliente, transaction id or amount)
  const filteredTransactions = transactions.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.clientName.toLowerCase().includes(q) ||
      t.amount.toString().includes(q) ||
      t.status.toLowerCase().includes(q)
    );
  }).slice(0, 5); // Limit to top 5 in dashboard view

  const handleExport = () => {
    try {
      const headers = ['Metric', 'Value'];
      const rows = [
        ['Total Sales ($)', metrics.totalSales.toFixed(2)],
        ['New Clients Count', metrics.newClients],
        ['Pending Orders Count', metrics.pendingOrdersCount],
        ['Inventory Value ($)', metrics.inventoryValue.toFixed(2)],
        ['Average Order Value ($)', metrics.avgOrderValue.toFixed(2)],
        ['Success Rate (%)', metrics.successRate.toFixed(1) + '%'],
        ['Total Registered Clients', metrics.totalClientsCount],
        ['Active Clients Count', metrics.activeClientsCount]
      ];

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `becka_resumo_operacional_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting dashboard report:', error);
      alert('Ocorreu um erro ao exportar o resumo operacional.');
    }
  };

  const chartData = [
    { month: 'Jan', actual: '$24.2k', height: 'h-[40%]' },
    { month: 'Feb', actual: '$33.3k', height: 'h-[55%]' },
    { month: 'Mar', actual: '$28.1k', height: 'h-[45%]' },
    { month: 'Apr', actual: '$41.8k', height: 'h-[70%]' },
    { month: 'May', actual: `$${(metrics.totalSales / 1000).toFixed(1)}k`, height: 'h-[85%]' },
    { month: 'Jun', actual: '$36.2k', height: 'h-[60%]', isForecast: true },
  ];

  return (
    <div className="space-y-xl">
      {/* Tab Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="font-sans text-2xl font-bold text-primary tracking-tight">Dashboard Overview</h2>
          <p className="font-sans text-sm text-on-surface-variant font-medium">
            {"Welcome back. Here's what's happening with Becka Variedades today."}
          </p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => alert('Filtro de período: Últimos 30 dias ativos!')}
            className="px-md py-sm bg-white border border-outline-variant rounded-lg font-sans text-sm font-semibold flex items-center gap-sm text-primary hover:bg-surface-container transition-colors"
          >
            <Calendar className="w-4 h-4 text-on-surface-variant" />
            Last 30 Days
          </button>
          <button
            onClick={handleExport}
            className="px-md py-sm bg-secondary text-on-secondary rounded-lg font-sans text-sm font-semibold flex items-center gap-sm hover:opacity-90 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-on-secondary" />
            Export Report
          </button>
        </div>
      </section>

      {/* Dynamic Bento Cards Section */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Total Sales Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col justify-between group hover:border-secondary transition-all hover:translate-y-[-2px] hover:shadow-xs duration-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-secondary-container rounded-lg">
              <DollarSign className="w-5 h-5 text-on-secondary-container font-bold" />
            </div>
            <span className="text-secondary font-sans text-xs font-bold flex items-center gap-0.5">
              +12.5% <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-lg">
            <p className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Sales</p>
            <h3 className="font-sans text-2xl font-extrabold text-primary mt-1">
              ${metrics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* New Clients Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col justify-between group hover:border-secondary transition-all hover:translate-y-[-2px] hover:shadow-xs duration-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-tertiary-fixed rounded-lg">
              <UserPlus className="w-5 h-5 text-on-tertiary-fixed-variant" />
            </div>
            <span className="text-secondary font-sans text-xs font-bold flex items-center gap-0.5">
              +8% <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-lg">
            <p className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">New Clients</p>
            <h3 className="font-sans text-2xl font-extrabold text-primary mt-1">
              {metrics.newClients}
            </h3>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col justify-between group hover:border-secondary transition-all hover:translate-y-[-2px] hover:shadow-xs duration-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-error-container rounded-lg">
              <Clock className="w-5 h-5 text-on-error-container font-bold" />
            </div>
            <span className="text-error font-sans text-xs font-bold">
              2 Overdue
            </span>
          </div>
          <div className="mt-lg">
            <p className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pending Orders</p>
            <h3 className="font-sans text-2xl font-extrabold text-primary mt-1">
              {metrics.pendingOrdersCount}
            </h3>
          </div>
        </div>

        {/* Inventory Value Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col justify-between group hover:border-secondary transition-all hover:translate-y-[-2px] hover:shadow-xs duration-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-primary-fixed rounded-lg">
              <Package className="w-5 h-5 text-on-primary-fixed-variant" />
            </div>
            <span className="text-on-surface-variant font-sans text-xs font-semibold">
              85% Stock
            </span>
          </div>
          <div className="mt-lg">
            <p className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Inventory Value</p>
            <h3 className="font-sans text-2xl font-extrabold text-primary mt-1">
              ${metrics.inventoryValue.toLocaleString('en-US')}
            </h3>
          </div>
        </div>
      </main>

      {/* Revenue Graph & Best Sellers List */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Revenue Chart Representation */}
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-xl p-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h4 className="font-sans text-lg font-bold text-primary">Monthly Revenue</h4>
              <p className="text-xs text-on-surface-variant font-medium">Click on any bar to see details</p>
            </div>
            <div className="flex gap-md">
              <div className="flex items-center gap-sm">
                <span className="w-3 h-3 bg-secondary rounded-full"></span>
                <span className="font-sans text-xs font-semibold text-on-surface-variant">Actual</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="w-3 h-3 bg-outline-variant rounded-full"></span>
                <span className="font-sans text-xs font-semibold text-on-surface-variant">Forecast</span>
              </div>
            </div>
          </div>

          {/* Interactive Custom Bar Chart */}
          <div className="relative h-64 w-full flex items-end justify-between gap-4 pt-8">
            {/* Guide Lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-on-surface-variant text-[11px] font-bold pointer-events-none opacity-40">
              <span className="border-b border-outline-variant/30 pb-1">$60k</span>
              <span className="border-b border-outline-variant/30 pb-1">$40k</span>
              <span className="border-b border-outline-variant/30 pb-1">$20k</span>
              <span className="pb-1">$0</span>
            </div>

            {/* Rendered Bars */}
            {chartData.map((data, idx) => (
              <div
                key={data.month}
                onClick={() => setSelectedMonth(selectedMonth === data.month ? null : data.month)}
                className="flex-1 flex flex-col justify-end group cursor-pointer relative z-10"
              >
                {/* Custom Tooltip */}
                {selectedMonth === data.month && (
                  <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-150">
                    {data.actual} {data.isForecast ? 'Forecast' : 'Revenue'}
                  </div>
                )}

                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${data.height} ${
                    data.isForecast
                      ? 'bg-outline-variant border-t-2 border-dashed border-secondary'
                      : 'bg-secondary-container group-hover:bg-secondary group-hover:opacity-100'
                  } ${selectedMonth === data.month ? 'bg-secondary ring-2 ring-secondary/20' : ''}`}
                ></div>
                <span className="mt-sm text-center font-sans text-xs font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* best sellers container */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col justify-between">
          <div>
            <h4 className="font-sans text-lg font-bold text-primary mb-lg">Best Sellers</h4>
            <div className="space-y-md">
              {/* Product 1 */}
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 bg-surface-container-high rounded-lg overflow-hidden border border-outline-variant flex-shrink-0 relative">
                  <Image
                    alt="Premium Watch photo"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzFUArR8Lua1wK6VsJybSIxgFWSHINf6295YHYvhJIdr8dGPkVfvMPNeI6DvWcJDhBiGCfwuntMG4h_E5eoP-Zv7evKl7dT7QbqoTduCRJe5rrb0FGOqnQqQgfMkPEp76rVFm4rJb5yYV8OpX1xYmvTzRJuY9HxNjXr6-VbLh_UboOpvCPwjyaixhp7M-PJInftyoZXgvZxUhx_YgIhc7-Q6kAJ6S6ppkJbFNCFZsw1m-lUywwiiuySHObefHYIRkx24rM6n4jQ1g"
                    fill
                    sizes="48px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-sans text-sm font-semibold text-primary">Premium Watch X1</p>
                  <p className="font-sans text-xs font-medium text-on-surface-variant">142 Sales</p>
                </div>
                <p className="font-sans text-sm font-bold text-secondary">$12,400</p>
              </div>

              {/* Product 2 */}
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 bg-surface-container-high rounded-lg overflow-hidden border border-outline-variant flex-shrink-0 relative">
                  <Image
                    alt="Designer Tote photo"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRfW-kopo7_ra8t2bUYOFLGkI9cMdnI88U5QJg3TS45jGXRU4_6atMRHcwEZG9rGhLWun811tQK_wft4ujU-lR9kHB8LRvE0s2vaKhANA0iQ6NAHeTiwAH49P995gXS2GKSfXtmEOaQFeSl95KPCiIlFkQ4ppPDsFab52JHxVY1OQCKz8L7W58z6h23Ejvi74Dn2UY23172L_NVmeNhl4dT6nRYP1J7rOW7bpum4mkYhvtyEWg9_NechhgtW_yuVFOvkKuriTO1rw"
                    fill
                    sizes="48px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-sans text-sm font-semibold text-primary">Designer Tote</p>
                  <p className="font-sans text-xs font-medium text-on-surface-variant">98 Sales</p>
                </div>
                <p className="font-sans text-sm font-bold text-secondary">$8,920</p>
              </div>

              {/* Product 3 */}
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 bg-surface-container-high rounded-lg overflow-hidden border border-outline-variant flex-shrink-0 relative">
                  <Image
                    alt="Running Shoes photo"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk8RYS1iKtr-ZxwQ5lh43pqaADf7daF9C7f9ayPGR2Z4KqV_kpxzgioMXL4-yYoS6Y3Ya6MWzBdh3BiwyHl09Mr0RF0OMpNgHeQuk8XdJuoVWIVlGLXZc8PvSceoJT0TwX1UEYUiYe4ntGNQzkIwmUQpdTLnoXa00qrfSOwqDwNCP1otK1e7X7TtwGqBItXq8LghCtV_LwoL42GL3rQXpRHAebZvNNnE43Ag1j6QVHdgsdg6inP8FQQvuxGlDqBQj6irE1NyBtjsA"
                    fill
                    sizes="48px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-sans text-sm font-semibold text-primary">Pro Runner Shoes</p>
                  <p className="font-sans text-xs font-medium text-on-surface-variant">85 Sales</p>
                </div>
                <p className="font-sans text-sm font-bold text-secondary">$7,480</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('Inventory')}
            className="w-full mt-lg py-sm.5 text-secondary font-sans text-sm font-bold border border-secondary rounded-lg hover:bg-secondary-container transition-all"
          >
            View Inventory
          </button>
        </div>
      </section>

      {/* Recent Transactions List */}
      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-lg flex items-center justify-between border-b border-outline-variant">
          <h4 className="font-sans text-lg font-bold text-primary">Recent Transactions</h4>
          <button
            onClick={() => setActiveTab('Sales')}
            className="text-secondary font-sans text-sm font-bold hover:underline transition-all"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-xl text-on-surface-variant text-sm font-medium">
              Nenhuma transação cadastrada ou correspondente aos termos de busca.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-lg py-sm font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Transaction ID</th>
                  <th className="px-lg py-sm font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Client</th>
                  <th className="px-lg py-sm font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-lg py-sm font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="px-lg py-sm font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredTransactions.map(trx => {
                  const initials = trx.clientName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  // Colors based on status
                  const isSuccess = trx.status === 'Completed' || trx.status === 'Paid';
                  const isPending = trx.status === 'Pending';

                  return (
                    <tr key={trx.id} className="hover:bg-surface-container transition-colors duration-150">
                      <td className="px-lg py-md font-sans text-sm font-semibold text-primary">{trx.id}</td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-[10px] ${
                            isSuccess
                              ? 'bg-secondary-container text-on-secondary-container'
                              : isPending
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                              : 'bg-primary-fixed text-on-primary-fixed'
                          }`}>
                            {initials}
                          </div>
                          <span className="font-sans text-sm font-medium text-primary">{trx.clientName}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md">
                        <span className={`px-sm py-1 rounded-full font-sans text-xs font-bold ${
                          isSuccess
                            ? 'bg-secondary-container text-on-secondary-container'
                            : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-error-container text-on-error-container'
                        }`}>
                          {trx.status === 'Paid' ? 'Paid' : trx.status}
                        </span>
                      </td>
                      <td className="px-lg py-md font-sans text-sm font-medium text-on-surface-variant">{trx.date}</td>
                      <td className="px-lg py-md font-sans text-sm font-extrabold text-primary text-right">
                        ${trx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
