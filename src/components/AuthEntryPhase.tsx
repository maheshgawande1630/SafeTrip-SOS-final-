import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserSafetySettings, EmergencyContact } from '../types/safetrip';
import { soundSystem } from '../utils/audioHaptics';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  persona: 'commuter' | 'trekker' | 'elderly' | 'student';
  avatarInitials: string;
  isLoggedIn: boolean;
  lastLoginTime: string;
  city?: string;
  typicalTrip?: string;
}

interface AuthEntryPhaseProps {
  onLoginSuccess: (user: UserProfile) => void;
  settings: UserSafetySettings;
  contacts: EmergencyContact[];
}

export const DEMO_PERSONAS: {
  id: string;
  name: string;
  phone: string;
  email: string;
  persona: UserProfile['persona'];
  roleTitle: string;
  avatarInitials: string;
  city: string;
  typicalTrip: string;
}[] = [
  {
    id: 'user-1',
    name: 'Ananya Sharma',
    phone: '+91 98201 23456',
    email: 'ananya.sharma@safetrip.in',
    persona: 'commuter',
    roleTitle: 'IT Professional · Late Night Cab',
    avatarInitials: 'AS',
    city: 'Pune / Mumbai',
    typicalTrip: 'Cyber City Tech Park to Powai'
  },
  {
    id: 'user-2',
    name: 'Rohan Verma',
    phone: '+91 98112 34567',
    email: 'rohan.verma@safetrip.in',
    persona: 'student',
    roleTitle: 'College Student · Evening Auto Transit',
    avatarInitials: 'RV',
    city: 'Delhi NCR',
    typicalTrip: 'North Campus to Rohini Sector 14'
  },
  {
    id: 'user-3',
    name: 'Fatima Khan',
    phone: '+91 98450 67890',
    email: 'fatima.khan@safetrip.in',
    persona: 'trekker',
    roleTitle: 'Solo Explorer · Sinhagad Fort Trek',
    avatarInitials: 'FK',
    city: 'Bengaluru / Pune',
    typicalTrip: 'Golewadi Base to Kalyan Darwaza'
  },
  {
    id: 'user-4',
    name: 'Ramesh Chandra',
    phone: '+91 98300 45678',
    email: 'ramesh.chandra@safetrip.in',
    persona: 'elderly',
    roleTitle: 'Senior Citizen · City Bus / Metro',
    avatarInitials: 'RC',
    city: 'Kolkata',
    typicalTrip: 'Apollo Clinic to Salt Lake'
  }
];

export const AuthEntryPhase: React.FC<AuthEntryPhaseProps> = ({
  onLoginSuccess,
  settings,
  contacts
}) => {
  // Simple phone & PIN form state
  const [phoneInput, setPhoneInput] = useState('98201 23456');
  const [pinInput, setPinInput] = useState('1234');
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState(DEMO_PERSONAS[0]);

  const handleSelectPersona = (p: (typeof DEMO_PERSONAS)[0]) => {
    setSelectedPersona(p);
    // Extract clean 10-digit number without country code
    const rawNumber = p.phone.replace('+91', '').trim();
    setPhoneInput(rawNumber);
    setPinInput('1234');
    setErrorMsg(null);
  };

  const executeLogin = (userToLogin: typeof selectedPersona) => {
    setIsVerifying(true);
    setErrorMsg(null);
    soundSystem.playDiscreetPulse();

    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess({
        id: userToLogin.id,
        name: userToLogin.name,
        phone: userToLogin.phone.startsWith('+91') ? userToLogin.phone : `+91 ${userToLogin.phone}`,
        email: userToLogin.email,
        persona: userToLogin.persona,
        avatarInitials: userToLogin.avatarInitials,
        isLoggedIn: true,
        lastLoginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        city: userToLogin.city,
        typicalTrip: userToLogin.typicalTrip
      });
    }, 450);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = phoneInput.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (pinInput !== settings.realPIN && pinInput !== '1234') {
      setErrorMsg(`Incorrect security PIN. Default demo PIN is ${settings.realPIN}`);
      return;
    }

    // Match existing persona or create profile
    const matched = DEMO_PERSONAS.find((p) => p.phone.replace(/[^0-9]/g, '').endsWith(cleanDigits.slice(-10))) || {
      id: `user-${Date.now()}`,
      name: 'Indian Traveler',
      phone: `+91 ${cleanDigits.slice(-10)}`,
      email: `traveler@safetrip.in`,
      persona: 'commuter' as const,
      roleTitle: 'Verified Indian Commuter',
      avatarInitials: 'IT',
      city: 'India',
      typicalTrip: 'Safe City Transit'
    };

    executeLogin(matched);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08)] p-6 sm:p-8 z-10 flex flex-col gap-5">
        
        {/* Brand Header with Indian Identity */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 mb-1">
            <span className="text-base leading-none">🇮🇳</span>
            <span>SafeTrip SOS India</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 ml-0.5" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
            <Shield className="w-7 h-7 text-emerald-600 fill-emerald-500/15" />
            <span>SafeTrip SOS</span>
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Proactive travel safety across Indian cabs, autos, buses & solo treks. Enter your mobile number to unlock your safety cockpit.
          </p>
        </div>

        {/* 1-Tap Quick Profiles Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider px-0.5">
            <span>Quick Login Profile:</span>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md font-bold">
              1-Tap Select
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_PERSONAS.map((p) => {
              const isSelected = selectedPersona.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPersona(p)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {p.avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{p.city}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Simple Login Form */}
        <form onSubmit={handleManualLogin} className="space-y-3.5 pt-1">
          {/* Mobile Number with Indian Flag (+91) */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
              Mobile Number
            </label>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15 bg-slate-50 transition-all">
              <div className="bg-slate-100 border-r border-slate-200 px-3 py-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 shrink-0">
                <span className="text-base leading-none">🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="98201 23456"
                className="w-full bg-transparent px-3 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* 4-digit PIN */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Safety PIN
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                Default: <strong className="text-slate-800">{settings.realPIN}</strong>
              </span>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="4-digit PIN"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 font-mono tracking-widest focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center font-medium animate-in fade-in">
              {errorMsg}
            </p>
          )}

          {/* Direct Submit Button */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-1 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Verifying Secure Session...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Enter Safe Cockpit as {selectedPersona.name.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4 text-white ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Simple National Emergency & Safety Link */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-semibold text-slate-800">National Emergency 112 Ready</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">
            Auto WhatsApp & Call Alerts
          </span>
        </div>

      </div>
    </div>
  );
};
