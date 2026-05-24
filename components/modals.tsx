'use client';

import React, { useState } from 'react';
import { useCRM, Client, Product, Transaction } from '@/lib/crm-context';
import { X, Plus, Trash2, Calendar, FileText, CheckCircle2, AlertTriangle, Play, HelpCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. ADD CLIENT MODAL
export function AddClientModal({ isOpen, onClose }: ModalProps) {
  const { addClient } = useCRM();
  const [name, setName] = useState('');
  const [email, setEmail ] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    addClient({ name, email, phone, status });
    setName('');
    setEmail('');
    setPhone('');
    setStatus('Active');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/25 backdrop-blur-[2px] flex items-center justify-center z-[100] p-[30px] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-full">
        <div className="px-5 py-5 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="font-headline-md text-primary font-bold text-lg">Adicionar Novo Cliente</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nome Completo</label>
            <input
              type="text"
              required
              placeholder="ex: João da Silva"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-outline-variant rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">E-mail</label>
            <input
              type="email"
              required
              placeholder="ex: joao@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-outline-variant rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Telefone / WhatsApp</label>
            <input
              type="text"
              placeholder="ex: +55 11 99999-9999"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-outline-variant rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status Inicial</label>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-primary">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'Active'}
                  onChange={() => setStatus('Active')}
                  className="text-secondary focus:ring-secondary h-4 w-4"
                />
                Ativo
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-primary">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'Inactive'}
                  onChange={() => setStatus('Inactive')}
                  className="text-secondary focus:ring-secondary h-4 w-4"
                />
                Inativo
              </label>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-outline text-primary text-sm hover:bg-surface-container font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-secondary text-on-secondary text-sm hover:opacity-90 font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. ADD PRODUCT MODAL
export function AddProductModal({ isOpen, onClose }: ModalProps) {
  const { addProduct } = useCRM();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Accessories');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [series, setSeries] = useState('New Release');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !price || !stock) return;

    // Use random picsum image if no real URL (but styled beautifully with products)
    const randomSeed = Math.floor(Math.random() * 1000);
    const image = `https://picsum.photos/seed/${randomSeed}/200/200`;

    addProduct({
      name,
      sku,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      image,
      series
    });

    setName('');
    setSku('');
    setCategory('Accessories');
    setPrice('');
    setStock('');
    setSeries('New Release');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/20 flex items-center justify-center z-[100] p-md">
      <div className="bg-white rounded-xl border border-outline-variant w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="font-headline-md text-primary font-bold text-lg">Cadastrar Novo Produto</h3>
          <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nome do Produto</label>
            <input
              type="text"
              required
              placeholder="ex: Óculos de Sol Retrô"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Código SKU</label>
              <input
                type="text"
                required
                placeholder="ex: WA-102"
                value={sku}
                onChange={e => setSku(e.target.value.toUpperCase())}
                className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
              />
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Categoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
              >
                <option value="Accessories">Acessórios</option>
                <option value="Footwear">Calçados</option>
                <option value="Tech">Eletrônicos</option>
                <option value="Other">Outros</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Preço unitário ($)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="ex: 120.00"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
              />
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Estoque Inicial</label>
              <input
                type="number"
                required
                placeholder="ex: 85"
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
              />
            </div>
          </div>
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Série / Coleção (Opcional)</label>
            <input
              type="text"
              placeholder="ex: Coleção de Luxo"
              value={series}
              onChange={e => setSeries(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
            />
          </div>
          <div className="pt-md flex justify-end gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-md py-sm rounded-lg border border-outline text-primary text-sm hover:bg-surface-container transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-lg py-sm rounded-lg bg-secondary text-on-secondary text-sm hover:opacity-90 font-semibold transition-opacity"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. NEW TRANSACTION MODAL  (RECORD A SALE)
export function NewTransactionModal({ isOpen, onClose }: ModalProps) {
  const { clients, products, addTransaction } = useCRM();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [status, setStatus] = useState<Transaction['status']>('Paid');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !selectedProductId || !quantity) return;

    const client = clients.find(c => c.id === selectedClientId);
    const product = products.find(p => p.id === selectedProductId);

    if (!client || !product) return;

    const qty = parseInt(quantity);
    const amount = product.price * qty;

    addTransaction({
      clientId: client.id,
      clientName: client.name,
      status,
      amount,
      items: [
        {
          productId: product.id,
          productName: product.name,
          qty,
          price: product.price
        }
      ]
    });

    setSelectedClientId('');
    setSelectedProductId('');
    setQuantity('1');
    setStatus('Paid');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/20 flex items-center justify-center z-[100] p-md">
      <div className="bg-white rounded-xl border border-outline-variant w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="font-headline-md text-primary font-bold text-lg">Registrar Nova Venda</h3>
          <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Cliente comprador</label>
            <select
              required
              value={selectedClientId}
              onChange={e => setSelectedClientId(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
            >
              <option value="">Selecione um Cliente...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-md">
            <div className="col-span-2 space-y-xs">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Produto</label>
              <select
                required
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
              >
                <option value="">Selecione...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.name} - ${p.price.toFixed(2)} ({p.stock} em estoque)
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Qtde</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
              />
            </div>
          </div>
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status do Pagamento</label>
            <div className="flex gap-md pt-xs">
              <label className="flex items-center gap-sm cursor-pointer text-sm font-semibold text-primary">
                <input
                  type="radio"
                  name="venda_status"
                  checked={status === 'Paid' || status === 'Completed'}
                  onChange={() => setStatus('Paid')}
                  className="text-secondary focus:ring-secondary"
                />
                Pago / Concluído
              </label>
              <label className="flex items-center gap-sm cursor-pointer text-sm font-semibold text-primary">
                <input
                  type="radio"
                  name="venda_status"
                  checked={status === 'Pending'}
                  onChange={() => setStatus('Pending')}
                  className="text-secondary focus:ring-secondary"
                />
                Pendente
              </label>
            </div>
          </div>
          <div className="pt-md flex justify-end gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-md py-sm rounded-lg border border-outline text-primary text-sm hover:bg-surface-container transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-lg py-sm rounded-lg bg-secondary text-on-secondary text-sm hover:opacity-90 font-semibold transition-opacity"
            >
              Confirmar Transação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. CLIENT DETAILS DRILL-DOWN MODAL
interface ClientDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export function ClientDetailsModal({ isOpen, onClose, client }: ClientDetailsProps) {
  const { transactions } = useCRM();

  if (!isOpen || !client) return null;

  const clientOrders = transactions.filter(t => t.clientId === client.id || t.clientName === client.name);

  return (
    <div className="fixed inset-0 bg-slate-950/20 flex items-center justify-center z-[100] p-md">
      <div className="bg-white rounded-xl border border-outline-variant w-full max-w-2xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <div>
            <h3 className="font-headline-md text-primary font-bold text-lg">Detalhes do Cliente</h3>
            <p className="text-xs text-on-surface-variant">Histórico de compras e relacionamento</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-lg space-y-lg max-h-[500px] overflow-y-auto">
          {/* Client Bio Header */}
          <div className="flex flex-col sm:flex-row gap-lg bg-surface-container-low p-md rounded-lg border border-outline-variant">
            <div className="w-14 h-14 rounded-full bg-secondary text-on-secondary font-display font-bold flex items-center justify-center text-xl">
              {client.name.split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-headline-md text-primary font-bold text-base">{client.name}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm text-sm text-on-surface-variant">
                <p><span className="font-semibold text-primary">E-mail:</span> {client.email}</p>
                <p><span className="font-semibold text-primary">Telefone:</span> {client.phone || 'Sem cadastrado'}</p>
                <p><span className="font-semibold text-primary">Membro desde:</span> {client.memberSince}</p>
                <p>
                  <span className="font-semibold text-primary">Status:</span>{' '}
                  <span className={`px-sm py-0.5 text-xs font-bold rounded-full border ${client.status === 'Active' ? 'bg-secondary-container text-on-secondary-container border-secondary' : 'bg-surface-container-highest text-on-surface-variant border-outline'}`}>
                    {client.status === 'Active' ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Sales History */}
          <div className="space-y-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant pb-xs">Histórico de Transações</h4>
            {clientOrders.length === 0 ? (
              <div className="text-center py-md text-on-surface-variant text-sm">Nenhuma transação gravada para este cliente.</div>
            ) : (
              <div className="border border-outline-variant rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-outline-variant text-[11px] font-bold uppercase text-on-surface-variant">
                    <tr>
                      <th className="px-md py-sm">Transação ID</th>
                      <th className="px-md py-sm">Data</th>
                      <th className="px-md py-sm">Status</th>
                      <th className="px-md py-sm text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant text-sm">
                    {clientOrders.map(o => (
                      <tr key={o.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-sm font-semibold text-primary">{o.id}</td>
                        <td className="px-md py-sm text-on-surface-variant">{o.date}</td>
                        <td className="px-md py-sm">
                          <span className={`px-sm py-0.5 rounded-full text-xs font-bold ${
                            o.status === 'Paid' || o.status === 'Completed' ? 'bg-secondary-container text-on-secondary-container' : 
                            o.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {o.status === 'Paid' || o.status === 'Completed' ? 'Pago' : o.status === 'Pending' ? 'Pendente' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="px-md py-sm text-right font-bold text-primary">${o.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="px-lg py-sm border-t border-outline-variant bg-surface-container-low flex justify-end">
          <button onClick={onClose} className="px-md py-sm bg-primary text-on-primary rounded-lg text-sm hover:opacity-90 transition-opacity font-semibold">
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. EDIT CLIENT MODAL (CRUD)
interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export function EditClientModal({ isOpen, onClose, client }: EditClientModalProps) {
  const { updateClient } = useCRM();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  React.useEffect(() => {
    if (client) {
      Promise.resolve().then(() => {
        setName(client.name);
        setEmail(client.email);
        setPhone(client.phone || '');
        setStatus(client.status);
      });
    }
  }, [client, isOpen]);

  if (!isOpen || !client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    updateClient(client.id, { name, email, phone, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/20 flex items-center justify-center z-[100] p-md">
      <div className="bg-white rounded-xl border border-outline-variant w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="font-headline-md text-primary font-bold text-lg">Editar Cliente</h3>
          <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
            />
          </div>
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
            />
          </div>
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Telefone / WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
            />
          </div>
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</label>
            <div className="flex gap-md pt-xs">
              <label className="flex items-center gap-sm cursor-pointer text-sm font-medium text-primary">
                <input
                  type="radio"
                  name="edit_status"
                  checked={status === 'Active'}
                  onChange={() => setStatus('Active')}
                  className="text-secondary focus:ring-secondary cursor-pointer"
                />
                Ativo
              </label>
              <label className="flex items-center gap-sm cursor-pointer text-sm font-medium text-primary">
                <input
                  type="radio"
                  name="edit_status"
                  checked={status === 'Inactive'}
                  onChange={() => setStatus('Inactive')}
                  className="text-secondary focus:ring-secondary cursor-pointer"
                />
                Inativo
              </label>
            </div>
          </div>
          <div className="pt-md flex justify-end gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-md py-sm rounded-lg border border-outline text-primary text-sm hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-lg py-sm rounded-lg bg-secondary text-on-secondary text-sm hover:opacity-90 font-semibold transition-opacity cursor-pointer"
            >
              Atualizar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 6. EDIT PRODUCT MODAL (CRUD)
interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const { updateProduct } = useCRM();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Accessories');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [series, setSeries] = useState('');

  React.useEffect(() => {
    if (product) {
      Promise.resolve().then(() => {
        setName(product.name);
        setSku(product.sku);
        setCategory(product.category);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setSeries(product.series || '');
      });
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !price || !stock) return;

    updateProduct(product.id, {
      name,
      sku,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      series
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/20 flex items-center justify-center z-[100] p-md">
      <div className="bg-white rounded-xl border border-outline-variant w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="font-headline-md text-primary font-bold text-lg">Editar Produto</h3>
          <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nome do Produto</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Código SKU</label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value.toUpperCase())}
                className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
              />
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Categoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
              >
                <option value="Accessories">Acessórios</option>
                <option value="Footwear">Calçados</option>
                <option value="Tech">Eletrônicos</option>
                <option value="Other">Outros</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Preço unitário ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
              />
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Estoque Atual</label>
              <input
                type="number"
                required
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
              />
            </div>
          </div>
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Série / Coleção (Opcional)</label>
            <input
              type="text"
              value={series}
              onChange={e => setSeries(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
            />
          </div>
          <div className="pt-md flex justify-end gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-md py-sm rounded-lg border border-outline text-primary text-sm hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-lg py-sm rounded-lg bg-secondary text-on-secondary text-sm hover:opacity-90 font-semibold transition-opacity cursor-pointer"
            >
              Atualizar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 7. EDIT TRANSACTION MODAL (CRUD)
interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
  const { updateTransaction } = useCRM();
  const [status, setStatus] = useState<Transaction['status']>('Paid');
  const [amount, setAmount] = useState('');

  React.useEffect(() => {
    if (transaction) {
      Promise.resolve().then(() => {
        setStatus(transaction.status);
        setAmount(transaction.amount.toString());
      });
    }
  }, [transaction, isOpen]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    updateTransaction(transaction.id, {
      status,
      amount: parseFloat(amount)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/20 flex items-center justify-center z-[100] p-md">
      <div className="bg-white rounded-xl border border-outline-variant w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="font-headline-md text-primary font-bold text-lg">Editar Registro de Venda</h3>
          <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div className="space-y-sm">
            <p className="text-sm font-semibold text-primary">Pedido: <span className="font-mono text-secondary">{transaction.id}</span></p>
            <p className="text-sm font-medium text-slate-700">Cliente: <span className="font-bold text-primary">{transaction.clientName}</span></p>
          </div>
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Valor total da venda ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
            />
          </div>
          <div className="space-y-xs">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status do Pagamento</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full bg-white border border-outline-variant rounded-md px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md text-primary"
            >
              <option value="Paid">Pago</option>
              <option value="Pending">Pendente</option>
              <option value="Completed">Concluído</option>
              <option value="Cancelled">Cancelado</option>
            </select>
          </div>
          <div className="pt-md flex justify-end gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-md py-sm rounded-lg border border-outline text-primary text-sm hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-lg py-sm rounded-lg bg-secondary text-on-secondary text-sm hover:opacity-90 font-semibold transition-opacity cursor-pointer"
            >
              Atualizar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 5. DATABASE SETTINGS MODAL (SUPABASE)
export function DbSettingsModal({ isOpen, onClose }: ModalProps) {
  const {
    supabaseConnected,
    supabaseConfigured,
    supabaseLoading,
    supabaseSchemaMissing,
    syncAllWithSupabase,
    importInitialDataToSupabase,
    clients,
    products,
    transactions
  } = useCRM();

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSync = async () => {
    setSyncStatus('syncing');
    try {
      await syncAllWithSupabase();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3500);
    } catch (err: any) {
      setSyncStatus('error');
      setErrorMessage(err.message || 'Erro inesperado na sincronização.');
    }
  };

  const handleImportInitial = async () => {
    if (confirm('Atenção: Isso enviará o conjunto inicial de dados fictícios para o seu banco Supabase. Deseja prosseguir?')) {
      setSyncStatus('syncing');
      try {
        await importInitialDataToSupabase();
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 3500);
      } catch (err: any) {
        setSyncStatus('error');
        setErrorMessage(err.message || 'Erro inesperado ao popular dados.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/20 flex items-center justify-center z-[100] p-md">
      <div className="bg-white rounded-xl border border-outline-variant w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-secondary/10 rounded flex items-center justify-center">
              <span className="text-secondary text-sm">📁</span>
            </div>
            <h3 className="font-headline-sm text-primary font-bold text-lg">Integração com Supabase</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-lg space-y-md">
          {/* Status Panel */}
          <div className="bg-slate-50 rounded-lg p-md border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-md">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Status da Conexão</span>
              <div className="flex items-center gap-2">
                {supabaseConnected ? (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-slate-800">Conectado ao Supabase Cloud</span>
                  </>
                ) : supabaseSchemaMissing ? (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-sm font-bold text-rose-700">Tabelas Ausentes (Exige Migration)</span>
                  </>
                ) : supabaseConfigured ? (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-sm font-bold text-slate-850">Erro de credenciais / Inacessível</span>
                  </>
                ) : (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="text-sm font-bold text-slate-500">Credenciais não configuradas</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-sm py-1 rounded">
              <span>Registros Locais: </span>
              <span className="font-bold text-secondary font-mono">{clients.length} Cli | {products.length} Prod | {transactions.length} Vnd</span>
            </div>
          </div>

          {/* Config Details */}
          {supabaseSchemaMissing ? (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-md space-y-2 text-rose-900 text-xs text-left">
              <p className="font-bold text-xs text-rose-950 uppercase tracking-wider">⚠️ Chaves Ativas, Mas Tabelas Faltando</p>
              <p>O proxy se conectou ao Supabase de forma bem-sucedida, mas o banco está em branco. A tabela <code className="font-mono bg-rose-100 px-1 py-0.5 rounded text-rose-800 font-bold">clients</code> ainda não existe.</p>
              <p className="font-semibold text-rose-950">Como Resolver em 30 Segundos:</p>
              <ol className="list-decimal list-inside pl-1 space-y-1">
                <li>Abra o arquivo <span className="font-mono font-bold bg-white px-1 border border-rose-200 rounded text-rose-900">supabase_migration.sql</span> na raiz do projeto.</li>
                <li>Copie todo o conteúdo do arquivo.</li>
                <li>Cole e execute no <span className="font-bold">SQL Editor</span> da sua dashboard do Supabase!</li>
              </ol>
              <p className="text-[11px] font-medium text-rose-800">Isso criará as tabelas e as relações necessárias de forma instantânea para começar a sincronização.</p>
            </div>
          ) : !supabaseConfigured ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-md space-y-2 text-amber-900 text-xs">
              <p className="font-bold text-xs text-amber-950 uppercase tracking-wider">⚠️ Configuração de Secrets Requerida</p>
              <p>As variáveis de ambiente do Supabase não foram detectadas no ambiente do Cloud Run ainda.</p>
              <p className="font-semibold">Para sincronizar seu CRM com o Supabase:</p>
              <ol className="list-decimal list-inside pl-1 space-y-1">
                <li>Abra as <span className="font-bold">Configurações/Secrets</span> na barra lateral do AI Studio.</li>
                <li>Defina as seguintes chaves de ambiente:</li>
              </ol>
              <div className="bg-amber-100/50 p-2 rounded border border-amber-200 font-mono text-center space-y-1 text-[11px] select-all">
                <div>{`SUPABASE_URL = "https://seu-id.supabase.co"`}</div>
                <div>{`SUPABASE_SERVICE_ROLE_KEY = "sua-chave-secrets"`}</div>
              </div>
              <p className="text-[11px] text-amber-850">Por padrão, os dados estão protegidos localmente no seu localStorage enquanto isso.</p>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-md text-emerald-900 text-xs flex gap-xs items-start">
              <span className="text-base">✔️</span>
              <div className="space-y-1">
                <p className="font-bold text-emerald-950 uppercase tracking-wider text-[11px]">Acesso via Proxy Server Seguro Ativo</p>
                <p>Nenhuma credencial do Supabase é exposta no frontend. Todas as sincs ocorrem de forma encriptada através de API endpoints protegidos.</p>
              </div>
            </div>
          )}

          {/* Actions Block */}
          <div className="space-y-sm">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ações do Banco de Dados</span>
            <div className="grid grid-cols-2 gap-sm">
              <button
                disabled={supabaseLoading || syncStatus === 'syncing'}
                onClick={handleSync}
                className="flex items-center justify-center gap-2 py-sm px-md bg-secondary text-on-secondary rounded-lg font-bold text-xs hover:opacity-95 disabled:opacity-40 transition-opacity cursor-pointer text-center"
              >
                <span>🔄</span>
                <span>{syncStatus === 'syncing' ? 'Sincronizando...' : 'Backup Local -> Cloud'}</span>
              </button>
              <button
                disabled={supabaseLoading || syncStatus === 'syncing'}
                onClick={handleImportInitial}
                className="flex items-center justify-center gap-2 py-sm px-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-bold text-xs disabled:opacity-40 transition-colors cursor-pointer text-center"
              >
                <span>🌱</span>
                <span>Popular Dados Iniciais</span>
              </button>
            </div>
          </div>

          {/* Feedback section */}
          {syncStatus === 'success' && (
            <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2 rounded border border-emerald-200 font-bold flex items-center justify-center gap-1">
              <span>✅</span> Sincronização e backup concluídos com sucesso no Supabase!
            </div>
          )}
          {syncStatus === 'error' && (
            <div className="bg-red-50 text-red-800 text-[11px] p-2 rounded border border-red-200 font-bold">
              <span>❌ Erro:</span> {errorMessage}
            </div>
          )}

          {/* Migrations instructions footer */}
          <div className="bg-slate-50 rounded-lg p-md border border-slate-200 space-y-1 text-xs text-slate-700">
            <p className="font-bold text-primary">Migration SQL Pronta: <span className="font-mono text-secondary">supabase_migration.sql</span></p>
            <p>Geramos um script de migração completo na raiz contendo esquemas (`clients`, `products`, `transactions`), políticas RLS e seed data inicial.</p>
            <button
              onClick={() => alert('Copie o conteúdo do arquivo "supabase_migration.sql" e cole-o no SQL Editor do Supabase para criar as tabelas!')}
              className="text-secondary font-bold hover:underline text-[11px] text-left block"
            >
              Como usar as migrations geradas →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
