import React, { useState } from 'react';
import { Key, Shield, ExternalLink, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, onKeyConfigured, isConfigured }) {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/config/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'TinyFish API key successfully saved and verified!' });
        onKeyConfigured(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to configure API key' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Error communicating with backend' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Configure TinyFish API Key</h3>
            <p className="text-xs text-slate-400">Enables genuine live cloud browser automation</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 mb-5 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Shield className="w-4 h-4" />
            <span>Secure Server-Side Credential Storage</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Your API key is transmitted only to your local backend server and never exposed to the frontend or third-party loggers. You can also define it in your <code className="text-emerald-300">.env</code> file as <code className="text-emerald-300">TINYFISH_API_KEY</code>.
          </p>
          <a
            href="https://agent.tinyfish.ai/api-keys"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline pt-1"
          >
            Get a TinyFish API Key <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Key Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              API Key (e.g. sk-tinyfish-...)
            </label>
            <input
              type="password"
              placeholder={isConfigured ? "••••••••••••••••••••••••" : "Paste your TinyFish API Key here"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {status && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              status.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              {loading ? 'Validating...' : 'Save & Activate'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
