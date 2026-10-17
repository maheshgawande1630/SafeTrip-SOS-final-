import React, { useState } from 'react';
import { Delete, X } from 'lucide-react';

interface DecoyScreenProps {
  realPIN: string;
  decoyPIN: string;
  onRealPINEntered: () => void;
  onDecoyPINEntered: () => void;
  onClose: () => void;
}

export const DecoyScreen: React.FC<DecoyScreenProps> = ({
  realPIN,
  decoyPIN,
  onRealPINEntered,
  onDecoyPINEntered,
  onClose
}) => {
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [fakeToast, setFakeToast] = useState<string | null>(null);
  const [decoyMode, setDecoyMode] = useState<'calculator' | 'notes'>('calculator');
  const [noteContent, setNoteContent] = useState(
    'Monthly Grocery & Home List:\n• Aashirvaad Sharbati Atta (10kg)\n• Amul Taaza Milk & Paneer\n• Tata Sampann Toor Dal & Basmati Rice\n• Ginger, Garlic & Green Chillies\n• Brooke Bond Red Label Tea'
  );

  const handleCalcInput = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
      return;
    }

    if (val === '=') {
      // Check if user entered Real PIN or Decoy PIN
      if (calcDisplay === realPIN) {
        setFakeToast('Security verified: Trip safe.');
        setTimeout(() => {
          onRealPINEntered();
        }, 600);
        return;
      }

      if (calcDisplay === decoyPIN) {
        // SECRET DISPATCH!
        setFakeToast('Trip Cancelled & Reset.');
        setTimeout(() => {
          onDecoyPINEntered();
        }, 800);
        return;
      }

      // Otherwise evaluate normal math
      try {
        const sanitized = calcDisplay.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${sanitized})`)();
        setCalcDisplay(String(result));
      } catch {
        setCalcDisplay('Error');
      }
      return;
    }

    if (calcDisplay === '0' || calcDisplay === 'Error') {
      setCalcDisplay(val);
    } else {
      setCalcDisplay((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    if (calcDisplay.length <= 1) {
      setCalcDisplay('0');
    } else {
      setCalcDisplay((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-100 text-slate-800 flex flex-col justify-between max-w-md mx-auto select-none font-sans border-x border-slate-300 shadow-2xl">
      {/* Camouflage Top Bar */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-slate-200/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDecoyMode(decoyMode === 'calculator' ? 'notes' : 'calculator')}
            className="text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer"
          >
            {decoyMode === 'calculator' ? 'Standard Calculator' : 'Quick Notes'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 font-mono font-medium">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-800 cursor-pointer"
            title="Exit disguise"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {fakeToast && (
        <div className="mx-4 mt-2 p-3 bg-white text-slate-900 border border-emerald-300 rounded-xl text-xs text-center animate-fade-in shadow-md font-medium">
          {fakeToast}
        </div>
      )}

      {decoyMode === 'calculator' ? (
        <div className="flex-1 flex flex-col justify-end p-6">
          {/* Display */}
          <div className="mb-6 text-right pr-2">
            <div className="text-4xl font-light text-slate-900 font-mono tracking-tight overflow-x-auto whitespace-nowrap">
              {calcDisplay}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Disguised PIN gate: Enter PIN & press =
            </div>
          </div>

          {/* Calculator Keypad */}
          <div className="grid grid-cols-4 gap-3">
            {['C', '(', ')', '/'].map((k) => (
              <button
                key={k}
                onClick={() => handleCalcInput(k)}
                className="h-16 rounded-2xl bg-slate-200 hover:bg-slate-300/80 border border-slate-300 text-slate-800 text-xl font-bold active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                {k}
              </button>
            ))}

            {['7', '8', '9', '*'].map((k) => (
              <button
                key={k}
                onClick={() => handleCalcInput(k)}
                className={`h-16 rounded-2xl text-xl font-semibold active:scale-95 transition-all border shadow-xs cursor-pointer ${
                  k === '*'
                    ? 'bg-slate-200 hover:bg-slate-300/80 text-slate-800 border-slate-300'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
                }`}
              >
                {k}
              </button>
            ))}

            {['4', '5', '6', '-'].map((k) => (
              <button
                key={k}
                onClick={() => handleCalcInput(k)}
                className={`h-16 rounded-2xl text-xl font-semibold active:scale-95 transition-all border shadow-xs cursor-pointer ${
                  k === '-'
                    ? 'bg-slate-200 hover:bg-slate-300/80 text-slate-800 border-slate-300'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
                }`}
              >
                {k}
              </button>
            ))}

            {['1', '2', '3', '+'].map((k) => (
              <button
                key={k}
                onClick={() => handleCalcInput(k)}
                className={`h-16 rounded-2xl text-xl font-semibold active:scale-95 transition-all border shadow-xs cursor-pointer ${
                  k === '+'
                    ? 'bg-slate-200 hover:bg-slate-300/80 text-slate-800 border-slate-300'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
                }`}
              >
                {k}
              </button>
            ))}

            <button
              onClick={() => handleCalcInput('0')}
              className="h-16 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-xl font-semibold active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              0
            </button>
            <button
              onClick={() => handleCalcInput('.')}
              className="h-16 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-xl font-semibold active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              .
            </button>
            <button
              onClick={handleBackspace}
              className="h-16 rounded-2xl bg-slate-200 hover:bg-slate-300/80 text-slate-600 border border-slate-300 text-lg flex items-center justify-center active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleCalcInput('=')}
              className="h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-2xl font-bold active:scale-95 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              =
            </button>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
            <span>Real PIN: <strong className="text-slate-900 font-mono">{realPIN}</strong> (Cancels)</span>
            <span>Decoy PIN: <strong className="text-rose-600 font-mono">{decoyPIN}</strong> (Silent SOS)</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-900">My Quick Notes</span>
            <span className="text-xs text-slate-500">Local draft</span>
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-4 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 resize-none font-mono shadow-xs"
            placeholder="Type notes..."
          />
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setDecoyMode('calculator')}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Switch to Calculator
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
