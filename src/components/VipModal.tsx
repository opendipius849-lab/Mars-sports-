import React, { useState } from 'react';
import { Crown, Check, Copy, Sparkles, Shield, X, ArrowRight, Zap, Phone, CheckCircle2 } from 'lucide-react';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVip: boolean;
  onActivateVip: () => void;
  onDeactivateVip?: () => void;
}

export const VipModal: React.FC<VipModalProps> = ({
  isOpen,
  onClose,
  isVip,
  onActivateVip,
  onDeactivateVip,
}) => {
  const secretPaymentNumber = '+256744062690';
  const [copied, setCopied] = useState(false);
  const [txnRef, setTxnRef] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCopyNumber = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(secretPaymentNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerifyPayment = () => {
    if (!txnRef.trim()) {
      setErrorMsg('Please enter your transaction ID or sender phone number');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    // Simulate verification of payment to secret number +256744062690
    setTimeout(() => {
      setIsVerifying(false);
      setActivationSuccess(true);
      onActivateVip();

      setTimeout(() => {
        setActivationSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Glow Header Banner */}
        <div className="relative p-6 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border-b border-amber-500/40 overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-black/30 text-amber-200 text-[11px] font-black uppercase tracking-wider border border-amber-400/30">
              MARS SPORTS PREMIUM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-lg shrink-0">
              <Crown className="w-6 h-6 fill-amber-300/40" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Worldwide Predictions VIP
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                Unlock 100% Uncensored Global Consensus & Tactical Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Price Box */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Subscription Plan
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-amber-400">$2</span>
                <span className="text-sm font-bold text-slate-400">/ month</span>
                <span className="text-xs text-slate-500 ml-1">(~7,600 UGX)</span>
              </div>
            </div>

            <div className="text-right">
              {isVip ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VIP ACTIVE
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                  MONTHLY ACCESS
                </span>
              )}
            </div>
          </div>

          {/* VIP Features Included */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider block">
              What You Unlock as a VIP Member:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Full Worldwide Prediction %</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Exact Scoreline Matrix Odds</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>6-Axis Tactical Radar Analysis</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Continental Fan Vote Breakdown</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions (The Secret Number: +256744062690) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Phone className="w-4 h-4" />
                <span>Secret Payment Receiving Number</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Mobile Money / Airtel / MTN</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-amber-500/40">
              <span className="font-mono text-base sm:text-lg font-black text-amber-300 tracking-wider">
                {secretPaymentNumber}
              </span>
              <button
                onClick={handleCopyNumber}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Number'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed space-y-1">
              <p>
                1. Send <strong>$2.00 USD</strong> (or <strong>7,600 UGX</strong>) to the secret number above.
              </p>
              <p>
                2. Enter your Transaction Reference or Sender Phone Number below to confirm:
              </p>
            </div>

            {/* Input Transaction ID */}
            <div className="space-y-1.5">
              <input
                type="text"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                placeholder="Enter Transaction ID or Phone (e.g. TXN98421 or +256...)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs font-medium outline-none focus:border-amber-400 transition-colors"
              />
              {errorMsg && <p className="text-[11px] text-rose-400 font-semibold">{errorMsg}</p>}
            </div>
          </div>

          {/* Success Notification */}
          {activationSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              <span>VIP Activated Successfully! All World Predictions Unlocked.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              onClick={handleVerifyPayment}
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>Verify Payment & Activate VIP ($2/mo)</span>
                </>
              )}
            </button>

            {/* Instant Demo Unlock for testing */}
            <button
              onClick={() => {
                onActivateVip();
                setActivationSuccess(true);
                setTimeout(() => {
                  setActivationSuccess(false);
                  onClose();
                }, 1000);
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-colors border border-slate-700 whitespace-nowrap"
            >
              Instant 1-Click Activate
            </button>
          </div>

          {isVip && onDeactivateVip && (
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  onDeactivateVip();
                  onClose();
                }}
                className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors underline"
              >
                Cancel / Reset VIP Status
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
