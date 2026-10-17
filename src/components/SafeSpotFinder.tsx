import React, { useState } from 'react';
import { SafeSpot, LatLng } from '../types/safetrip';
import { MOCK_SAFE_SPOTS } from '../data/firstAidData';
import { calculateDistanceMeters } from '../utils/geoRisk';
import {
  Shield,
  Cross,
  Pill,
  Fuel,
  Navigation2,
  Phone,
  MapPin,
  Search
} from 'lucide-react';

interface SafeSpotFinderProps {
  currentPosition: LatLng;
  onFocusSpot?: (spot: SafeSpot) => void;
  onClose?: () => void;
}

export const SafeSpotFinder: React.FC<SafeSpotFinderProps> = ({
  currentPosition,
  onFocusSpot,
  onClose
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically compute live distance relative to current user position
  const enrichedSpots = MOCK_SAFE_SPOTS.map((s) => {
    const dist = Math.round(calculateDistanceMeters(currentPosition, { lat: s.lat, lng: s.lng }));
    const walkMin = Math.max(1, Math.round(dist / 80)); // ~80m/min walking
    const driveMin = Math.max(1, Math.round(dist / 350)); // ~350m/min driving
    return {
      ...s,
      distanceMeters: dist,
      walkingMinutes: walkMin,
      drivingMinutes: driveMin
    };
  }).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const filtered = enrichedSpots.filter((s) => {
    const matchCat = filterCategory === 'all' || s.category === filterCategory;
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCategoryIcon = (category: SafeSpot['category']) => {
    switch (category) {
      case 'police':
        return <Shield className="w-4 h-4 text-emerald-600" />;
      case 'hospital':
        return <Cross className="w-4 h-4 text-rose-600" />;
      case 'pharmacy':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'fuel_cctv':
      case 'safe_haven':
        return <Fuel className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white text-slate-800 p-4 sm:p-6 overflow-y-auto scroll-smooth font-sans rounded-2xl border border-slate-300/80 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Safe Spot Radar</span>
            <span className="text-[11px] font-semibold text-slate-500">
              · Nearest 24/7 Verified Refuges
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time emergency sanctuaries, police posts, illuminated 24-hr lobbies & trauma centers.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Back to Map
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search safe refuges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
          {[
            { id: 'all', label: 'All Refuges' },
            { id: 'police', label: 'Police Posts' },
            { id: 'hospital', label: 'Hospitals / ER' },
            { id: 'pharmacy', label: '24/7 Pharmacies' },
            { id: 'fuel_cctv', label: 'CCTV Havens' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spot Cards */}
      <div className="mt-4 space-y-3 max-w-4xl mx-auto w-full pb-10">
        {filtered.map((spot) => (
          <div
            key={spot.id}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 transition-all duration-200 hover-lift shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 shrink-0 mt-0.5">
                {getCategoryIcon(spot.category)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900">{spot.name}</h4>
                  {spot.is24x7 && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                      24/7 Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{spot.address}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                  <span className="text-slate-900 font-bold">{spot.distanceMeters}m away</span>
                  <span>· {spot.walkingMinutes} min walk</span>
                  <span>· {spot.drivingMinutes} min drive</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${spot.phone.split('/')[0].trim()}`}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors"
                title="Call direct"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              <button
                onClick={() => {
                  if (onFocusSpot) {
                    onFocusSpot(spot);
                  }
                  if (onClose) {
                    onClose();
                  }
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Navigation2 className="w-3.5 h-3.5 text-white" />
                <span>Show On Map</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
