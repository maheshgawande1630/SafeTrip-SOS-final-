import React, { useState, useEffect } from 'react';
import { EmergencyContact, LatLng, Trip } from '../types/safetrip';
import { soundSystem } from '../utils/audioHaptics';
import {
  Phone,
  PhoneOff,
  PhoneCall,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ShieldAlert,
  CheckCircle
} from 'lucide-react';

interface EmergencyFamilyCallModalProps {
  contact: EmergencyContact;
  currentPosition: LatLng;
  trip: Trip;
  onEndCall: () => void;
  batteryLevel: number;
}

export const EmergencyFamilyCallModal: React.FC<EmergencyFamilyCallModalProps> = ({
  contact,
  currentPosition,
  trip,
  onEndCall,
  batteryLevel
}) => {
  const [callStatus, setCallStatus] = useState<'dialing' | 'connected'>('dialing');
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    // Start phone ringback tone
    soundSystem.playPhoneRing();

    // After 2.8 seconds, simulate connected family emergency line
    const connectTimer = setTimeout(() => {
      soundSystem.stopPhoneRing();
      setCallStatus('connected');
      soundSystem.speak(`Connected to ${contact.name}. Live audio active.`);
    }, 2800);

    return () => {
      clearTimeout(connectTimer);
      soundSystem.stopPhoneRing();
    };
  }, [contact.name]);

  useEffect(() => {
    let timer: number;
    if (callStatus === 'connected') {
      timer = window.setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus]);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const cleanPhone = (contact.whatsapp || contact.phone).replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-[7000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center p-6 text-center text-slate-800 animate-in zoom-in-95">
        {/* Distress Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold uppercase tracking-wider rounded-full mb-6">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>"Help Me" Voice Trigger Active</span>
        </div>

        {/* Contact Avatar */}
        <div className="relative mb-5 flex items-center justify-center">
          <div
            className={`absolute w-32 h-32 rounded-full border border-emerald-400/50 ${
              callStatus === 'dialing' ? 'animate-ping opacity-30' : 'opacity-60'
            }`}
          />
          <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl font-bold shadow-xl">
            {contact.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
        </div>

        {/* Contact Info */}
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">{contact.name}</h3>
        <p className="text-xs text-slate-500 font-semibold mb-1">{contact.relationship} · Emergency Line</p>
        <p className="text-xs text-slate-500 font-mono mb-4">{contact.phone}</p>

        {/* Status & Call Duration */}
        <div className="mb-6 flex flex-col items-center gap-1">
          {callStatus === 'dialing' ? (
            <div className="flex items-center gap-2 text-xs text-amber-700 font-bold animate-pulse">
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>Dialing Primary Family Contact...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-mono font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>CONNECTED · {formatCallTime(callSeconds)}</span>
            </div>
          )}

          {/* Sound Wave bars if connected */}
          {callStatus === 'connected' && (
            <div className="flex items-center gap-1 mt-2">
              <div className="w-1 bg-emerald-600 rounded-full animate-wave-1 h-3" />
              <div className="w-1 bg-slate-800 rounded-full animate-wave-2 h-5" />
              <div className="w-1 bg-emerald-600 rounded-full animate-wave-3 h-4" />
              <div className="w-1 bg-slate-800 rounded-full animate-wave-4 h-6" />
              <div className="w-1 bg-emerald-600 rounded-full animate-wave-5 h-3" />
            </div>
          )}
        </div>

        {/* Dispatched Actions Status Cards */}
        <div className="w-full bg-slate-50 rounded-2xl border border-slate-200/90 p-3.5 space-y-2 mb-6 text-left text-xs">
          <div className="flex items-center justify-between text-slate-800 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live GPS Dispatched to Contact</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-800 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>System Emergency Notification Pushed</span>
            </span>
            <span className="text-[10px] text-slate-500">Device Alert</span>
          </div>

          <div className="flex items-center justify-between text-slate-800 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Battery & Vehicle Status Attached</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{batteryLevel}% bat</span>
          </div>
        </div>

        {/* In-Call Controls */}
        <div className="w-full flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-100 border-rose-300 text-rose-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Toggle Mute"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3.5 rounded-full border transition-all cursor-pointer ${
              isSpeaker
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Speakerphone"
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={() => {
              soundSystem.stopPhoneRing();
              onEndCall();
            }}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
            title="Hang up call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Direct Mobile Dialer Fallback */}
        <div className="w-full pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <a
            href={`tel:${cleanPhone}`}
            className="text-xs text-slate-800 hover:text-emerald-700 hover:underline flex items-center gap-1 font-bold"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Launch Native Phone Dialer</span>
          </a>
          <button
            onClick={() => {
              soundSystem.stopPhoneRing();
              onEndCall();
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
