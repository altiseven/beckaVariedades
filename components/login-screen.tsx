'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, User, Sparkles, HelpCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Default corporate credentials
  const defaultUser = 'admin';
  const defaultPass = 'becka123';

  // Easy helper to let testing users log in with 1-click
  const handleInjectCredentials = (e: React.MouseEvent) => {
    e.preventDefault();
    setUsername(defaultUser);
    setPassword(defaultPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const enteredUser = username.trim();
    const enteredPass = password;

    // 1. Try standard fallback demo account first
    const isMockUser = enteredUser.toLowerCase() === defaultUser || enteredUser.toLowerCase() === 'admin@becka.com';
    const isMockPass = enteredPass === defaultPass;

    if (isMockUser && isMockPass) {
      setTimeout(() => {
        onLoginSuccess('admin');
      }, 500);
      return;
    }

    // 2. Otherwise authenticate using Supabase secure proxy endpoint
    try {
      const resp = await fetch('/api/supabase/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          data: { email: enteredUser, password: enteredPass }
        })
      });

      const res = await resp.json();

      if (res && res.success) {
        // Logged in with actual Supabase user!
        const nickname = res.user?.email ? res.user.email.split('@')[0] : enteredUser;
        onLoginSuccess(nickname);
      } else {
        if (res && res.configured === false) {
          setError('Supabase não configurado. Use as credenciais administrativas padrão (admin / becka123).');
        } else {
          // Provide Portuguese error details
          let errMsg = res?.error || 'Usuário ou senha incorretos.';
          if (errMsg.toLowerCase().includes('invalid login credentials')) {
            errMsg = 'Credenciais de login inválidas no Supabase.';
          } else if (errMsg.toLowerCase().includes('email not confirmed')) {
            errMsg = 'E-mail cadastrado no Supabase mas ainda não confirmado.';
          }
          setError(errMsg);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('[Supabase Auth Request Error]:', err);
      setError('Erro de conexão ao servidor de banco de dados.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] flex items-center justify-center p-0 sm:p-6 md:p-8 font-sans relative overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute w-[350px] h-[350px] bg-[#E2583E]/10 rounded-full blur-[100px] top-10 left-10 pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-[#4C0099]/15 rounded-full blur-[100px] bottom-10 right-10 pointer-events-none" />

      {/* Login Main Card structure with defined sizes and min height to prevent stripping */}
      <div className="w-full min-h-screen sm:min-h-0 max-w-5xl bg-[#1E293B] rounded-none sm:rounded-2xl border-0 sm:border border-[#223046] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10 animate-in fade-in duration-300">
        
        {/* LEFT PANEL: Splendid Visual Brand & Features (Columns 1-5) */}
        <div className="hidden md:flex md:col-span-5 bg-[#0B0F19] p-10 flex-col justify-between relative overflow-hidden border-r border-[#223046]">
          {/* Internal ambient glowing overlays */}
          <div className="absolute w-[250px] h-[250px] bg-[#E2583E]/15 rounded-full blur-[70px] -top-10 -left-10 pointer-events-none" />
          <div className="absolute w-[250px] h-[250px] bg-[#4C0099]/20 rounded-full blur-[70px] -bottom-10 -right-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#E2583E]/5 via-transparent to-[#4C0099]/5 pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#4C0099] to-[#E2583E] text-white flex items-center justify-center font-extrabold text-xl shadow-lg border border-[rgba(255,255,255,0.1)]">
                B
              </div>
              <div>
                <h2 className="text-xl font-black text-[#F8FAFC] tracking-tight leading-none">Becka Variedades</h2>
                <span className="text-[9px] text-[#E2583E] font-black tracking-widest uppercase">CRM & GESTÃO ATIVA</span>
              </div>
            </div>
            
            <div className="pt-4">
              <p className="text-xs text-[#94A3B8] font-medium leading-relaxed">
                Bem-vindo de volta ao centro operacional e financeiro da Becka Variedades. Faça o login utilizando sua chave corporativa para acessar as novas ferramentas.
              </p>
            </div>
          </div>

          {/* Center Features Preview Cards */}
          <div className="relative z-10 space-y-4 my-8">
            <h4 className="text-[10px] font-black text-[#64748B] uppercase tracking-widest block">Recursos Operacionais</h4>
            
            <div className="space-y-3">
              <div className="flex gap-3 items-start bg-[#141E30]/40 p-3 rounded-xl border border-[#223046]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E2583E] mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#F8FAFC]">Painel Executivo Geral</p>
                  <p className="text-[10px] text-[#64748B] mt-0.5 leading-normal">Métricas de vendas, média de ticket diário e saúde financeira global.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-[#141E30]/40 p-3 rounded-xl border border-[#223046]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4C0099] mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#F8FAFC]">Gestão Completa de Clientes</p>
                  <p className="text-[10px] text-[#64748B] mt-0.5 leading-normal">Monitoramento de saldo gasto, filtragem instantânea e status ativo.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-[#141E30]/40 p-3 rounded-xl border border-[#223046]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E2583E] mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#F8FAFC]">Controle de Estoque Inteligente</p>
                  <p className="text-[10px] text-[#64748B] mt-0.5 leading-normal">Avisos automáticos de reposição, controle por SKU e precificação flexível.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Notice */}
          <div className="relative z-10 pt-4 border-t border-[#223046]/60">
            <p className="text-[10px] text-[#64748B] leading-relaxed font-semibold">
              Este sistema é de acesso restrito a funcionários autorizados. Todas as transações e atualizações são criptografadas e registradas.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Authentication Form (Columns 6-12) */}
        <div className="col-span-12 md:col-span-7 p-8 md:p-12 flex flex-col justify-between min-h-[500px]">
          
          {/* Mobile view branding helper (hidden on desktop) */}
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-[#4C0099] to-[#E2583E] text-white flex items-center justify-center font-extrabold text-lg shadow-md">
              B
            </div>
            <div>
              <h2 className="text-lg font-black text-[#F8FAFC]">Becka Variedades</h2>
              <p className="text-[9px] text-[#94A3B8] font-bold tracking-widest uppercase">CRM & Gestão Empresarial</p>
            </div>
          </div>

          {/* Header instructions */}
          <div className="my-auto space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#E2583E] shrink-0" />
                Acesso de Segurança
              </h3>
              <p className="text-xs text-[#94A3B8] font-semibold">
                Insira as credenciais operacionais fornecidas pela sua administração para entrar no sistema.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-[#2A141A] border border-[#EF4444]/30 text-[#EF4444] text-xs font-semibold rounded-xl text-center animate-shake leading-relaxed">
                  {error}
                </div>
              )}

              {/* Input E-mail / Username */}
              <div className="space-y-1.5">
                <label htmlFor="login_username" className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                  Usuário ou E-mail
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="login_username"
                    type="text"
                    required
                    placeholder="Seu usuário ou e-mail"
                    value={username}
                    onChange={e => {
                      setUsername(e.target.value);
                      setError(null);
                    }}
                    className="w-full bg-[#141E30] border border-[#223046] rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#E2583E]/50 focus:border-[#E2583E] transition-all placeholder:text-[#64748B]"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <label htmlFor="login_password" className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                  Senha Operacional
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="login_password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Sua senha operacional"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="w-full bg-[#141E30] border border-[#223046] rounded-xl pl-10 pr-11 py-3 text-sm font-semibold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#E2583E]/50 focus:border-[#E2583E] transition-all placeholder:text-[#64748B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] cursor-pointer focus:outline-none p-1"
                    title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons Group */}
              <div className="space-y-3 pt-2">
                <button
                  id="submit_login"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#E2583E] hover:bg-[#FA8F75] text-white rounded-xl font-bold text-sm tracking-wide disabled:opacity-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Entrar no Sistema'
                  )}
                </button>

                {/* Seamless Quick Tester Helper Button */}
                <button
                  type="button"
                  onClick={handleInjectCredentials}
                  className="w-full py-2 flex items-center justify-center gap-1.5 text-xs text-[#E2583E] hover:text-[#FA8F75] font-bold bg-[#141E30]/40 border border-dashed border-[#223046] rounded-xl transition-all hover:bg-[#141E30]/80 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Preencher Acesso Admin Padrão
                </button>
              </div>
            </form>
          </div>

          {/* Security / SSL signature footer */}
          <div className="bg-[#0B0F19] md:bg-transparent -mx-8 md:-mx-12 -mb-8 md:-mb-12 py-3.5 px-6 border-t border-[#223046] flex items-center justify-center gap-2 text-[10px] text-[#64748B] uppercase tracking-widest font-black mt-8">
            <span className="inline-block w-1.5 h-1.5 bg-[#10B981] rounded-full animate-ping" />
            Conexão Segura Integrada SSL
          </div>
        </div>

      </div>
    </div>
  );
}
