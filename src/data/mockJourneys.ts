import { Trip, EmergencyContact, UserSafetySettings } from '../types/safetrip';

export const INITIAL_USER_SETTINGS: UserSafetySettings = {
  realPIN: '1234',
  decoyPIN: '9999',
  voiceCodeWord: 'help me',
  voiceDetectionEnabled: true,
  deviationThresholdMeters: 350,
  maxStopDurationSeconds: 180, // 3 minutes without movement triggers warning
  shakeToSOS: true,
  fallDetectionEnabled: true,
  batteryAlertEnabled: true,
  batteryThresholdPercent: 12,
  autoRecordAudioOnAlert: true,
  helplineNumber: '112',
  userName: 'Ananya Sharma',
  userPhone: '+91 98201 23456'
};

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact-1',
    name: 'Pooja Sharma (Sister)',
    relationship: 'Sister / Family',
    phone: '+91 98201 98765',
    whatsapp: '+919820198765',
    isPrimary: true,
    autoNotify: true
  },
  {
    id: 'contact-2',
    name: 'Rajesh Sharma (Father)',
    relationship: 'Father',
    phone: '+91 98202 54321',
    whatsapp: '+919820254321',
    isPrimary: false,
    autoNotify: true
  },
  {
    id: 'contact-3',
    name: 'Neha Gupta (Flatmate)',
    relationship: 'Trusted Friend',
    phone: '+91 98203 11223',
    whatsapp: '+919820311223',
    isPrimary: false,
    autoNotify: false
  }
];

// Presets for quick trip launch
export const TRIP_PRESETS: {
  id: string;
  label: string;
  vehicleType: Trip['vehicleType'];
  icon: string;
  startName: string;
  destinationName: string;
  startPoint: { lat: number; lng: number };
  destinationPoint: { lat: number; lng: number };
  vehicleNumber?: string;
  driverName?: string;
  plannedPolyline: { lat: number; lng: number }[];
  safeRoutePolyline: { lat: number; lng: number }[];
  description: string;
}[] = [
  {
    id: 'night_cab',
    label: 'Late Night Cab (Ola / Uber)',
    vehicleType: 'cab',
    icon: 'Car',
    startName: 'Cyber City Tech Park, Phase 1',
    destinationName: 'Greenfield Heights, Powai (Home)',
    startPoint: { lat: 37.7749, lng: -122.4194 },
    destinationPoint: { lat: 37.7612, lng: -122.4485 },
    vehicleNumber: 'MH-12-Q-9482 (White Dzire Tour)',
    driverName: 'Vikram S. Sharma',
    description: 'Highway arterial route with illuminated lanes & CCTV corridors.',
    plannedPolyline: [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7735, lng: -122.4220 },
      { lat: 37.7710, lng: -122.4275 },
      { lat: 37.7685, lng: -122.4340 },
      { lat: 37.7650, lng: -122.4410 },
      { lat: 37.7612, lng: -122.4485 }
    ],
    safeRoutePolyline: [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7755, lng: -122.4250 },
      { lat: 37.7725, lng: -122.4310 },
      { lat: 37.7680, lng: -122.4380 },
      { lat: 37.7640, lng: -122.4430 },
      { lat: 37.7612, lng: -122.4485 }
    ]
  },
  {
    id: 'auto_rickshaw',
    label: 'Evening Auto-Rickshaw Ride',
    vehicleType: 'auto',
    icon: 'Zap',
    startName: 'Shivajinagar Metro Terminal',
    destinationName: 'Model Colony, FC Road',
    startPoint: { lat: 37.7780, lng: -122.4140 },
    destinationPoint: { lat: 37.7660, lng: -122.4390 },
    vehicleNumber: 'MH-12-AZ-3819 (Green/Yellow CNG)',
    driverName: 'Ramesh K. Yadav',
    description: 'City ring road passing through commercial zones.',
    plannedPolyline: [
      { lat: 37.7780, lng: -122.4140 },
      { lat: 37.7750, lng: -122.4190 },
      { lat: 37.7720, lng: -122.4260 },
      { lat: 37.7690, lng: -122.4320 },
      { lat: 37.7660, lng: -122.4390 }
    ],
    safeRoutePolyline: [
      { lat: 37.7780, lng: -122.4140 },
      { lat: 37.7765, lng: -122.4210 },
      { lat: 37.7730, lng: -122.4290 },
      { lat: 37.7695, lng: -122.4350 },
      { lat: 37.7660, lng: -122.4390 }
    ]
  },
  {
    id: 'solo_trek',
    label: 'Solo Mountain Fort Trek',
    vehicleType: 'trek',
    icon: 'Compass',
    startName: 'Sinhagad Fort Base Camp (Golewadi)',
    destinationName: 'Kalyan Darwaza Fortress Peak',
    startPoint: { lat: 37.7820, lng: -122.4080 },
    destinationPoint: { lat: 37.7550, lng: -122.4550 },
    vehicleNumber: 'Foot Trekker (GPS Beacon)',
    driverName: 'Self (Ananya Sharma)',
    description: 'Rugged terrain with sporadic cellular reception and fall risk detection.',
    plannedPolyline: [
      { lat: 37.7820, lng: -122.4080 },
      { lat: 37.7760, lng: -122.4180 },
      { lat: 37.7700, lng: -122.4290 },
      { lat: 37.7640, lng: -122.4410 },
      { lat: 37.7580, lng: -122.4500 },
      { lat: 37.7550, lng: -122.4550 }
    ],
    safeRoutePolyline: [
      { lat: 37.7820, lng: -122.4080 },
      { lat: 37.7770, lng: -122.4160 },
      { lat: 37.7715, lng: -122.4270 },
      { lat: 37.7655, lng: -122.4390 },
      { lat: 37.7600, lng: -122.4480 },
      { lat: 37.7550, lng: -122.4550 }
    ]
  },
  {
    id: 'elderly_alone',
    label: 'Elderly Parent Solo Transit',
    vehicleType: 'elderly',
    icon: 'HeartHandshake',
    startName: 'Apollo Diagnostic & Cardiac Clinic',
    destinationName: 'Shanti Niketan Enclave, Block 4',
    startPoint: { lat: 37.7710, lng: -122.4150 },
    destinationPoint: { lat: 37.7620, lng: -122.4420 },
    vehicleNumber: 'PMPML / BMTC Route 34',
    driverName: 'Municipal Bus',
    description: 'Gentle progression monitoring, heart rate check-ins, automated stop tracking.',
    plannedPolyline: [
      { lat: 37.7710, lng: -122.4150 },
      { lat: 37.7680, lng: -122.4230 },
      { lat: 37.7650, lng: -122.4320 },
      { lat: 37.7620, lng: -122.4420 }
    ],
    safeRoutePolyline: [
      { lat: 37.7710, lng: -122.4150 },
      { lat: 37.7690, lng: -122.4220 },
      { lat: 37.7660, lng: -122.4310 },
      { lat: 37.7620, lng: -122.4420 }
    ]
  }
];
