import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  Search, 
  Leaf, 
  DollarSign, 
  Briefcase, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle, 
  Clipboard,
  XSquare,
  AlertCircle,
  HelpCircle,
  Eye,
  Activity,
  QrCode,
  Camera
} from 'lucide-react';
import { TravelerDeclaration, AduanaStatus } from '../types';

interface AduanaPortalProps {
  declarations: TravelerDeclaration[];
  onUpdateStatus: (id: string, status: AduanaStatus, comments: string, officerName: string) => void;
}

export default function AduanaPortal({ declarations, onUpdateStatus }: AduanaPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [officerName, setOfficerName] = useState('Fiscalizador M. Olea (SAG/Aduana)');
  const [comments, setComments] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'high-risk' | 'pending'>('all');
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

  // Filter passengers
  const filteredDocs = declarations.filter(doc => {
    const matchesSearch = 
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;

    // Filter by pending or high-risk (ones declaring organic material or cash)
    if (filterType === 'pending') return doc.statusAduana === 'pending';
    if (filterType === 'high-risk') {
      return doc.sagDeclaration.bringsOrganic || 
             doc.sagDeclaration.bringsLiveAnimals || 
             doc.sagDeclaration.bringsSoilPlants ||
             doc.aduanaDeclaration.bringsCashOver10k ||
             doc.aduanaDeclaration.bringsCommercialGoods;
    }
    return true;
  });

  const selectedDoc = declarations.find(d => d.id === selectedId) || filteredDocs[0];

  const handleApplyStatus = (status: AduanaStatus) => {
    if (!selectedDoc) return;
    onUpdateStatus(selectedDoc.id, status, comments, officerName);
    setComments('');
  };

  // Helper tags to analyze risks
  const getRiskScore = (doc: TravelerDeclaration) => {
    let score = 0;
    let factors = [];

    if (doc.sagDeclaration.bringsOrganic) {
      score += 40;
      factors.push('Material vegetal fresco');
    }
    if (doc.sagDeclaration.bringsLiveAnimals) {
      score += 30;
      factors.push('Animal vivo declarado');
    }
    if (doc.sagDeclaration.bringsSoilPlants) {
      score += 35;
      factors.push('Plaguicidas o tierra');
    }
    if (doc.aduanaDeclaration.bringsCashOver10k) {
      score += 50;
      factors.push('Efectivo >10k USD');
    }
    if (doc.aduanaDeclaration.bringsCommercialGoods) {
      score += 25;
      factors.push('Bienes comerciales');
    }

    return {
      score,
      label: score >= 60 ? 'CRÍTICO' : score >= 30 ? 'MEDIO' : 'BAJO',
      color: score >= 60 ? 'text-red-600 bg-red-100 border-red-200' : score >= 30 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-emerald-600 bg-emerald-50 border-emerald-100',
      factors
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="aduana-control-portal">
      
      {/* LEFT COLUMN: LIST DIRECTORY OF PASSED TRAVELERS */}
      <div className="lg:col-span-4 bg-white rounded-2xl shadow-md border border-slate-100 p-4 space-y-4 flex flex-col h-[700px]">
        <div className="flex items-center gap-2 text-slate-900 border-b pb-3 shrink-0">
          <Building className="w-5 h-5 text-slate-800" />
          <div>
            <h3 className="font-sans font-bold text-sm text-slate-900">Control de Aduana y SAG</h3>
            <p className="text-[10px] text-slate-400 font-mono">DIFUSIÓN RECONOCIDA DE BIENES CONTROLADOS</p>
          </div>
        </div>

        {/* Officer info */}
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 shrink-0">
          <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Fiscalizador de Turno</label>
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
              id="start-aduana-qr-scanner"
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

        {/* Searching bar */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar Declaración / Cód..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-950 outline-none font-medium"
          />
        </div>

        {/* Filter modes */}
        <div className="flex bg-slate-100 p-1 rounded-lg text-[11px] shrink-0">
          {(['all', 'pending', 'high-risk'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilterType(mode)}
              className={`flex-1 text-center py-1 rounded font-semibold capitalize transition-all ${
                filterType === mode 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {mode === 'all' ? 'Ver Todos' : mode === 'pending' ? 'Pendientes' : 'Con Alertas'}
            </button>
          ))}
        </div>

        {/* List scroll elements */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => {
              const matchesSelected = selectedDoc && selectedDoc.id === doc.id;
              const hasAlerts = doc.sagDeclaration.bringsOrganic || doc.sagDeclaration.bringsLiveAnimals || doc.aduanaDeclaration.bringsCashOver10k;
              
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
                    matchesSelected
                      ? 'bg-slate-50 border-slate-900 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{doc.id}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      doc.statusAduana === 'cleared' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : doc.statusAduana === 'secondary' 
                          ? 'bg-red-100 text-red-800' 
                          : doc.statusAduana === 'fined' 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-slate-100 text-slate-600 animate-pulse'
                    }`}>
                      {doc.statusAduana === 'pending' ? 'Pendiente' : doc.statusAduana}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1.5 truncate">{doc.fullName}</h4>
                  
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[10px] text-slate-500 font-mono">{doc.nationality}</p>
                    {hasAlerts && (
                      <span className="text-[8px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <Leaf className="w-2.5 h-2.5" /> Declaró Elementos
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No se han encontrado registros aduaneros.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: PASSENGER FILE INSPECTOR */}
      <div className="lg:col-span-8 space-y-6">
        {selectedDoc ? (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 h-[700px] flex flex-col justify-between">
            
            {/* FILE HEADER DETAILED VIEW */}
            <div className="flex justify-between items-start border-b pb-4 shrink-0">
              <div>
                <span className="text-[9px] font-mono tracking-wider bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                  SAG / ADUANA ARCHIVE : {selectedDoc.id}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-1 select-all">{selectedDoc.fullName}</h3>
                <p className="text-xs text-slate-500">Procedencia: {selectedDoc.originCity}, {selectedDoc.originCountry} ({selectedDoc.flightNumber})</p>
              </div>
              
              {/* Risks Indicators */}
              <div className="text-right">
                {(() => {
                  const risk = getRiskScore(selectedDoc);
                  return (
                    <div className={`px-2.5 py-1 rounded-lg border text-xs text-center ${risk.color}`}>
                      <span className="text-[9px] uppercase tracking-wider block font-bold text-slate-400">Riesgo Fitosanitario</span>
                      <strong className="font-sans font-extrabold text-sm block">{risk.label}</strong>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* MAIN PORTFOLIO STATS GRID SCROLLABLE */}
            <div className="flex-1 overflow-y-auto space-y-6 my-4 pr-1 text-slate-800">
              
              {/* CRITICAL MIGRATION CONTROL STATUS FIRST */}
              <div className="bg-slate-50 p-3.5 border border-slate-100 rounded-xl text-xs flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Estado de Control Migratorio (PDI anterior):</span>
                <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                  selectedDoc.statusPDI === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedDoc.statusPDI === 'approved' ? '✓ PDI: Aprobado' : '⚠ PDI: Pendiente / Alerta'}
                </span>
              </div>

              {/* 1. SECCIÓN SAG (PRODUCTOS SILVOAGROPECUARIOS) */}
              <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-4 space-y-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b pb-1">
                  <Leaf className="w-4 h-4 text-slate-800" />
                  Declaraciones Ambientales y Sanitarias (SAG)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Organic card */}
                  <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                    selectedDoc.sagDeclaration.bringsOrganic ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div>
                      <span className="font-bold block text-slate-700">Origen Vegetal</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Semillas, frutas, verduras frescos u hortalizas rústicas.</p>
                    </div>
                    <span className={`mt-2 font-bold inline-block text-center rounded text-[11px] py-0.5 ${
                      selectedDoc.sagDeclaration.bringsOrganic ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedDoc.sagDeclaration.bringsOrganic ? 'SÍ DECLARÓ' : 'NO'}
                    </span>
                  </div>

                  {/* Live animal card */}
                  <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                    selectedDoc.sagDeclaration.bringsLiveAnimals ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div>
                      <span className="font-bold block text-slate-700">Animales Vivos</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Mascotas, carnes secas, quesos frescos o lácteos.</p>
                    </div>
                    <span className={`mt-2 font-bold inline-block text-center rounded text-[11px] py-0.5 ${
                      selectedDoc.sagDeclaration.bringsLiveAnimals ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedDoc.sagDeclaration.bringsLiveAnimals ? 'SÍ DECLARÓ' : 'NO'}
                    </span>
                  </div>

                  {/* Soil pests card */}
                  <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                    selectedDoc.sagDeclaration.bringsSoilPlants ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div>
                      <span className="font-bold block text-slate-700">Plaguicidas o Tierras</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Químicos veterinarios, fertilizantes de jardín o similares.</p>
                    </div>
                    <span className={`mt-2 font-bold inline-block text-center rounded text-[11px] py-0.5 ${
                      selectedDoc.sagDeclaration.bringsSoilPlants ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedDoc.sagDeclaration.bringsSoilPlants ? 'SÍ DECLARÓ' : 'NO'}
                    </span>
                  </div>
                </div>

                {/* Specific descriptions if YES */}
                {(selectedDoc.sagDeclaration.bringsOrganic || selectedDoc.sagDeclaration.bringsLiveAnimals || selectedDoc.sagDeclaration.bringsSoilPlants) && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs space-y-2 text-red-900 leading-relaxed font-sans">
                    <strong className="font-bold text-red-900 block flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 shrink-0" /> Detalle de Elementos Declarados para SAG:
                    </strong>
                    {selectedDoc.sagDeclaration.organicDetails && <p>• <strong>Vegetales:</strong> {selectedDoc.sagDeclaration.organicDetails}</p>}
                    {selectedDoc.sagDeclaration.animalDetails && <p>• <strong>Animales/Carnes:</strong> {selectedDoc.sagDeclaration.animalDetails}</p>}
                    {selectedDoc.sagDeclaration.plantDetails && <p>• <strong>Plaguicidas/Suelos:</strong> {selectedDoc.sagDeclaration.plantDetails}</p>}
                  </div>
                )}
              </div>

              {/* 2. SECCIÓN ADUANAS (EFECTIVO > 10K, BIENES COMERCIALES) */}
              <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-4 space-y-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b pb-1">
                  <Briefcase className="w-4 h-4 text-slate-800" />
                  Declaraciones Financieras y Arancelarias (Aduana)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Cash over 10K */}
                  <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                    selectedDoc.aduanaDeclaration.bringsCashOver10k ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div>
                      <span className="font-bold block text-slate-700 font-sans">Efectivo {'>'} 10k USD</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Ingreso de moneda legal superior a USD $10.000.</p>
                    </div>
                    <span className={`mt-2 font-bold inline-block text-center rounded text-[11px] py-0.5 ${
                      selectedDoc.aduanaDeclaration.bringsCashOver10k ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedDoc.aduanaDeclaration.bringsCashOver10k ? `SÍ: $${selectedDoc.aduanaDeclaration.cashAmount.toLocaleString()} USD` : 'NO'}
                    </span>
                  </div>

                  {/* Commercial merchandise */}
                  <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                    selectedDoc.aduanaDeclaration.bringsCommercialGoods ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div>
                      <span className="font-bold block text-slate-700">Muestrarios o Comercio</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Bienes nuevos de carácter comercial, no de equipaje común.</p>
                    </div>
                    <span className={`mt-2 font-bold inline-block text-center rounded text-[11px] py-0.5 ${
                      selectedDoc.aduanaDeclaration.bringsCommercialGoods ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedDoc.aduanaDeclaration.bringsCommercialGoods ? 'SÍ DECLARÓ' : 'NO'}
                    </span>
                  </div>

                  {/* Weapons / restrictions */}
                  <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                    selectedDoc.aduanaDeclaration.bringsRestrictedItems ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/50 border-slate-200'
                  }`}>
                    <div>
                      <span className="font-bold block text-slate-700">Armas o Químicos</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Inspeccionables por la ley de control de armas de la DGMN.</p>
                    </div>
                    <span className={`mt-2 font-bold inline-block text-center rounded text-[11px] py-0.5 ${
                      selectedDoc.aduanaDeclaration.bringsRestrictedItems ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedDoc.aduanaDeclaration.bringsRestrictedItems ? 'SÍ DECLARÓ' : 'NO'}
                    </span>
                  </div>
                </div>

                {/* Specific aduana inputs */}
                {(selectedDoc.aduanaDeclaration.bringsCashOver10k || selectedDoc.aduanaDeclaration.bringsCommercialGoods || selectedDoc.aduanaDeclaration.bringsRestrictedItems) && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs space-y-2 text-red-900 leading-relaxed font-sans">
                    <strong className="font-bold text-red-900 block flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 shrink-0" /> Detalle de Bienes Arancelarios:
                    </strong>
                    {selectedDoc.aduanaDeclaration.bringsCashOver10k && <p>• <strong>Efectivo Declarado:</strong> {selectedDoc.aduanaDeclaration.cashAmount.toLocaleString()} USD (Requiere acreditar origen en oficina central)</p>}
                    {selectedDoc.aduanaDeclaration.goodsDetails && <p>• <strong>Bienes Comerciales:</strong> {selectedDoc.aduanaDeclaration.goodsDetails}</p>}
                    {selectedDoc.aduanaDeclaration.restrictedDetails && <p>• <strong>Elementos Restringidos:</strong> {selectedDoc.aduanaDeclaration.restrictedDetails}</p>}
                  </div>
                )}
              </div>

              {/* RETURNING CHECK DETAILS */}
              {selectedDoc.aduanaCheckedAt && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-amber-800 font-bold">
                    <span>REGISTRO DE INFORME ADUANERO</span>
                    <span>{new Date(selectedDoc.aduanaCheckedAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-755"><strong>Funcionario:</strong> {selectedDoc.aduanaOfficer}</p>
                  <p className="text-slate-755"><strong>Resultados:</strong> {selectedDoc.aduanaComments}</p>
                </div>
              )}
            </div>

            {/* DECISION SYSTEM BOX ACTIONS */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 rounded-xl space-y-4 shrink-0">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clipboard className="w-4 h-4 text-slate-500" />
                  Acta de Inspección de Equipaje y Resoluciones *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Detalle el resultado físico, comiso voluntario, destrucción de semillas, o clearing del equipaje..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-950 outline-none bg-white font-medium"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyStatus('cleared')}
                  disabled={!comments.trim()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  title="Libera el equipaje del pasajero de forma oficial (Canal Verde)."
                >
                  <ShieldCheck className="w-4 h-4" /> Liberar Equipaje (Canal Verde)
                </button>
                
                <button
                  type="button"
                  onClick={() => handleApplyStatus('secondary')}
                  disabled={!comments.trim()}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  title="Turno especial de revisión física completa por máquina de inspección (Canal Rojo)."
                >
                  <Eye className="w-4 h-4" /> Inspección Física (Canal Rojo)
                </button>
                
                <button
                  type="button"
                  onClick={() => handleApplyStatus('fined')}
                  disabled={!comments.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  title="Infracción cursada por contrabando de alimentos frescos u omisión voluntaria."
                >
                  <XSquare className="w-4 h-4" /> Cursar Multa / Comiso
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-50 text-slate-400 text-sm border border-dashed rounded-2xl flex flex-col justify-center items-center h-[700px]">
            <Building className="w-12 h-12 text-slate-300 mb-2" />
            No hay declaraciones seleccionadas en la estación fiscal.
          </div>
        )}
      </div>

    </div>
  );
}
