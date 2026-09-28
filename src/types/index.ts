export type HazardLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  depth: number;
  coordinates: [number, number]; // [lng, lat]
  felt?: number;
  alert?: string;
  status?: string;
  tsunami?: number;
  source: string;
  isLive: boolean;
  fault?: string;
}

export interface RiskAssessment {
  location: string;
  coordinates: { lat: number; lng: number };
  hazardLevel: HazardLevel;
  peakGroundAcceleration: string;
  historicalMaxMagnitude: number;
  nearestFaultSystem: string;
  distanceToFaultKm: number;
  recommendedPreparedness: string;
  scientificDisclaimer: string;
}

export interface EarlyWarningAlert {
  id: string;
  estimatedMagnitude: number;
  estimatedEpicenter: string;
  coordinates: { lat: number; lng: number };
  estimatedDistanceKm: number;
  expectedShaking: 'Light' | 'Moderate' | 'Strong' | 'Severe' | 'Violent';
  mmiLevel: string; // Modified Mercalli Intensity (e.g., MMI VI - Strong)
  timeUntilShakingSeconds: number;
  issuedAt: number;
  isSimulation: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  category: 'Hospital / Trauma' | 'Emergency Shelter' | 'Open Safe Zone' | 'Fire Station';
  address: string;
  coordinates: { lat: number; lng: number };
  distanceKm: number;
  status: string;
  capacity: string;
  contact: string;
  facilities: string[];
}

export interface DamageReport {
  id: string;
  location: string;
  damageType: string;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  description: string;
  reporterContact?: string;
  isAnonymous: boolean;
  timestamp: string;
  status: 'Pending Review' | 'Verified' | 'Resolved';
  coordinates?: { lat: number; lng: number };
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  category: 'Official Helpline' | 'Family & Loved One' | 'Local Neighborhood';
  isOfficial?: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  medicalNotes?: string;
}

export interface FamilySafetyPlan {
  familyMembers: FamilyMember[];
  primaryMeetingPoint: string;
  secondaryMeetingPoint: string;
  outOfAreaContactName: string;
  outOfAreaContactPhone: string;
  medicalKitLocation: string;
  utilityGasShutoffLocation: string;
  specialInstructions: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  earlyWarningSound: boolean;
  minMagnitudeAlert: number;
  nearbyRadiusKm: number;
  weeklySafetyCheck: boolean;
  tsunamiAdvisories: boolean;
}

export type SupportedLanguage = 'en' | 'hi' | 'te';
