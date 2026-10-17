import React, { useState } from 'react';
import { Trip, EmergencyContact, VehicleType, DriverDetails } from '../types/safetrip';
import { TRIP_PRESETS } from '../data/mockJourneys';
import { lookupVehicleDriver } from '../data/vehicleRegistry';
import {
  Car,
  Navigation,
  ShieldCheck,
  MapPin,
  Clock,
  Compass,
  Star,
  Search,
  BadgeCheck,
  Footprints
} from 'lucide-react';

interface StartJourneyModalProps {
  contacts: EmergencyContact[];
  onStartTrip: (tripData: Partial<Trip>, selectedContacts: string[]) => void;
  onClose: () => void;
}

export const StartJourneyModal: React.FC<StartJourneyModalProps> = ({
  contacts,
  onStartTrip,
  onClose
}) => {
  const [vehicleType, setVehicleType] = useState<VehicleType>('cab');
  const [startName, setStartName] = useState('Cyber City Tech Park, Phase 1');
  const [destinationName, setDestinationName] = useState('Greenfield Heights, Powai (Home)');
  const [vehicleNumber, setVehicleNumber] = useState('MH-12-Q-9482');
  const [driverName, setDriverName] = useState('Ganesh Shinde');
  const [driverPhone, setDriverPhone] = useState('+91 98220 19283');
  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(() => {
    const reg = lookupVehicleDriver('MH-12-Q-9482', 'cab');
    return reg ? reg.details : null;
  });
  const [isAutoSearching, setIsAutoSearching] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(() =>
    contacts.filter((c) => c.autoNotify).map((c) => c.id)
  );
  const [routeSafetyMode, setRouteSafetyMode] = useState<'safe' | 'standard'>('safe');

  const vehicleOptions: { type: VehicleType; label: string; icon: React.ReactNode }[] = [
    { type: 'cab', label: 'Cab / Taxi', icon: <Car className="w-4 h-4 text-emerald-600" /> },
    { type: 'auto', label: 'Auto-Rickshaw', icon: <Compass className="w-4 h-4 text-amber-600" /> },
    { type: 'bus', label: 'City Bus / Metro', icon: <Car className="w-4 h-4 text-slate-600" /> },
    { type: 'trek', label: 'Solo Walk / Trek', icon: <Footprints className="w-4 h-4 text-emerald-700" /> }
  ];

  const handleApplyPreset = (preset: (typeof TRIP_PRESETS)[0]) => {
    setVehicleType(preset.vehicleType);
    setStartName(preset.startName);
    setDestinationName(preset.destinationName);
    if (preset.vehicleNumber) {
      handleVehicleNumberChange(preset.vehicleNumber);
    } else {
      setVehicleNumber('');
      setDriverName(preset.driverName || '');
      setDriverPhone('');
      setDriverDetails(null);
    }
  };

  const handleToggleContact = (id: string) => {
    if (selectedContactIds.includes(id)) {
      setSelectedContactIds(selectedContactIds.filter((cid: string) => cid !== id));
    } else {
      setSelectedContactIds([...selectedContactIds, id]);
    }
  };

  const handleVehicleNumberChange = (num: string) => {
    setVehicleNumber(num);
    setIsAutoSearching(true);

    const match = lookupVehicleDriver(num, vehicleType);
    if (match) {
      setDriverName(match.details.driverName);
      setDriverPhone(match.details.driverPhone);
      setVehicleType(match.vehicleType);
      setDriverDetails(match.details);
    } else {
      setDriverDetails(null);
    }
    setIsAutoSearching(false);
  };

  const handleSelectQuickPlate = (plate: string) => {
    handleVehicleNumberChange(plate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Default polyline based on preset or vehicle type
    const presetMatch = TRIP_PRESETS.find((p) => p.vehicleType === vehicleType) || TRIP_PRESETS[0];

    onStartTrip(
      {
        name: `${startName} → ${destinationName}`,
        vehicleType,
        vehicleNumber,
        driverName,
        driverPhone,
        driverDetails: driverDetails || undefined,
        startName,
        destinationName,
        startPoint: presetMatch.startPoint,
        destinationPoint: presetMatch.destinationPoint,
        plannedPolyline: presetMatch.plannedPolyline,
        safeRoutePolyline: presetMatch.safeRoutePolyline,
        status: 'active'
      },
      selectedContactIds
    );
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/60 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Navigation className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Plan & Start Journey</h3>
              <p className="text-xs text-slate-400">
                Configure route deviation corridor and verified driver tracking.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-slate-800">
          {/* Quick Presets Carousel */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Quick Launch Presets:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TRIP_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {p.label.split(' ')[0]} {p.label.split(' ')[1]}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {p.destinationName.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Type Selector */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Transit Modality:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {vehicleOptions.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setVehicleType(opt.type)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    vehicleType === opt.type
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Pickup / Starting Point
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={startName}
                  onChange={(e) => setStartName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Destination Point
              </label>
              <div className="relative">
                <Navigation className="w-4 h-4 text-slate-700 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Vehicle / Driver Metadata with Auto Lookup */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span>Automatic Vehicle & Driver RTO Lookup</span>
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md font-mono font-bold">
                Auto-Detection Active
              </span>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1 font-semibold">
                Enter Car Number or Auto-Rickshaw Number:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. MH-12-Q-9482, MH-12-AZ-3819, DL-01-TA-4491, KA-05-AU-2045..."
                  value={vehicleNumber}
                  onChange={(e) => handleVehicleNumberChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold tracking-wider uppercase text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Quick sample vehicle / auto buttons */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-[10px]">
                <span className="text-slate-500 shrink-0 font-medium">Try Plate:</span>
                {[
                  { plate: 'MH-12-Q-9482', label: '🚖 Cab (Dzire)' },
                  { plate: 'MH-12-AZ-3819', label: '🛺 Auto (Pune)' },
                  { plate: 'DL-01-TA-4491', label: '🚖 Cab (Delhi)' },
                  { plate: 'KA-05-AU-2045', label: '🛺 Auto (BLR)' },
                  { plate: 'MH-02-EE-8821', label: '🚕 Taxi (Mumbai)' }
                ].map((s) => (
                  <button
                    key={s.plate}
                    type="button"
                    onClick={() => handleSelectQuickPlate(s.plate)}
                    className="px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-md text-slate-700 font-semibold whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-Populated Driver Details Card */}
            {driverDetails && (
              <div className="p-3.5 bg-white rounded-xl border border-emerald-500/80 ring-1 ring-emerald-500/20 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {driverDetails.driverName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{driverDetails.driverName}</span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded font-bold">
                          ✓ Police Verified
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center text-amber-600 font-bold">
                          <Star className="w-2.5 h-2.5 fill-current mr-0.5 text-amber-500" />
                          {driverDetails.rating}
                        </span>
                        <span>· {driverDetails.totalTrips.toLocaleString()} trips</span>
                        <span>· {driverDetails.driverPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-700">
                  <div>
                    <span className="text-slate-500 block font-medium">Vehicle Model:</span>
                    <span className="font-bold text-slate-900">{driverDetails.vehicleModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">RTO License Badge:</span>
                    <span className="font-mono font-bold text-slate-900">{driverDetails.badgeNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Verification Authority:</span>
                    <span className="text-slate-800 truncate block">{driverDetails.rtoAuthority}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Insurance Status:</span>
                    <span className="text-slate-900 font-bold">Valid until {driverDetails.insuranceValidUntil}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Safe Corridor Option */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Corridor Routing Algorithm
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRouteSafetyMode('safe')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  routeSafetyMode === 'safe'
                    ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Safe Corridor (Recommended)</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Prioritizes CCTV corridors, well-lit boulevards, and police post proximity.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRouteSafetyMode('standard')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  routeSafetyMode === 'standard'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Fastest Route</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Direct GPS navigation route ignoring area illumination ratings.
                </p>
              </button>
            </div>
          </div>

          {/* Emergency Contacts to Notify */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Notify Guardians on Departure
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                {selectedContactIds.length} contact(s) selected
              </span>
            </div>

            <div className="space-y-1.5">
              {contacts.map((contact) => {
                const isChecked = selectedContactIds.includes(contact.id);
                return (
                  <div
                    key={contact.id}
                    onClick={() => handleToggleContact(contact.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-white border-emerald-500 ring-1 ring-emerald-500/20 text-slate-900'
                        : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{contact.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({contact.relationship})
                      </span>
                    </div>
                    {contact.isPrimary && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md font-bold">
                        Primary (Stage 2)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Launch Monitored Journey</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
