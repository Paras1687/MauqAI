import React, { useState } from 'react';
import { Key, X, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

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
        setStatus({ type: 'success', message: 'TinyFish API key saved successfully.' });
        onKeyConfigured(true);
        setTimeout(() => {
          onClose();
        }, 1000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#E5E5E2] rounded-xl max-w-md w-full p-6 shadow-xl relative text-[#242424]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#777777] hover:text-[#242424] p-1 rounded-md hover:bg-[#F4F4F2] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0F6F3] text-[#237A57] flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#242424]">Configure TinyFish API Key</h3>
            <p className="text-xs text-[#777777]">Enables real-time autonomous browser automation</p>
          </div>
        </div>

        {/* Informative Note */}
        <div className="bg-[#F8F8F6] border border-[#E5E5E2] rounded-lg p-3 mb-4 text-xs text-[#555555] space-y-1.5">
          <p>
            Your API key is sent only to your locally running backend server and kept in memory. You can also specify it in your local <code className="font-mono text-[#242424] bg-[#EBEBE8] px-1 py-0.5 rounded">.env</code> file as <code className="font-mono text-[#242424] bg-[#EBEBE8] px-1 py-0.5 rounded">TINYFISH_API_KEY</code>.
          </p>
          <a
            href="https://agent.tinyfish.ai/api-keys"
            target="_blank"
            rel="noreferrer"
            className="text-[#237A57] hover:underline inline-flex items-center gap-1 font-medium"
          >
            Get a key from TinyFish console <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#444444] mb-1">
              API key
            </label>
            <input
              type="password"
              placeholder={isConfigured ? "••••••••••••••••••••••••" : "sk-tinyfish-..."}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-white border border-[#E5E5E2] rounded-lg px-3 py-2 text-sm font-mono text-[#242424] focus:outline-none focus:border-[#237A57] focus:ring-1 focus:ring-[#237A57] transition-colors"
            />
          </div>

          {status && (
            <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 border ${
              status.type === 'success'
                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="w-3.5 h-3.5 shrink-0 text-[#10B981]" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#EF4444]" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#555555] hover:text-[#242424] hover:bg-[#F4F4F2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="px-4 py-1.5 rounded-lg bg-[#237A57] hover:bg-[#1c6347] disabled:bg-[#E5E5E2] disabled:text-[#777777] text-white font-medium text-xs transition-colors cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save key'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
