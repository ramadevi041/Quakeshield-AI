import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Activity,
  Users,
  Radio,
  AlertTriangle,
  LifeBuoy,
  CheckCircle2,
  Clock,
  RefreshCw,
  Eye,
  Check,
  ShieldAlert
} from 'lucide-react';
import { DamageReport } from '../types';
import { api } from '../services/api';

export const AdminDashboardView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, reportsData] = await Promise.all([
        api.getStats(),
        api.getDamageReports()
      ]);
      setStats(statsData);
      setReports(reportsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Verified' } : r))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Disaster Management Control Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">ADMINISTRATIVE OPERATIONS</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Real-time emergency telemetry, citizen damage report triage, and network health monitoring.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Network Health KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Citizens Monitored</span>
          <div className="text-2xl font-black font-mono text-white">
            {stats?.totalCitizensProtected?.toLocaleString() || '124,890'}
          </div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active emergency notification reach</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Monitored Seismic Stations</span>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {stats?.monitoredSeismicStations || 1420}
          </div>
          <div className="text-xs text-slate-400 mt-1">Borehole & broadband instruments</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Telemetry Feed Latency</span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {stats?.networkLatencyMs || 34} ms
          </div>
          <div className="text-xs text-slate-400 mt-1">Fiber-optic station handshake</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Incoming Damage Reports</span>
          <div className="text-2xl font-black font-mono text-amber-400">
            {reports.length}
          </div>
          <div className="text-xs text-amber-300 mt-1">Citizen crowd submissions</div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Magnitude Distribution Chart */}
        <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Earthquake Magnitude Distribution (Past 30 Days)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Gutenberg-Richter Relation</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'M2.0 - M3.4 (Minor)', count: 48, max: 50, color: 'bg-emerald-500' },
              { label: 'M3.5 - M4.9 (Light)', count: 23, max: 50, color: 'bg-cyan-500' },
              { label: 'M5.0 - M5.9 (Moderate)', count: 9, max: 50, color: 'bg-amber-500' },
              { label: 'M6.0 - M6.9 (Strong)', count: 3, max: 50, color: 'bg-orange-500' },
              { label: 'M7.0+ (Major / Great)', count: 1, max: 50, color: 'bg-red-500' }
            ].map((item, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-mono font-bold">{item.count} events</span>
                </div>
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.count / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reported Damage by Severity Chart */}
        <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Damage Reports Breakdown by Severity
            </h3>
            <span className="text-xs text-slate-400 font-mono">Triage Queue</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Minor Cosmetic</span>
              <div className="text-2xl font-mono font-bold text-slate-200">
                {reports.filter((r) => r.severity === 'Minor').length}
              </div>
              <div className="text-[11px] text-slate-400">Hairline cracks, fallen tiles</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400">Moderate Hazard</span>
              <div className="text-2xl font-mono font-bold text-amber-400">
                {reports.filter((r) => r.severity === 'Moderate').length}
              </div>
              <div className="text-[11px] text-slate-400">Water pipe leaks, deep cracks</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-orange-400">Severe Damage</span>
              <div className="text-2xl font-mono font-bold text-orange-400">
                {reports.filter((r) => r.severity === 'Severe').length}
              </div>
              <div className="text-[11px] text-slate-400">Roadway cracks, partial beam failure</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-400">Critical Life Safety</span>
              <div className="text-2xl font-mono font-bold text-red-400">
                {reports.filter((r) => r.severity === 'Critical').length}
              </div>
              <div className="text-[11px] text-slate-400">Structural collapse / trapped persons</div>
            </div>
          </div>
        </div>
      </div>

      {/* Citizen Damage Reports Verification Table */}
      <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Incoming Citizen Damage Reports Queue ({reports.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and verify crowdsourced reports before broadcasting to municipal dispatch.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Damage Type</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Reported</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">{report.location}</td>
                  <td className="py-3 px-3 text-slate-300">{report.damageType}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        report.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : report.severity === 'Severe'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {report.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs truncate">{report.description}</td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                    {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        report.status === 'Verified' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {report.status !== 'Verified' && (
                      <button
                        onClick={() => handleVerifyReport(report.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] cursor-pointer transition-colors"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
