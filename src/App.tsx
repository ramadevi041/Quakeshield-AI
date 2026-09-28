import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Footer } from './components/Footer';
import { DemoTourModal } from './components/DemoTourModal';
import { LandingView } from './views/LandingView';
import { RiskCheckView } from './views/RiskCheckView';
import { MapView } from './views/MapView';
import { EarlyWarningView } from './views/EarlyWarningView';
import { SimulatorView } from './views/SimulatorView';
import { PreparednessView } from './views/PreparednessView';
import { DuringQuakeView } from './views/DuringQuakeView';
import { AfterQuakeView } from './views/AfterQuakeView';
import { ContactsView } from './views/ContactsView';
import { SheltersView } from './views/SheltersView';
import { AssistantView } from './views/AssistantView';
import { SafetyScoreView } from './views/SafetyScoreView';
import { FamilyPlanView } from './views/FamilyPlanView';
import { DashboardView } from './views/DashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AiAnalyticsView } from './views/AiAnalyticsView';
import { AboutView } from './views/AboutView';
import { Earthquake, EarlyWarningAlert, SupportedLanguage, DamageReport } from './types';
import { api } from './services/api';
import { AlertTriangle, Radio, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [isLiveFeed, setIsLiveFeed] = useState<boolean>(false);
  const [feedSource, setFeedSource] = useState<string>('Initializing Feed...');
  const [activeAlert, setActiveAlert] = useState<EarlyWarningAlert | null>(null);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);

  // Load earthquakes on initial mount
  const loadQuakes = async (forceDemo = false) => {
    try {
      const res = await api.getEarthquakes(forceDemo);
      setEarthquakes(res.data);
      setIsLiveFeed(res.isLive);
      setFeedSource(res.source);
    } catch (err) {
      console.warn('Failed to load earthquakes:', err);
    }
  };

  useEffect(() => {
    loadQuakes();
  }, []);

  // Handler for simulated drill alerts
  const handleTriggerTestAlert = () => {
    const alert: EarlyWarningAlert = {
      id: `alert-${Date.now()}`,
      estimatedMagnitude: 6.8,
      estimatedEpicenter: 'Hayward Fault Zone (Oakland, CA)',
      coordinates: { lat: 37.80, lng: -122.27 },
      estimatedDistanceKm: 68,
      expectedShaking: 'Strong',
      mmiLevel: 'MMI VI-VII',
      timeUntilShakingSeconds: 14,
      issuedAt: Date.now(),
      isSimulation: true
    };
    setActiveAlert(alert);
    setActiveTab('early-warning');
  };

  const handleClearAlert = () => {
    setActiveAlert(null);
  };

  const handleReceiveSimulationAlert = (alert: EarlyWarningAlert) => {
    setActiveAlert(alert);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Scientific Disclaimer Top Banner */}
      <DisclaimerBanner language={language} />

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        isLiveFeed={isLiveFeed}
        onStartDemoTour={() => setIsDemoTourOpen(true)}
      />

      {/* Urgent Warning Notification Banner if an alert is active and user is on another tab */}
      {activeAlert && activeTab !== 'early-warning' && activeTab !== 'during' && (
        <aside
          aria-label="Active earthquake early warning"
          onClick={() => setActiveTab('early-warning')}
          className="bg-red-600 border-b border-red-400/50 px-4 py-2 text-white text-xs font-bold flex items-center justify-between cursor-pointer sticky top-16 z-30 shadow-lg animate-pulse"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <Radio className="w-4 h-4 animate-ping shrink-0" />
            <span>
              EARTHQUAKE EARLY WARNING ACTIVE: M {activeAlert.estimatedMagnitude} near {activeAlert.estimatedEpicenter}. Click to open alert countdown and emergency actions.
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearAlert();
              }}
              className="ml-auto p-1 rounded hover:bg-red-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingView
            setActiveTab={setActiveTab}
            language={language}
            earthquakes={earthquakes}
            onStartDemoTour={() => setIsDemoTourOpen(true)}
          />
        )}

        {activeTab === 'risk' && <RiskCheckView setActiveTab={setActiveTab} />}

        {activeTab === 'map' && (
          <MapView
            earthquakes={earthquakes}
            isLiveFeed={isLiveFeed}
            onRefresh={(forceDemo) => loadQuakes(forceDemo)}
          />
        )}

        {activeTab === 'early-warning' && (
          <EarlyWarningView
            setActiveTab={setActiveTab}
            language={language}
            activeAlert={activeAlert}
            onClearAlert={handleClearAlert}
            onTriggerTestAlert={handleTriggerTestAlert}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView
            setActiveTab={setActiveTab}
            onSendSimulationToEarlyWarning={handleReceiveSimulationAlert}
          />
        )}

        {activeTab === 'preparedness' && <PreparednessView setActiveTab={setActiveTab} />}

        {activeTab === 'during' && (
          <DuringQuakeView language={language} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'after' && (
          <AfterQuakeView
            setActiveTab={setActiveTab}
            onNewReportAdded={() => {}}
          />
        )}

        {activeTab === 'contacts' && <ContactsView />}

        {activeTab === 'shelters' && <SheltersView />}

        {activeTab === 'assistant' && <AssistantView />}

        {activeTab === 'safety-score' && <SafetyScoreView setActiveTab={setActiveTab} />}

        {activeTab === 'family-plan' && <FamilyPlanView />}

        {activeTab === 'dashboard' && (
          <DashboardView
            setActiveTab={setActiveTab}
            earthquakes={earthquakes}
          />
        )}

        {activeTab === 'admin' && <AdminDashboardView />}

        {activeTab === 'analytics' && <AiAnalyticsView />}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Application Footer */}
      <Footer language={language} setActiveTab={setActiveTab} />

      {/* College Presentation 15-Step Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
