'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, HelpCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Default credentials
  const defaultUser = 'admin';
  const defaultPass = 'becka123';

  const handleInjectCredentials = () => {
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
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-md font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden animate-in fade-in duration-300">
        
        {/* Visual Brand Header Decoration */}
        <div className="bg-primary px-lg py-xl text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-transparent to-tertiary/25 pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-white mx-auto flex items-center justify-center font-bold text-xl shadow-md border border-white/10 animate-pulse">
              B
            </div>
            <h2 className="text-2xl font-black tracking-tight font-sans">Becka Variedades</h2>
            <p className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">CRM Ativo & Gestão de Vendas</p>
          </div>
        </div>

        {/* Login Body Form */}
        <div className="p-lg space-y-lg">
          <div className="space-y-sm text-center">
            <h3 className="text-base font-bold text-primary flex items-center justify-center gap-xs">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              Acesso de Segurança Integrado
            </h3>
            <p className="text-xs text-on-surface-variant font-semibold">Insira suas credenciais corporativas do Supabase</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-md">
            {error && (
              <div className="p-sm bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-lg text-center animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-xs">
              <label htmlFor="login_username" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Usuário / E-mail
              </label>
              <input
                id="login_username"
                type="text"
                required
                placeholder="ex: admin"
                value={username}
                onChange={p => {
                  setUsername(p.target.value);
                  setError(null);
                }}
                className="w-full bg-slate-50 border border-outline-variant rounded-lg px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-xs">
              <label htmlFor="login_password" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="login_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={p => {
                    setPassword(p.target.value);
                    setError(null);
                  }}
                  className="w-full bg-slate-50 border border-outline-variant rounded-lg pl-md pr-10 py-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="submit_login"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-md bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm disabled:opacity-50 active:scale-[0.99] transition-all flex items-center justify-center gap-sm cursor-pointer shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>
        </div>

        {/* Footer info lock indicator */}
        <div className="bg-slate-50 py-sm px-lg border-t border-slate-100 flex items-center justify-center gap-sm text-[10px] text-slate-400 uppercase tracking-widest font-black">
          <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          Conexão Segura SSL Integrada
        </div>
      </div>
    </div>
  );
}
