import { SupportedLanguage } from '../types';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  checkRisk: string;
  liveMap: string;
  earlyWarning: string;
  simulator: string;
  preparedness: string;
  duringEarthquake: string;
  afterEarthquake: string;
  emergencyGuide: string;
  emergencyContacts: string;
  shelters: string;
  aiAssistant: string;
  safetyScore: string;
  familyPlan: string;
  adminDashboard: string;
  aiAnalytics: string;
  aboutProject: string;
  disclaimer: string;
  drop: string;
  cover: string;
  holdOn: string;
  dropDesc: string;
  coverDesc: string;
  holdOnDesc: string;
  noActiveWarning: string;
  activeWarningTitle: string;
  secondsRemaining: string;
  simulationTag: string;
}

export const translations: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    appName: 'QUAKESHIELD AI',
    tagline: 'Prepare before the shaking. Respond when every second matters.',
    checkRisk: 'Check My Risk',
    liveMap: 'Live Earthquake Map',
    earlyWarning: 'Early Warning Center',
    simulator: 'Earthquake Simulator',
    preparedness: 'Preparedness Center',
    duringEarthquake: 'During Earthquake (Emergency)',
    afterEarthquake: 'After Earthquake & Damage',
    emergencyGuide: 'Emergency Action Guide',
    emergencyContacts: 'Emergency Contacts',
    shelters: 'Safe Zones & Shelters',
    aiAssistant: 'QuakeGuide AI Assistant',
    safetyScore: 'My Safety Score',
    familyPlan: 'Family Safety Plan',
    adminDashboard: 'Admin Dashboard',
    aiAnalytics: 'AI Seismic Analytics',
    aboutProject: 'About Project & Tech',
    disclaimer: 'QuakeShield AI does not predict earthquakes. It uses hazard information and, when available, verified earthquake/early-warning data to support preparedness and emergency response.',
    drop: 'DROP',
    cover: 'COVER',
    holdOn: 'HOLD ON',
    dropDesc: 'Get down on your hands and knees.',
    coverDesc: 'Protect your head and neck and take cover under sturdy furniture.',
    holdOnDesc: 'Hold your shelter firmly until the shaking stops.',
    noActiveWarning: 'NO ACTIVE EARTHQUAKE WARNING',
    activeWarningTitle: 'EARTHQUAKE EARLY WARNING DETECTED',
    secondsRemaining: 'SECONDS UNTIL SHAKING',
    simulationTag: 'SIMULATION — NOT A REAL EARTHQUAKE'
  },
  hi: {
    appName: 'क्वेकशिल्ड एआई',
    tagline: 'कंपन से पहले तैयारी करें। जब हर सेकंड मायने रखता है तब प्रतिक्रिया दें।',
    checkRisk: 'मेरा जोखिम जांचें',
    liveMap: 'लाइव भूकंप मानचित्र',
    earlyWarning: 'प्रारंभिक चेतावनी केंद्र',
    simulator: 'भूकंप सिम्युलेटर',
    preparedness: 'तैयारी केंद्र',
    duringEarthquake: 'भूकंप के दौरान (आपातकाल)',
    afterEarthquake: 'भूकंप के बाद और नुकसान',
    emergencyGuide: 'आपातकालीन मार्गदर्शिका',
    emergencyContacts: 'आपातकालीन संपर्क',
    shelters: 'सुरक्षित क्षेत्र और आश्रय',
    aiAssistant: 'क्वेकगाइड एआई सहायक',
    safetyScore: 'मेरा सुरक्षा स्कोर',
    familyPlan: 'पारिवारिक सुरक्षा योजना',
    adminDashboard: 'व्यवस्थापक डैशबोर्ड',
    aiAnalytics: 'एआई भूकंपीय विश्लेषण',
    aboutProject: 'परियोजना के बारे में',
    disclaimer: 'क्वेकशिल्ड एआई भूकंप की भविष्यवाणी नहीं करता है। यह आपदा तैयारी और त्वरित प्रतिक्रिया के लिए वैज्ञानिक जोखिम डेटा का उपयोग करता है।',
    drop: 'झुकें (DROP)',
    cover: 'ढकें (COVER)',
    holdOn: 'पकड़ें (HOLD ON)',
    dropDesc: 'अपने हाथों और घुटनों के बल तुरंत नीचे बैठ जाएं।',
    coverDesc: 'अपने सिर और गर्दन की रक्षा करें और मजबूत मेज के नीचे शरण लें।',
    holdOnDesc: 'जब तक कंपन बंद न हो जाए, मजबूती से पकड़े रहें।',
    noActiveWarning: 'कोई सक्रिय भूकंप चेतावनी नहीं',
    activeWarningTitle: 'भूकंप पूर्व चेतावनी सक्रिय',
    secondsRemaining: 'कंपन पहुंचने में सेकंड शेष',
    simulationTag: 'सिमुलेशन — वास्तविक भूकंप नहीं'
  },
  te: {
    appName: 'క్వేక్‌షీల్డ్ AI',
    tagline: 'కంపన ప్రారంభానికి ముందే సిద్ధం కండి. ప్రతి సెకను కీలకమైనప్పుడు రక్షించండి.',
    checkRisk: 'నా భూకంప ప్రమాదం తనిఖీ',
    liveMap: 'లైవ్ భూకంప మ్యాప్',
    earlyWarning: 'ముందస్తు హెచ్చరిక కేంద్రం',
    simulator: 'భూకంప సిమ్యులేటర్',
    preparedness: 'సన్నద్ధత కేంద్రం',
    duringEarthquake: 'భూకంప సమయంలో (తక్షణ చర్యలు)',
    afterEarthquake: 'భూకంపం తర్వాత & నష్టం నివేదిక',
    emergencyGuide: 'అత్యవసర గైడ్',
    emergencyContacts: 'అత్యవసర కాంటాక్ట్స్',
    shelters: 'సురక్షిత ఆశ్రయాలు',
    aiAssistant: 'క్వేక్‌గైడ్ AI సహాయకుడు',
    safetyScore: 'నా భద్రతా స్కోరు',
    familyPlan: 'కుటుంబ భద్రతా ప్రణాళిక',
    adminDashboard: 'అడ్మిన్ డాష్‌బోర్డ్',
    aiAnalytics: 'AI భూకంప విశ్లేషణ',
    aboutProject: 'ప్రాజెక్ట్ గురించి',
    disclaimer: 'క్వేక్‌షీల్డ్ AI భూకంపాలను ముందుగా ఊహించదు. ఇది కేవలం శాస్త్రీయ ప్రమాద డేటా మరియు తక్షణ హెచ్చరికలను అందిస్తుంది.',
    drop: 'కిందికి వంగండి (DROP)',
    cover: 'కవర్ చేసుకోండి (COVER)',
    holdOn: 'గట్టిగా పట్టుకోండి (HOLD ON)',
    dropDesc: 'తక్షణమే మీ చేతులు, మోకాళ్లపై కింద పడండి.',
    coverDesc: 'మీ తల, మెడను కాపాడుకోండి, దృఢమైన బల్ల కింద రక్షణ పొందండి.',
    holdOnDesc: 'కంపనాలు ఆగే వరకు గట్టిగా పట్టుకుని ఉండండి.',
    noActiveWarning: 'ప్రస్తుతం ఎటువంటి భూకంప హెచ్చరిక లేదు',
    activeWarningTitle: 'భూకంప ముందస్తు హెచ్చరిక గుర్తించబడింది',
    secondsRemaining: 'తీవ్ర కంపనాలకు మిగిలిన సమయం (సెకన్లు)',
    simulationTag: 'సిమ్యులేషన్ — ఇది నిజమైన భూకంపం కాదు'
  }
};
