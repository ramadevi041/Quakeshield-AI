export interface CityPreset {
  name: string;
  country: string;
  lat: number;
  lng: number;
  hazardLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';
  fault: string;
  historicalMax: number;
  pga: string;
}

export const POPULAR_CITIES: CityPreset[] = [
  {
    name: 'San Francisco, California',
    country: 'USA',
    lat: 37.7749,
    lng: -122.4194,
    hazardLevel: 'VERY HIGH',
    fault: 'San Andreas & Hayward Fault Systems',
    historicalMax: 7.9,
    pga: '0.62g'
  },
  {
    name: 'Tokyo, Kanto Region',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    hazardLevel: 'VERY HIGH',
    fault: 'Sagami Trough & Japan Trench',
    historicalMax: 9.1,
    pga: '0.68g'
  },
  {
    name: 'Istanbul, Marmara Region',
    country: 'Turkey',
    lat: 41.0082,
    lng: 28.9784,
    hazardLevel: 'VERY HIGH',
    fault: 'North Anatolian Fault (Marmara Segment)',
    historicalMax: 7.6,
    pga: '0.55g'
  },
  {
    name: 'New Delhi / Dehradun',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    hazardLevel: 'HIGH',
    fault: 'Main Himalayan Thrust (HFT/MBT Zone IV)',
    historicalMax: 8.4,
    pga: '0.40g'
  },
  {
    name: 'Los Angeles, California',
    country: 'USA',
    lat: 34.0522,
    lng: -118.2437,
    hazardLevel: 'VERY HIGH',
    fault: 'San Andreas, Newport-Inglewood, Puente Hills',
    historicalMax: 7.3,
    pga: '0.58g'
  },
  {
    name: 'Mexico City',
    country: 'Mexico',
    lat: 19.4326,
    lng: -99.1332,
    hazardLevel: 'VERY HIGH',
    fault: 'Cocos-North American Subduction Zone',
    historicalMax: 8.1,
    pga: '0.52g'
  },
  {
    name: 'Santiago, Central Valley',
    country: 'Chile',
    lat: -33.4489,
    lng: -70.6693,
    hazardLevel: 'VERY HIGH',
    fault: 'Peru-Chile Trench / San Ramón Fault',
    historicalMax: 9.5,
    pga: '0.65g'
  },
  {
    name: 'Seattle, Washington',
    country: 'USA',
    lat: 47.6062,
    lng: -122.3321,
    hazardLevel: 'HIGH',
    fault: 'Cascadia Megathrust Subduction Zone',
    historicalMax: 9.0,
    pga: '0.45g'
  },
  {
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    hazardLevel: 'LOW',
    fault: 'Eurasian Stable Intraplate Minor Crust',
    historicalMax: 5.4,
    pga: '0.06g'
  },
  {
    name: 'Sydney, New South Wales',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    hazardLevel: 'LOW',
    fault: 'Australian Stable Continental Interior',
    historicalMax: 5.6,
    pga: '0.08g'
  }
];

// Major Tectonic Plate Boundary segments for interactive map rendering
export const TECTONIC_FAULT_SEGMENTS = [
  // Pacific Ring of Fire - Western Coast Americas
  { name: 'Cascadia & San Andreas', coords: [[-126, 49], [-124, 44], [-122, 38], [-117, 34], [-115, 31]] },
  { name: 'Middle America Trench', coords: [[-115, 31], [-105, 20], [-95, 15], [-85, 10]] },
  { name: 'Peru-Chile Trench', coords: [[-80, 2], [-76, -10], [-71, -22], [-72, -35], [-75, -46]] },
  // Ring of Fire - Asia / Japan / Indonesia
  { name: 'Aleutian Trench', coords: [[-160, 54], [-175, 52], [170, 52], [160, 53]] },
  { name: 'Kuril-Kamchatka Trench', coords: [[160, 53], [152, 47], [144, 43]] },
  { name: 'Japan Trench', coords: [[144, 43], [142, 38], [140, 34]] },
  { name: 'Mariana Trench', coords: [[140, 34], [144, 20], [146, 12]] },
  { name: 'Philippine Trench', coords: [[126, 16], [127, 10], [128, 4]] },
  { name: 'Sunda Megathrust (Indonesia)', coords: [[125, -8], [115, -9], [105, -7], [96, 2], [92, 12]] },
  // Alpine-Himalayan Belt
  { name: 'North Anatolian Fault (Turkey)', coords: [[26, 41], [32, 41], [39, 40], [44, 39]] },
  { name: 'Zagros Thrust (Iran)', coords: [[45, 37], [50, 31], [58, 27]] },
  { name: 'Main Himalayan Thrust', coords: [[72, 35], [78, 31], [85, 28], [95, 26]] }
];

export interface ChecklistItem {
  id: string;
  label: string;
  category: 'Essentials' | 'Tools & Light' | 'Medical & Health' | 'Communication & Safety';
  description: string;
  weight: number;
}

export const INITIAL_PREPAREDNESS_CHECKLIST: ChecklistItem[] = [
  {
    id: 'c1',
    label: 'Emergency Water (1 gallon per person per day, 3-day min)',
    category: 'Essentials',
    description: 'Crucial for survival after municipal water pipelines fracture.',
    weight: 12
  },
  {
    id: 'c2',
    label: 'Non-Perishable Food (Canned, dried goods, 3-5 days)',
    category: 'Essentials',
    description: 'High-calorie items that do not require cooking or refrigeration.',
    weight: 10
  },
  {
    id: 'c3',
    label: 'First-Aid Kit & Prescription Medications',
    category: 'Medical & Health',
    description: 'Bandages, antiseptics, splints, pain relief, and 7-day reserve of daily meds.',
    weight: 12
  },
  {
    id: 'c4',
    label: 'Heavy-Duty Flashlight & Extra Batteries',
    category: 'Tools & Light',
    description: 'Avoid open candles during earthquake aftershocks due to unseen gas leaks.',
    weight: 8
  },
  {
    id: 'c5',
    label: 'Portable Power Bank (Charged for Phones)',
    category: 'Communication & Safety',
    description: 'Keeps emergency communication alive when electrical grid fails.',
    weight: 8
  },
  {
    id: 'c6',
    label: 'Emergency Signal Whistle',
    category: 'Communication & Safety',
    description: 'Essential if trapped; uses much less energy than shouting and carries farther.',
    weight: 8
  },
  {
    id: 'c7',
    label: 'Important Documents in Waterproof Pouch',
    category: 'Essentials',
    description: 'Passports, IDs, home deed, insurance policies, medical records.',
    weight: 8
  },
  {
    id: 'c8',
    label: 'Wrench / Tool for Gas and Water Shut-Off',
    category: 'Tools & Light',
    description: 'Allows immediate gas valve shutoff if gas odor or hissing is detected.',
    weight: 8
  },
  {
    id: 'c9',
    label: 'Heavy Leather Work Gloves & Sturdy Shoes',
    category: 'Tools & Light',
    description: 'Prevents lacerations from broken glass, masonry, and nails after shaking.',
    weight: 8
  },
  {
    id: 'c10',
    label: 'Paper Emergency Contact & Evacuation List',
    category: 'Communication & Safety',
    description: 'Cell phone directories cannot be retrieved if batteries die or devices shatter.',
    weight: 6
  },
  {
    id: 'c11',
    label: 'Hygiene & Sanitation Supplies (Wipes, Masks)',
    category: 'Medical & Health',
    description: 'N95 masks prevent inhaling pulverized drywall dust, silica, and debris.',
    weight: 5
  },
  {
    id: 'c12',
    label: 'Emergency Foil Mylar Thermal Blankets',
    category: 'Essentials',
    description: 'Compact heat retention for exposure protection outdoors during cold weather.',
    weight: 5
  }
];

export const COUNTRY_EMERGENCY_DIRECTORIES: Record<string, { country: string; police: string; ambulance: string; fire: string; disaster: string; notes: string }> = {
  USA: {
    country: 'United States',
    police: '911',
    ambulance: '911',
    fire: '911',
    disaster: '1-800-621-3362 (FEMA)',
    notes: 'Text-to-911 is available in many counties if cellular voice is congested.'
  },
  India: {
    country: 'India',
    police: '112',
    ambulance: '102 / 108',
    fire: '101',
    disaster: '1078 (NDMA National Disaster Helpline)',
    notes: 'National Emergency Number 112 connects to unified emergency response.'
  },
  Japan: {
    country: 'Japan',
    police: '110',
    ambulance: '119',
    fire: '119',
    disaster: '171 (Disaster Emergency Message Dial)',
    notes: 'Use NTT 171 voice mailbox to leave family safety confirmations.'
  },
  Turkey: {
    country: 'Turkey',
    police: '112',
    ambulance: '112',
    fire: '112',
    disaster: '122 (AFAD Disaster Emergency Management)',
    notes: '112 is the unified emergency call number across all provinces.'
  },
  Mexico: {
    country: 'Mexico',
    police: '911',
    ambulance: '911 / 065 (Red Cross)',
    fire: '911',
    disaster: '088 (National Civil Protection)',
    notes: 'Follow official SASMEX seismic alert siren broadcasts in CDMX.'
  },
  Chile: {
    country: 'Chile',
    police: '133 (Carabineros)',
    ambulance: '131 (SAMU)',
    fire: '132 (Bomberos)',
    disaster: 'SENAPRED National Emergency Directorate',
    notes: 'Evacuate immediately to designated high ground if coastal shaking makes standing difficult.'
  },
  Global: {
    country: 'International Standard',
    police: '112 / 911',
    ambulance: '112 / 911',
    fire: '112 / 911',
    disaster: 'Local Civil Protection Authority',
    notes: 'GSM mobile phones dial 112 worldwide even with SIM locked or roaming.'
  }
};
