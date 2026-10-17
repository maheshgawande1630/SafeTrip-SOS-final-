import React from 'react';
import { SafeSpot, LatLng, Trip, EmergencyContact } from '../types/safetrip';
import { MOCK_SAFE_SPOTS } from '../data/firstAidData';
import { calculateDistanceMeters } from '../utils/geoRisk';
import {
  Hospital,
  Cross,
  Pill,
  Phone,
  Navigation,
  Share2,
  MapPin,
  HeartPulse,
  CheckCircle2,
  X
} from 'lucide-react';

interface AccidentHospitalModalProps {
  currentPosition: LatLng;
  trip: Trip;
  primaryContact: EmergencyContact;
  onClose: () => void;
  onOpenFirstAid: () => void;
  onNavigateToSpot: (spot: SafeSpot) => void;
}

export const AccidentHospitalModal: React.FC<AccidentHospitalModalProps> = ({
  currentPosition,
  trip,
  primaryContact,
  onClose,
  onOpenFirstAid,
  onNavigateToSpot
}) => {
  // Sort safe spots by distance
  const sortedSpots = MOCK_SAFE_SPOTS.map((s) => {
    const dist = Math.round(calculateDistanceMeters(currentPosition, { lat: s.lat, lng: s.lng }));
    const driveMin = Math.max(1, Math.round(dist / 350));
    const walkMin = Math.max(1, Math.round(dist / 80));
    return {
      ...s,
      distanceMeters: dist,
      drivingMinutes: driveMin,
      walkingMinutes: walkMin
    };
  }).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const nearestHospital = sortedSpots.find((s) => s.category === 'hospital') || sortedSpots[0];
  const nearestPharmacy = sortedSpots.find((s) => s.category === 'pharmacy') || sortedSpots[1];

  const mapsLink = `https://www.google.com/maps?q=${currentPosition.lat},${currentPosition.lng}`;
  const hospitalMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${nearestHospital.lat},${nearestHospital.lng}`;

  const sendWhatsAppAccidentAlert = () => {
    const text = encodeURIComponent(
      `🚨 CRITICAL ACCIDENT ALERT 🚨\nI have experienced a traffic collision/accident!\nLive Location: ${mapsLink}\nNearest Hospital: ${nearestHospital.name} (${nearestHospital.distanceMeters}m away)\nNearest Medical Shop: ${nearestPharmacy.name}\nVehicle: ${trip.vehicleNumber || 'Transit'}\nPlease send emergency assistance or call 112!`
    );
    const cleanPhone = (primaryContact.whatsapp || primaryContact.phone).replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[7000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 text-slate-800">
        {/* Urgent Accident Header Banner */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md">
              <Cross className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase text-white">
                  Accident Emergency Protocol Active
                </span>
                <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-md">
                  CRITICAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Nearest trauma center & 24/7 medical store radar locked.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Nearest Hospital Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-rose-300 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl border border-rose-200 mt-0.5">
                  <Hospital className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200">
                      Primary Trauma Center
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md font-bold">
                      24/7 ER OPEN
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">{nearestHospital.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{nearestHospital.address}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-black font-mono text-rose-600 block">
                  {nearestHospital.distanceMeters}m
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ~{nearestHospital.drivingMinutes} min drive
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
              <a
                href={`tel:${nearestHospital.phone.split('/')[0].trim()}`}
                className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Hospital ER</span>
              </a>

              <a
                href={hospitalMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct Navigation</span>
              </a>
            </div>
          </div>

          {/* Nearest 24/7 Medical Shop / Pharmacy Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200/80 mt-0.5">
                  <Pill className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      Nearest Medical Shop / Pharmacy
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md font-bold">
                      24-Hour Active
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">{nearestPharmacy.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{nearestPharmacy.address}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-black font-mono text-slate-900 block">
                  {nearestPharmacy.distanceMeters}m
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ~{nearestPharmacy.walkingMinutes} min walk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
              <a
                href={`tel:${nearestPharmacy.phone}`}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
                <span>Call Medical Store</span>
              </a>

              <button
                onClick={() => {
                  onNavigateToSpot(nearestPharmacy);
                  onClose();
                }}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-slate-600" />
                <span>Show On Cockpit Map</span>
              </button>
            </div>
          </div>

          {/* Quick Immediate Emergency Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <a
              href="tel:112"
              className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 text-center shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call 112 Ambulance</span>
            </a>

            <button
              onClick={sendWhatsAppAccidentAlert}
              className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 text-center shadow-md transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Hospital Alert</span>
            </button>

            <button
              onClick={() => {
                onOpenFirstAid();
                onClose();
              }}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer"
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Severe Bleeding Guide</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Emergency medical notification pushed to device and contacts</span>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
