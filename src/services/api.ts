import { Earthquake, RiskAssessment, Shelter, DamageReport } from '../types';

export const api = {
  // Fetch earthquakes (USGS live or demo)
  async getEarthquakes(forceDemo = false): Promise<{ data: Earthquake[]; isLive: boolean; source: string; disclaimer?: string }> {
    try {
      const res = await fetch(`/api/earthquakes${forceDemo ? '?demo=true' : ''}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return {
        data: json.data || [],
        isLive: Boolean(json.isLive),
        source: json.source || 'Verified Feed',
        disclaimer: json.disclaimer
      };
    } catch (err) {
      console.warn('Backend /api/earthquakes unreachable, using fallback dataset:', err);
      return {
        data: [],
        isLive: false,
        source: 'Client Fallback Feed'
      };
    }
  },

  // Fetch hazard risk analysis for coordinate or location
  async getRiskAssessment(lat?: number, lng?: number, location?: string): Promise<RiskAssessment> {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lng !== undefined) params.append('lng', lng.toString());
    if (location) params.append('location', location);

    const res = await fetch(`/api/risk?${params.toString()}`);
    if (!res.ok) throw new Error('Risk assessment calculation failed');
    return await res.json();
  },

  // Fetch safe zones and shelters
  async getShelters(): Promise<Shelter[]> {
    const res = await fetch('/api/shelters');
    if (!res.ok) throw new Error('Failed to fetch shelters');
    const json = await res.json();
    return json.data || [];
  },

  // Fetch citizen damage reports
  async getDamageReports(): Promise<DamageReport[]> {
    const res = await fetch('/api/reports');
    if (!res.ok) throw new Error('Failed to fetch damage reports');
    const json = await res.json();
    return json.data || [];
  },

  // Submit new damage report
  async submitDamageReport(report: Partial<DamageReport>): Promise<{ success: boolean; data: DamageReport }> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return await res.json();
  },

  // Ask QuakeGuide AI
  async askAI(question: string, context?: string): Promise<{ answer: string; scientificNotice?: string }> {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context })
    });
    if (!res.ok) throw new Error('AI assistant response failed');
    return await res.json();
  },

  // Fetch AI Seismic Analytics
  async getAIAnalytics(regionName: string, historicalContext?: string): Promise<{ region: string; analysis: string; disclaimer: string }> {
    const res = await fetch('/api/ai/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regionName, historicalContext })
    });
    if (!res.ok) throw new Error('Failed to generate AI seismic analytics');
    return await res.json();
  },

  // Fetch Admin Stats
  async getStats(): Promise<any> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return await res.json();
  }
};
