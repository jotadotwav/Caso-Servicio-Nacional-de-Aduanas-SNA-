import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Search, 
  AlertOctagon, 
  CheckCircle, 
  XOctagon, 
  FileText, 
  Clock, 
  Calendar, 
  UserCheck, 
  MapPin, 
  MessageSquare,
  Smartphone,
  Stamp,
  Fingerprint,
  RefreshCw,
  QrCode,
  Camera
} from 'lucide-react';
import { TravelerDeclaration, PdiStatus } from '../types';

interface PdiPortalProps {
  declarations: TravelerDeclaration[];
  onUpdateStatus: (id: string, status: PdiStatus, comments: string, officerName: string) => void;
}

export default function PdiPortal({ declarations, onUpdateStatus }: PdiPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [officerName, setOfficerName] = useState('Subinspector J. Valenzuela (PDI)');
  const [comments, setComments] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'processed'>('all');
  
  // Stamp animation trigger
  const [showStampAnim, setShowStampAnim] = useState(false);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [qrScanSuccessMsg, setQrScanSuccessMsg] = useState('');

  const simulateQRScan = (id: string) => {
    setIsScanningQR(true);
    setQrScanSuccessMsg('');
    setTimeout(() => {
      setSelectedId(id);
      setIsScanningQR(false);
      const traveler = declarations.find(d => d.id === id);
      if (traveler) {
        setQrScanSuccessMsg(`Éxito: Se leyó el QR de ${traveler.fullName}. Datos cargados.`);
        setTimeout(() => setQrScanSuccessMsg(''), 4000);
      }
    }, 1000);
  };

  // Filter declarations based on tab and searching
  const filteredDocs = declarations.filter(doc => {
    const matchesSearch = 
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;
    
    if (activeTab === 'pending') return doc.statusPDI === 'pending';
    if (activeTab === 'processed') return doc.statusPDI !== 'pending';
    return true;
  });

  const selectedDoc = declarations.find(d => d.id === selectedId) || filteredDocs[0];

  // Simple alert generation based on document or age for immersive simulation
  const getSecurityAlerts = (doc: TravelerDeclaration) => {
    const alerts = [];
    if (!doc) return [];
    
    // Check passport expiration or issues simulation
    if (doc.stayDays > 90 && doc.travelPurpose === 'Turismo') {
      alerts.push({
        level: 'warning',
        title: 'Estadía Turística Excesiva',
        desc: 'El plazo reglamentario para turismo es de 90 días ampliables. Ha indicado ' + doc.stayDays + ' días.'
      });
    }

    // Interpol warning simulation on names for police flavor
    if (doc.fullName.toLowerCase().includes('roberto carlos')) {
      alerts.push({
        level: 'warning',
        title: 'Homónimo Sospechoso - Interpol',
        desc: 'Coincidencia parcial de identidad con registro de extradición 2021. Verifique huella dactilar.'
      });
    }

    if (doc.nationality === 'Alemania' && doc.companions.length > 1) {
      alerts.push({
        level: 'info',
        title: 'Grupo Familiar Extranjero',
        desc: 'Registro migratorio conjunto. Confirme visas consulares para acompañantes menores.'
      });
    }

    if (doc.documentType === 'dni' && doc.nationality !== 'Chile' && !['Argentina', 'Brasil', 'Uruguay', 'Paraguay', 'Bolivia'].includes(doc.nationality)) {
      alerts.push({
        level: 'danger',
        title: 'Incompatibilidad de Documento',
        desc: 'País de origen no adscrito al Convenio de Tránsito de Cédula Mercosur. Exigir pasaporte físico.'
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        level: 'success',
        title: 'Sin Alertas de Frontera',
        desc: 'Sin coincidencias penales en base de datos nacional, Interpol SAC, ni infracciones anteriores.'
      });
    }

    return alerts;
  };

  const handleApplyStatus = (status: PdiStatus) => {
    if (!selectedDoc) return;
    
    if (status === 'approved') {
      setShowStampAnim(true);
      setTimeout(() => {
        setShowStampAnim(false);
      }, 1500);
    }

    onUpdateStatus(selectedDoc.id, status, comments, officerName);
    setComments('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="pdi-control-portal">
      {/* LEFT COLUMN: TRAVELER DIRECTORY LISTING */}
      <div className="lg:col-span-4 bg-white rounded-2xl shadow-md border border-slate-100 p-4 space-y-4 flex flex-col h-[700px]">
        <div className="flex items-center gap-2 text-slate-900 border-b pb-3 shrink-0">
          <Shield className="w-5 h-5 text-slate-900" />
          <div>
            <h3 className="font-sans font-bold text-sm text-slate-900">Control de Inmigración PDI</h3>
            <p className="text-[10px] text-slate-400 font-mono">BASE INTEGRADA DE CONTROL DE FRONTERAS</p>
          </div>
        </div>

        {/* Officer name config input */}
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 shrink-0">
          <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Funcionario del Turno</label>
          <input
            type="text"
            value={officerName}
            onChange={(e) => setOfficerName(e.target.value)}
            className="w-full text-xs bg-transparent border-0 focus:ring-0 p-0 font-medium text-slate-900 outline-none mt-0.5"
          />
        </div>

        {/* Lector QR (Simulación) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-slate-800" />
              Lector QR de Ventanilla
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {!isScanningQR ? (
            <button
              type="button"
              onClick={() => {
                setIsScanningQR(true);
                setQrScanSuccessMsg('');
              }}
              className="w-full py-2 bg-slate-100 text-slate-800 rounded font-medium text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300"
              id="start-pdi-qr-scanner"
            >
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              Escanear QR de Pasajero
            </button>
          ) : (
            <div className="space-y-2">
              <div className="relative bg-slate-950 p-3 rounded border border-slate-800 flex flex-col items-center justify-center min-h-[110px] overflow-hidden">
                <motion.div 
                  className="absolute inset-x-0 h-0.5 bg-emerald-400 opacity-80"
                  animate={{ top: ['5%', '95%', '5%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
                <QrCode className="w-6 h-6 text-emerald-400 animate-pulse mb-1" />
                <span className="text-[9px] font-mono tracking-widest text-emerald-300">LECTOR QR ACTIVO</span>
                <span className="text-[8px] text-slate-500 text-center mt-1">Seleccione un pasajero abajo para simular su lectura rápida o use este selector:</span>

                {/* Quick selector of active declarations */}
                <select
                  onChange={(e) => {
                    const id = e.target.value;
                    if (id) {
                      simulateQRScan(id);
                    }
                  }}
                  defaultValue=""
                  className="mt-2 w-full text-[10px] bg-slate-900 border border-slate-700 text-slate-300 rounded px-2 py-1 outline-none"
                >
                  <option value="" disabled>-- Seleccionar Pasajero a Escanear --</option>
                  {declarations.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.id})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setIsScanningQR(false)}
                className="w-full py-1 text-center border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-[10px] font-semibold transition"
              >
                Cancelar Escaneo
              </button>
            </div>
          )}

          {qrScanSuccessMsg && (
            <div className="mt-2 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 p-2 rounded text-center font-medium animate-fade-in">
              {qrScanSuccessMsg}
            </div>
          )}
        </div>

        {/* Searching filter inputs */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por Código, Nombre, Nº Doc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-950 outline-none font-medium"
          />
        </div>

        {/* Filter Tab options */}
        <div className="flex bg-slate-100 p-1 rounded-lg text-[11px] shrink-0">
          {(['all', 'pending', 'processed'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-1 rounded font-semibold capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'all' ? 'Ver Todos' : tab === 'pending' ? 'Pendientes' : 'Procesados'}
            </button>
          ))}
        </div>

        {/* Traveler scrolling element */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => {
              const worksAsSelected = selectedDoc && selectedDoc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => { 
                    if (isScanningQR) {
                      simulateQRScan(doc.id);
                    } else {
                      setSelectedId(doc.id); 
                      setComments(''); 
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    worksAsSelected
                      ? 'bg-slate-50 border-slate-900 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{doc.id}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      doc.statusPDI === 'approved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : doc.statusPDI === 'rejected' 
                          ? 'bg-red-100 text-red-800' 
                          : doc.statusPDI === 'warning' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-slate-100 text-slate-600 animate-pulse'
                    }`}>
                      {doc.statusPDI}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1.5 truncate">{doc.fullName}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{doc.nationality} • {doc.documentNumber}</p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No se encontraron coincidencias.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: DETAILED INVESTIGATION FILE VIEW */}
      <div className="lg:col-span-8 space-y-6">
        {selectedDoc ? (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 relative overflow-hidden h-[700px] flex flex-col justify-between">
            
            {/* STAMP EFFECT OVERLAY ANIMATION */}
            <AnimatePresence>
              {showStampAnim && (
                <motion.div 
                  initial={{ scale: 2.5, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 0.9, rotate: -7 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                >
                  <div className="p-6 border-8 border-emerald-600 rounded-2xl bg-white text-emerald-600 font-extrabold uppercase text-center tracking-widest font-mono shadow-2xl skew-x-3 rotate-[-7deg]">
                    <Stamp className="w-12 h-12 mx-auto mb-2 opacity-80" />
                    <div className="text-xl">PDI CHILE</div>
                    <div className="text-[10px] mt-1">INGRESO AUTORIZADO</div>
                    <div className="text-[9px] font-normal">{new Date().toLocaleDateString()}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* HEADER OF DOSSIER */}
            <div className="flex justify-between items-start border-b pb-4 shrink-0">
              <div>
                <span className="text-[9px] font-mono tracking-wider bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                  PASAJERO ID: {selectedDoc.id}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-1 select-all">{selectedDoc.fullName}</h3>
                <p className="text-xs text-slate-500">{selectedDoc.nationality} • Fecha Nacimiento: {selectedDoc.birthDate}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">REGISTRO PRECIOS</span>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  {new Date(selectedDoc.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* SCROLLABLE INNER ARCHIVE */}
            <div className="flex-1 overflow-y-auto space-y-6 my-4 pr-1 text-slate-800">
              
              {/* BIOMETRIC & BIOGRAPHIC IDENTIFICATION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b pb-1">
                    <Fingerprint className="w-4 h-4 text-slate-900" /> Cotejo Biográfico Primario
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Tipo Documento</span>
                      <strong className="text-slate-800 font-mono">{selectedDoc.documentType.toUpperCase()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Nº Documento</span>
                      <strong className="text-slate-800 font-mono">{selectedDoc.documentNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Emisor</span>
                      <strong className="text-slate-800 font-sans">{selectedDoc.countryOfIssue}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Género Registrado</span>
                      <strong className="text-slate-800">{selectedDoc.gender}</strong>
                    </div>
                  </div>
                </div>

                {/* Simulated Webcam or Passport scan image box */}
                <div className="bg-slate-900 rounded-xl p-3 flex flex-col justify-between text-white border border-slate-800 relative group overflow-hidden">
                  <div className="text-[9px] uppercase tracking-wider font-bold text-blue-400 flex items-center justify-between">
                    <span>BIOMETRÍA MOCK</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="w-full h-24 bg-slate-800 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center my-1.5 overflow-hidden relative">
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-500 opacity-50 top-1/2 animate-bounce" />
                    <Shield className="w-8 h-8 text-slate-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] uppercase tracking-widest font-mono text-slate-500 mt-2">CÁMARA BIO 01</span>
                  </div>
                  <div className="text-[8px] text-center text-slate-400 truncate">Sincronización de Identidad Habilitada</div>
                </div>
              </div>

              {/* AUTOMATED SCREENING STATUS & SEARCH CHECKS */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Alertas y Verificaciones de Fiscalía General</h4>
                <div className="space-y-2">
                  {getSecurityAlerts(selectedDoc).map((alert, i) => (
                    <div 
                      key={i}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs leading-relaxed ${
                        alert.level === 'danger' 
                          ? 'bg-red-50 text-red-800 border-red-200' 
                          : alert.level === 'warning' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : alert.level === 'success'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                              : 'bg-blue-50 text-blue-800 border-blue-100'
                      }`}
                    >
                      <AlertOctagon className={`w-4 h-4 shrink-0 mt-0.5 ${
                        alert.level === 'danger' ? 'text-red-600' : alert.level === 'warning' ? 'text-amber-600' : 'text-blue-600'
                      }`} />
                      <div>
                        <strong className="font-semibold block">{alert.title}</strong>
                        <span className="text-slate-600 block mt-0.5">{alert.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DETALLES DEL ITINERARIO */}
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-3 text-xs">
                <span className="text-xs font-bold text-slate-700 block border-b pb-1">Plan de Vía de Ingreso Declarado</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Origen del Vuelo/Bus</span>
                    <span>{selectedDoc.originCity}, {selectedDoc.originCountry}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Vuelo / Compañía</span>
                    <span className="font-mono">{selectedDoc.flightNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Control Fronterizo</span>
                    <span>{selectedDoc.entryPoint}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Motivo</span>
                    <span>{selectedDoc.travelPurpose}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Días Declarados</span>
                    <span className="font-bold">{selectedDoc.stayDays} días autorizables</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Dirección Destino</span>
                    <span className="truncate block" title={selectedDoc.addressInChile}>{selectedDoc.addressInChile}</span>
                  </div>
                </div>

                {/* Display companions if present */}
                {selectedDoc.companions.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 mt-3 space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold font-mono tracking-wider">
                      Control Migratorio e Identidad de Acompañantes
                    </span>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedDoc.companions.map((comp, idx) => {
                        const isMinor = comp.age < 18;
                        return (
                          <div 
                            key={idx} 
                            className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-semibold text-slate-800 block">{comp.fullName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  Nº Doc: {comp.documentNumber} • Relación: {comp.relationship}
                                </span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                isMinor 
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}>
                                {comp.age} años {isMinor ? '(Menor de Edad)' : '(Mayor de Edad)'}
                              </span>
                            </div>

                            {/* Digitalized validation details for minors */}
                            {isMinor ? (
                              <div className="bg-white rounded border border-slate-200 p-2 text-[11px] space-y-2">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-1.5">
                                  <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                                    Permisos de Viaje y Autorización Notarial
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-150 font-bold font-mono">
                                    Verificado QR
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-slate-600">
                                  <div>
                                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Tipo de Autorización</span>
                                    <span className="font-medium text-slate-800">
                                      {comp.relationship === 'Hijo/a' 
                                        ? 'Ambos Padres en Declaración' 
                                        : 'Autorización Notarial de Viaje'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block uppercase font-mono">ID de Validación Electrónica</span>
                                    <span className="font-mono text-slate-800 font-semibold text-[10px]">FEA-PDI-2026-0928</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Consulado / Notaría</span>
                                    <span className="font-medium text-slate-800">
                                      {selectedDoc.nationality === 'Alemania' 
                                        ? 'Consulado General en Fráncfort' 
                                        : 'Notaría 45º de Buenos Aires'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Certificado de Nacimiento</span>
                                    <span className="font-medium text-slate-800">Cargado y validado online</span>
                                  </div>
                                </div>
                                <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                                  <span>Firma Avanzada Vigente de Oficiales</span>
                                  <span className="font-mono font-bold text-slate-600">ID-SIGN: 8a4b-9e2f</span>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-white rounded border border-dashed border-slate-200 p-2 text-[10px] text-slate-500 font-mono">
                                Mayor de edad. Cumple condiciones para paso fronterizo independiente y declaración conjunta. No requiere permisos notariales especiales de menores.
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* PREVIOUS COMMENTS AND POLICE LOGS */}
              {selectedDoc.pdiCheckedAt && (
                <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-blue-800 font-bold">
                    <span>HISTORIAL DE CONTROL PDI</span>
                    <span>{new Date(selectedDoc.pdiCheckedAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-700"><strong>Oficial:</strong> {selectedDoc.pdiOfficer}</p>
                  <p className="text-slate-700"><strong>Comentarios:</strong> {selectedDoc.pdiComments}</p>
                </div>
              )}
            </div>

            {/* DECISION GATE PANEL SCREEN */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 rounded-xl space-y-4 shrink-0">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  Observaciones Policiales y Comentarios del Oficial *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Escriba aquí los detalles de la entrevista oficial e incidencias registradas..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-950 outline-none bg-white font-medium"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyStatus('approved')}
                  disabled={!comments.trim()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
                  title="Valida identidad, estampa pase e ingresa al viajero libremente."
                >
                  <UserCheck className="w-4 h-4" /> Aprobar Ingreso (Estampar)
                </button>
                
                <button
                  type="button"
                  onClick={() => handleApplyStatus('warning')}
                  disabled={!comments.trim()}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  title="Autoriza bajo amonestaciones o controles de seguimiento."
                >
                  <AlertOctagon className="w-4 h-4" /> Amonestación / Alerta
                </button>
                
                <button
                  type="button"
                  onClick={() => handleApplyStatus('rejected')}
                  disabled={!comments.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  title="Incompatibilidad total de documentos o impedimento policial de ingreso."
                >
                  <XOctagon className="w-4 h-4" /> Rechazar Ingreso
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-50 text-slate-400 text-sm border border-dashed rounded-2xl flex flex-col justify-center items-center h-[700px]">
            <Shield className="w-12 h-12 text-slate-300 mb-2" />
            No hay ningún pasajero cargado en la terminal de inmigración.
          </div>
        )}
      </div>
    </div>
  );
}
