import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Clock, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Minus, 
  Lock,
  Activity,
  Globe,
  Tag
} from 'lucide-react';
import { TravelerDeclaration, TransitStats } from '../types';
import { mockStats } from '../data/mockData';

interface DashboardPortalProps {
  declarations: TravelerDeclaration[];
}

export default function DashboardPortal({ declarations }: DashboardPortalProps) {
  const stats = mockStats(declarations);

  // Group purposes for stats
  const purposeCounts = declarations.reduce((acc: { [key: string]: number }, d) => {
    acc[d.travelPurpose] = (acc[d.travelPurpose] || 0) + 1;
    return acc;
  }, {});

  const totalPurposes = Object.values(purposeCounts).reduce((a, b) => a + b, 0) || 1;

  // Track nationality distributions
  const nationalityCounts = declarations.reduce((acc: { [key: string]: number }, d) => {
    acc[d.nationality] = (acc[d.nationality] || 0) + 1;
    return acc;
  }, {});

  const sortedNationalities = Object.entries(nationalityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-6" id="metrics-dashboard-portal">
      {/* 2x4 Grid of Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Processed */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-900">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Hoy Registrados</span>
            <span className="text-xl font-bold font-mono text-slate-800">{declarations.length}</span>
          </div>
        </div>

        {/* Checked/Authorized by PDI */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">PDI Aprobados</span>
            <span className="text-xl font-bold font-mono text-emerald-600">
              {declarations.filter(d => d.statusPDI === 'approved').length}
            </span>
          </div>
        </div>

        {/* Warned/Risk flagged */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">PDI Advertidos</span>
            <span className="text-xl font-bold font-mono text-amber-600">
              {declarations.filter(d => d.statusPDI === 'warning').length}
            </span>
          </div>
        </div>

        {/* Customs cleared */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-900">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Ventanilla Promedio</span>
            <span className="text-xl font-bold font-mono text-slate-800">{stats.averageSpeedSeconds}s</span>
          </div>
        </div>
      </div>

      {/* Analytics distribution visual widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TRAVEL MOTIVATIONS GRAPH */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-slate-900" />
              Motivos de Viaje a Chile (Distribución)
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">FRONTERAS ACTIVAS</span>
          </div>

          <div className="space-y-4 pt-1">
            {Object.entries(purposeCounts).map(([purpose, count]) => {
              const pct = Math.round((count / totalPurposes) * 100);
              return (
                <div key={purpose} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">{purpose}</span>
                    <span className="text-slate-800 font-semibold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-slate-900 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ORIGIN GEOGRAPHY & ADUANA CHANNEL STATS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-900" />
              Nacionalidades Frecuentes Recibidas
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">CONECTIVIDAD INTERNACIONAL</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {sortedNationalities.map(([nat, count], index) => {
              const maxCount = sortedNationalities[0][1] || 1;
              const barWidth = Math.round((count / maxCount) * 100);
              return (
                <div key={nat} className="flex items-center gap-4 text-xs">
                  <span className="w-24 text-slate-600 font-medium truncate">{nat}</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-slate-900 h-full rounded-full transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-slate-800 font-mono">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Separation box highlighting SAG alerts */}
          <div className="bg-red-50/50 rounded-xl p-3.5 border border-red-100 text-xs flex items-center justify-between mt-4">
            <div className="flex gap-2 items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <span className="font-bold text-red-900 block">Alertas de Bioseguridad SAG</span>
                <span className="text-red-700 text-[11px] block mt-0.5">Control silvoagropecuario detectó {declarations.filter(d => d.sagDeclaration.bringsOrganic || d.sagDeclaration.bringsLiveAnimals).length} declaraciones con material orgánico hoy.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CHRONOLOGY ACTIVITY LOGGER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-slate-900" />
            Registro de Actividad en Tiempo Real (Bitácora de Control)
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">CONTROL EN LÍNEA</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
          {declarations.filter(d => d.pdiCheckedAt || d.aduanaCheckedAt).length > 0 ? (
            declarations
              .filter(d => d.pdiCheckedAt || d.aduanaCheckedAt)
              .sort((a,b) => b.createdAt.localeCompare(a.createdAt))
              .map((d, index) => (
                <div key={index} className="py-2.5 text-xs flex flex-col sm:flex-row justify-between gap-1 items-start sm:items-center">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-700">{d.fullName}</span>
                    <p className="text-slate-500 text-[11px]">
                      {d.pdiOfficer && `• PDI: ${d.statusPDI.toUpperCase()} (${d.pdiOfficer})`}
                      {d.aduanaOfficer && ` • Aduana: ${d.statusAduana.toUpperCase()} (${d.aduanaOfficer})`}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded shrink-0">
                    {d.pdiCheckedAt ? new Date(d.pdiCheckedAt).toLocaleTimeString() : new Date(d.aduanaCheckedAt || d.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs text-center">
              Aún no hay stamps de oficiales registrados para este turno.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
