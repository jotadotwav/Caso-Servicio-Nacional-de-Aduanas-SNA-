import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Building, 
  Activity, 
  Leaf, 
  HelpCircle, 
  Globe, 
  BookOpen,
  Wifi,
  ChevronRight
} from 'lucide-react';
import TravelerPortal from './components/TravelerPortal';
import PdiPortal from './components/PdiPortal';
import AduanaPortal from './components/AduanaPortal';
import DashboardPortal from './components/DashboardPortal';
import { initialDeclarations } from './data/mockData';
import { TravelerDeclaration, PdiStatus, AduanaStatus } from './types';

export default function App() {
  const [declarations, setDeclarations] = useState<TravelerDeclaration[]>(initialDeclarations);
  const [currentTab, setCurrentTab] = useState<'traveler' | 'pdi' | 'aduana' | 'stats'>('traveler');

  // Multi-actor synchronization handlers
  const handleRegisterTraveler = (declaration: TravelerDeclaration) => {
    setDeclarations(prev => [declaration, ...prev]);
  };

  const handleUpdatePdi = (id: string, status: PdiStatus, comments: string, officerName: string) => {
    setDeclarations(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          statusPDI: status,
          pdiComments: comments,
          pdiOfficer: officerName,
          pdiCheckedAt: new Date().toISOString()
        };
      }
      return d;
    }));
  };

  const handleUpdateAduana = (id: string, status: AduanaStatus, comments: string, officerName: string) => {
    setDeclarations(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          statusAduana: status,
          aduanaComments: comments,
          aduanaOfficer: officerName,
          aduanaCheckedAt: new Date().toISOString()
        };
      }
      return d;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900 pb-12">
      {/* MINIMALIST HEADER WITH LOGO EXPRESSED IN CSS DEVIATORS */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40" id="main-header-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Branding Shield */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rotate-45"></div>
              </div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1">
                PASOFÁCIL <span className="font-normal text-slate-300 mx-1.5">|</span> <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium font-mono">Ingreso Digital Integrado</span>
              </h1>
            </div>

            {/* Quick Status indicators */}
            <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg">
                <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-mono text-[10px]">SANTIAGO SCL OK</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg">
                <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Sincronización PDI, SAG, Aduana activa</span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* TOP DESCRIPTIVE INFORMATION BAR (REPLACED GRADIENT BANNER) */}
      <section className="bg-white border-b border-slate-200 py-10 px-4" id="main-hero-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2.5 py-0.5 bg-slate-950 text-white font-bold uppercase tracking-widest text-[9px] rounded font-mono">
              PRE-ACCESO DIGITAL
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-medium">DOCUMENTACIÓN DE CONTROL UNIFICADO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Control de Acceso y Declaración Jurada Integrada
          </h2>
          <p className="text-sm max-w-3xl text-slate-500 font-light leading-relaxed">
            Complete de forma anticipada sus datos biográficos de identidad, propósitos, equipaje controlado y autodeclaración del <strong className="font-semibold text-slate-800">SAG y Aduana</strong> para agilizar la atención en ventanillas físicas en las fronteras de Chile.
          </p>
        </div>
      </section>

      {/* WORKSPACE ROTATOR DESK TABS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Navigation role controller */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex flex-wrap gap-1 sm:gap-1.5 justify-center sm:justify-start" id="actor-routing-tab-list">
          {[
            { id: 'traveler', label: 'Portal del Viajero' },
            { id: 'pdi', label: 'Control PDI' },
            { id: 'aduana', label: 'Aduana & SAG' },
            { id: 'stats', label: 'Estadísticas de Paso' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                currentTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DEMO USE-CASE EXPLAINER HELPER BANNER */}
        <div className="bg-white border flex gap-4 text-xs p-5 shadow-sm border-slate-200 border-l-4 border-l-slate-900 rounded-lg text-slate-600 leading-relaxed">
          <BookOpen className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold text-slate-950 block text-sm">Guía de Evaluación Rápida:</strong>
            <p className="text-slate-500">
              Como usuario evaluador, usted puede alternar entre roles en cualquier momento:
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-1.5 text-slate-500 font-medium">
              <li>Use el <strong className="font-semibold text-slate-800 font-display">Portal del Viajero</strong> para pre-cargar un documento de ejemplo, rellenar datos y generar un código QR de viaje.</li>
              <li>Consulte la pestaña <strong className="font-semibold text-slate-800 font-display">Control PDI</strong> o <strong className="font-semibold text-slate-800 font-display">Aduana & SAG</strong> para buscar al pasajero, emitir alertas y simular la aprobación en ventanilla física.</li>
              <li>Vea estadísticas del flujo del turno actual en la pestaña <strong className="font-semibold text-slate-800 font-display">Estadísticas de Paso</strong>.</li>
            </ol>
          </div>
        </div>

        {/* ACTIVE PORTAL CHANGER */}
        <div className="transition-all duration-300">
          {currentTab === 'traveler' && (
            <TravelerPortal onRegister={handleRegisterTraveler} />
          )}

          {currentTab === 'pdi' && (
            <PdiPortal 
              declarations={declarations} 
              onUpdateStatus={handleUpdatePdi} 
            />
          )}

          {currentTab === 'aduana' && (
            <AduanaPortal 
              declarations={declarations} 
              onUpdateStatus={handleUpdateAduana} 
            />
          )}

          {currentTab === 'stats' && (
            <DashboardPortal declarations={declarations} />
          )}
        </div>

      </main>

      {/* Chilean official disclaimer footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center text-[10px] text-slate-400 font-medium">
        <p className="tracking-wide">© {new Date().getFullYear()} GOBIERNO DE CHILE • MINISTERIO DEL INTERIOR Y SEGURIDAD PÚBLICA</p>
        <p className="mt-1 leading-relaxed leading-[1.4]">
          Esta es una simulación de alta fidelidad funcional de integración de control fronterizo integrado (PDI, SAG, Aduana). Para uso demostrativo de agilización de ventanilla digital.
        </p>
      </footer>
    </div>
  );
}
