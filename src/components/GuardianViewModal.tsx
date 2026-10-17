import React, { useState } from 'react';
import { Trip, TripTelemetry, EscalationState } from '../types/safetrip';
import { Shield, Battery, Signal, Phone, Share2, Check } from 'lucide-react';

interface GuardianViewModalProps {
  trip: Trip;
  telemetry: TripTelemetry;
  escalation: EscalationState;
  onClose: () => void;
  travelerName?: string;
}

export const GuardianViewModal: React.FC<GuardianViewModalProps> = ({
  trip,
  telemetry,
  escalation,
  onClose,
  travelerName = 'Ananya Sharma'
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/?guardian_track=${trip.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200/80">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Guardian View (Family / Trusted Link)</h3>
              <p className="text-[11px] text-slate-500">
                What your emergency contacts see in real-time when they open your tracking link.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-800 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Status Alert Banner */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
              escalation.stage >= 2 || trip.status === 'sos_active'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : telemetry.routeDeviationMeters > 300
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  escalation.stage >= 2 || trip.status === 'sos_active'
                    ? 'bg-rose-600'
                    : telemetry.routeDeviationMeters > 300
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
              />
              <span className="font-bold uppercase tracking-wider">
                {escalation.stage >= 2 || trip.status === 'sos_active'
                  ? 'CRITICAL SOS ALERT TRIGGERED'
                  : telemetry.routeDeviationMeters > 300
                  ? `ROUTE DEVIATION (+${telemetry.routeDeviationMeters}m off line)`
                  : 'TRAVELER IS SAFE & ON ROUTE'}
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">Live GPS armed</span>
          </div>

          {/* Traveler & Vehicle Details */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Traveler
                </span>
                <span className="text-sm font-bold text-slate-900">{travelerName}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono font-semibold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Battery className="w-4 h-4 text-emerald-600" />
                  {telemetry.batteryLevel}%
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Signal className="w-4 h-4 text-emerald-600" />
                  {telemetry.signalStrength.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Vehicle</span>
                <span className="font-bold text-slate-900">
                  {trip.vehicleNumber || 'Private Transit'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Driver</span>
                <span className="font-bold text-slate-900">{trip.driverName || 'Verified Operator'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Origin</span>
                <span className="font-medium text-slate-700 truncate block">{trip.startName}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Destination</span>
                <span className="font-medium text-slate-700 truncate block">
                  {trip.destinationName}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Speed</span>
              <span className="text-base font-bold font-mono text-slate-900">
                {telemetry.speedKmh} <span className="text-xs font-normal text-slate-500">km/h</span>
              </span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">ETA</span>
              <span className="text-base font-bold font-mono text-slate-900">
                ~{telemetry.etaMinutes} <span className="text-xs font-normal text-slate-500">min</span>
              </span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Risk Score</span>
              <span
                className={`text-base font-bold font-mono ${
                  telemetry.riskScore > 60
                    ? 'text-rose-600'
                    : telemetry.riskScore > 30
                    ? 'text-amber-600'
                    : 'text-slate-900'
                }`}
              >
                {telemetry.riskScore}/100
              </span>
            </div>
          </div>

          {/* Quick Guardian Actions */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Emergency Contact Actions
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:112"
                className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Call Police (112)
              </a>
              <button
                onClick={copyLink}
                className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-emerald-400" />}
                <span>{copied ? 'Link Copied!' : 'Copy Live Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
