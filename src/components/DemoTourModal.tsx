import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  tabId: string;
  description: string;
  actionInstruction: string;
  facultyTalkingPoint: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Platform Overview & Scientific Disclaimer',
    tabId: 'landing',
    description: 'Welcome to QuakeShield AI: "Prepare. Detect. Protect."',
    actionInstruction: 'Review the landing page hero and notice the prominent scientific disclaimer.',
    facultyTalkingPoint: 'Key distinction: Earthquakes CANNOT be predicted in advance. QuakeShield AI focuses on probabilistic hazard modeling, post-rupture early warnings, and public preparedness.'
  },
  {
    stepNumber: 2,
    title: 'Location Selection & Geolocation',
    tabId: 'risk',
    description: 'Select a city or use GPS coordinates to assess local seismic vulnerability.',
    actionInstruction: 'Click "San Francisco" or search for Tokyo/Istanbul in the quick presets.',
    facultyTalkingPoint: 'The platform identifies nearest active tectonic fault lines (e.g., San Andreas Fault) and computes the distance to the rupture boundary.'
  },
  {
    stepNumber: 3,
    title: 'Earthquake Hazard / Risk Information',
    tabId: 'risk',
    description: 'Displaying hazard rating: LOW, MODERATE, HIGH, or VERY HIGH.',
    actionInstruction: 'Inspect the Peak Ground Acceleration (PGA) and historical maximum magnitude.',
    facultyTalkingPoint: 'Hazard is framed statistically (PGA in g-force), avoiding any deceptive claims that "an earthquake will happen tomorrow".'
  },
  {
    stepNumber: 4,
    title: 'Live Interactive Earthquake Map',
    tabId: 'map',
    description: 'Full-screen map visualization showing tectonic fault lines and global seismic events.',
    actionInstruction: 'Toggle filters (24h, 7d, 30d, Magnitude) and view glowing epicenter markers.',
    facultyTalkingPoint: 'Marker radii scale with Richter magnitude, and color coding reflects focal depth (shallow crustal vs. deep intraslab).'
  },
  {
    stepNumber: 5,
    title: 'Live Telemetry & Earthquake Details',
    tabId: 'map',
    description: 'Click on any earthquake epicenter marker to inspect telemetry.',
    actionInstruction: 'Click an epicenter circle to open the detailed telemetry slide-out card.',
    facultyTalkingPoint: 'Shows magnitude, depth, exact coordinates, recording source (USGS vs fallback), and distance from the user.'
  },
  {
    stepNumber: 6,
    title: 'Earthquake Early Warning Simulator',
    tabId: 'simulator',
    description: 'Demonstrating how P-wave and S-wave physics enable early warning seconds.',
    actionInstruction: 'Adjust the Magnitude, Epicenter, and Distance sliders.',
    facultyTalkingPoint: 'P-waves travel at ~6 km/s causing minimal shaking, while destructive S-waves travel at ~3.5 km/s. The difference creates an early warning window.'
  },
  {
    stepNumber: 7,
    title: 'Triggering a Simulated Seismic Event',
    tabId: 'simulator',
    description: 'Initiate a controlled simulation clearly labeled "SIMULATION — NOT A REAL QUAKE".',
    actionInstruction: 'Click the [START SIMULATION] button in the simulator.',
    facultyTalkingPoint: 'Sensors detect initial P-wave arrival; triangulation algorithms estimate the epicenter and magnitude within 2.8 seconds.'
  },
  {
    stepNumber: 8,
    title: 'Warning Generation & Countdown Lead-Time',
    tabId: 'early-warning',
    description: 'The Early Warning Center receives high-priority telemetry and alerts the user.',
    actionInstruction: 'Observe the estimated arrival countdown and audio warning pulse.',
    facultyTalkingPoint: 'When seconds count, citizens receive an audible countdown to the arrival of peak shearing motion.'
  },
  {
    stepNumber: 9,
    title: 'Immediate Safety Actions: DROP, COVER, HOLD ON',
    tabId: 'during',
    description: 'Life-saving emergency instructions presented in large, high-contrast UI.',
    actionInstruction: 'Review DROP, COVER, HOLD ON, plus special instructions (vehicles, high-rises, coastal tsunami evacuation).',
    facultyTalkingPoint: 'During ground shaking, standing or running creates major injury risk from falling non-structural hazards. Dropping and covering is scientifically proven to save lives.'
  },
  {
    stepNumber: 10,
    title: 'Interactive Preparedness Center & 72h Checklist',
    tabId: 'preparedness',
    description: '12-item essential survival checklist (water, first aid, power banks, gas shutoff tool).',
    actionInstruction: 'Check several preparedness items and watch your percentage increase in real time.',
    facultyTalkingPoint: 'Preparedness is interactive and persisted in the browser so users can track their household progress over time.'
  },
  {
    stepNumber: 11,
    title: 'Personalized "My Safety Score" Audit',
    tabId: 'safety-score',
    description: 'Comprehensive 100-point preparedness evaluation across 5 critical pillars.',
    actionInstruction: 'Review your calculated safety score and specific recommendations to boost it.',
    facultyTalkingPoint: 'Gamifies preparedness by identifying critical gaps (e.g. missing out-of-area emergency contacts).'
  },
  {
    stepNumber: 12,
    title: 'Family Emergency Safety Plan Builder',
    tabId: 'family-plan',
    description: 'Create, store, and print a structured family communication and reunion protocol.',
    actionInstruction: 'Review meeting locations, emergency contacts, and special medical notes.',
    facultyTalkingPoint: 'Cell towers frequently overload after major earthquakes. Having a designated out-of-area contact and meeting point prevents panicked searches.'
  },
  {
    stepNumber: 13,
    title: 'Emergency Safe Zones & Shelters Directory',
    tabId: 'shelters',
    description: 'Locating nearby medical trauma centers, seismic refuges, and open safe zones.',
    actionInstruction: 'Filter by category (Hospitals, Shelters, Open Assembly Parks) and inspect capacities.',
    facultyTalkingPoint: 'Designed so municipal GIS shelter data feeds can be connected seamlessly.'
  },
  {
    stepNumber: 14,
    title: 'QuakeGuide AI Assistant (Gemini 3.8 Flash)',
    tabId: 'assistant',
    description: 'Intelligent, safety-certified conversational assistant built with @google/genai.',
    actionInstruction: 'Click one of the prompt chips or ask: "What should I do during an earthquake while driving?"',
    facultyTalkingPoint: 'Server-side Gemini 3.8 Flash integration with strict safety instructions: strictly refuses to give fake earthquake predictions, and gives grounded emergency protocols.'
  },
  {
    stepNumber: 15,
    title: 'Admin Control Center & AI Seismic Analytics',
    tabId: 'admin',
    description: 'Disaster management monitoring dashboard and AI hazard synthesis.',
    actionInstruction: 'Review damage reports, station latency, magnitude histograms, and AI analysis.',
    facultyTalkingPoint: 'Complete end-to-end full-stack technology: real data service layer, resilient demo fallbacks, Express backend, and multi-language support (English, Hindi, Telugu).'
  }
];

export const DemoTourModal: React.FC<Props> = ({ isOpen, onClose, onNavigateTab }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onNavigateTab(DEMO_STEPS[nextIndex].tabId);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onNavigateTab(DEMO_STEPS[prevIndex].tabId);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    onNavigateTab(DEMO_STEPS[index].tabId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  College Presentation Mode
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  Step {currentStep.stepNumber} of {DEMO_STEPS.length}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">{currentStep.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Demonstration Action:</h4>
            <p className="text-slate-200 text-sm font-medium">{currentStep.actionInstruction}</p>
          </div>

          <div className="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Key Concept for Reviewers / Faculty:</span>
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">{currentStep.facultyTalkingPoint}</p>
          </div>

          {/* Stepper Dots Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span>Demo Scenario Progress:</span>
              <span className="font-semibold text-indigo-300">
                {Math.round(((currentStepIndex + 1) / DEMO_STEPS.length) * 100)}%
              </span>
            </div>
            <div className="grid grid-cols-15 gap-1">
              {DEMO_STEPS.map((s, idx) => (
                <button
                  key={s.stepNumber}
                  onClick={() => handleJumpToStep(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'bg-indigo-400 ring-2 ring-indigo-400/50 scale-110'
                      : idx < currentStepIndex
                      ? 'bg-emerald-500'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={`Step ${s.stepNumber}: ${s.title}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-800/40'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => {
              onNavigateTab(currentStep.tabId);
              onClose();
            }}
            className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 underline cursor-pointer"
          >
            Go to {currentStep.tabId.toUpperCase()} Tab & Close Guide
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
          >
            <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
