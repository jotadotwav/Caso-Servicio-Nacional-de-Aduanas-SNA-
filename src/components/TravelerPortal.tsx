import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Plane, 
  Users, 
  ShieldAlert, 
  CheckCircle, 
  QrCode, 
  Plus, 
  Trash2, 
  Camera, 
  FileText, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Printer, 
  AlertTriangle,
  Sparkles,
  Info,
  Upload,
  Paperclip
} from 'lucide-react';
import { TravelerDeclaration, Companion, SagDeclaration, AduanaDeclaration } from '../types';
import { CHILEAN_BORDER_CROSSINGS, NATIONALITIES } from '../data/mockData';
import QrCodeSvg from './QrCodeSvg';

interface TravelerPortalProps {
  onRegister: (declaration: TravelerDeclaration) => void;
}

const PASSPORT_MOCKS = [
  {
    label: 'Pasaporte Francés (Amélie)',
    fullName: 'Amélie Dupont',
    gender: 'Femenino',
    birthDate: '1992-05-14',
    nationality: 'Francia',
    documentType: 'pasaporte' as const,
    documentNumber: 'FR8432298',
    countryOfIssue: 'Francia',
    email: 'amelie.dupont@gmail.com',
    phone: '+33 612 345 678',
    originCountry: 'Francia',
    originCity: 'París',
  },
  {
    label: 'Cédula Brasileña (Roberto)',
    fullName: 'Roberto Carlos Silva',
    gender: 'Masculino',
    birthDate: '1985-11-23',
    nationality: 'Brasil',
    documentType: 'dni' as const,
    documentNumber: '42.983.102-K',
    countryOfIssue: 'Brasil',
    email: 'rcsilva@uol.com.br',
    phone: '+55 11 98822 4111',
    originCountry: 'Brasil',
    originCity: 'São Paulo',
  },
  {
    label: 'Pasaporte EE.UU. (Steve)',
    fullName: 'Steve Miller',
    gender: 'Masculino',
    birthDate: '1979-06-03',
    nationality: 'Estados Unidos',
    documentType: 'pasaporte' as const,
    documentNumber: 'US55431802',
    countryOfIssue: 'Estados Unidos',
    email: 'smiller@aim.com',
    phone: '+1 415 555 9823',
    originCountry: 'Estados Unidos',
    originCity: 'Los Ángeles',
  }
];

export default function TravelerPortal({ onRegister }: TravelerPortalProps) {
  const [step, setStep] = useState<number>(1);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Femenino');
  const [birthDate, setBirthDate] = useState('');
  const [nationality, setNationality] = useState('Argentina');
  const [documentType, setDocumentType] = useState<'pasaporte' | 'dni' | 'cedula'>('pasaporte');
  const [documentNumber, setDocumentNumber] = useState('');
  const [showDocError, setShowDocError] = useState<boolean>(false);
  const [countryOfIssue, setCountryOfIssue] = useState('Chile');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Trip Info state
  const [originCountry, setOriginCountry] = useState('Argentina');
  const [originCity, setOriginCity] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [entryPoint, setEntryPoint] = useState(CHILEAN_BORDER_CROSSINGS[0]);
  const [travelPurpose, setTravelPurpose] = useState('Turismo');
  const [stayDays, setStayDays] = useState<number>(7);
  const [addressInChile, setAddressInChile] = useState('');

  // Companions State
  const [hasCompanions, setHasCompanions] = useState(false);
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [newCompName, setNewCompName] = useState('');
  const [newCompNumber, setNewCompNumber] = useState('');
  const [newCompRelationship, setNewCompRelationship] = useState('Familiar');
  const [newCompAge, setNewCompAge] = useState<number>(30);
  const [newCompFile, setNewCompFile] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // SAG State
  const [bringsOrganic, setBringsOrganic] = useState(false);
  const [organicDetails, setOrganicDetails] = useState('');
  const [bringsLiveAnimals, setBringsLiveAnimals] = useState(false);
  const [animalDetails, setAnimalDetails] = useState('');
  const [bringsSoilPlants, setBringsSoilPlants] = useState(false);
  const [plantDetails, setPlantDetails] = useState('');

  // Aduana State
  const [bringsCashOver10k, setBringsCashOver10k] = useState(false);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [bringsCommercialGoods, setBringsCommercialGoods] = useState(false);
  const [goodsDetails, setGoodsDetails] = useState('');
  const [bringsRestrictedItems, setBringsRestrictedItems] = useState(false);
  const [restrictedDetails, setRestrictedDetails] = useState('');

  // Generated Result
  const [registeredDoc, setRegisteredDoc] = useState<TravelerDeclaration | null>(null);

  // Trigger Mock OCR Scan
  const triggerMockScan = (mockIndex: number) => {
    setScanning(true);
    setScanSuccess(false);
    setTimeout(() => {
      const selected = PASSPORT_MOCKS[mockIndex];
      setFullName(selected.fullName);
      setGender(selected.gender);
      setBirthDate(selected.birthDate);
      setNationality(selected.nationality);
      setDocumentType(selected.documentType);
      setDocumentNumber(selected.documentNumber);
      setCountryOfIssue(selected.countryOfIssue);
      setEmail(selected.email);
      setPhone(selected.phone);
      setOriginCountry(selected.originCountry);
      setOriginCity(selected.originCity);
      
      setScanning(false);
      setScanSuccess(true);
    }, 1200);
  };

  const addCompanion = () => {
    if (!newCompName.trim() || !newCompNumber.trim()) return;
    const item: Companion = {
      id: 'C_' + Math.random().toString(36).substr(2, 9),
      fullName: newCompName,
      documentNumber: newCompNumber,
      relationship: newCompRelationship,
      age: newCompAge,
      notarialFile: newCompAge < 18 ? (newCompFile || undefined) : undefined,
      notarialFileStatus: newCompAge < 18 ? (newCompFile ? 'loaded' : 'pending') : undefined
    };
    setCompanions([...companions, item]);
    setNewCompName('');
    setNewCompNumber('');
    setNewCompFile('');
  };

  const removeCompanion = (id: string) => {
    setCompanions(companions.filter(c => c.id !== id));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (documentNumber.trim() === '') {
        setShowDocError(true);
        return;
      }
      if (fullName.trim() === '' || birthDate === '') {
        return;
      }
    }
    if (step === 2) {
      if (originCity.trim() === '' || addressInChile.trim() === '') {
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      handleNextStep();
      return;
    }
    const cleanId = 'CL-' + Math.floor(10000 + Math.random() * 90000);
    
    const newDoc: TravelerDeclaration = {
      id: cleanId,
      fullName,
      gender,
      birthDate,
      nationality,
      documentType,
      documentNumber,
      countryOfIssue,
      email,
      phone,
      originCountry,
      originCity,
      flightNumber: flightNumber || 'N/A',
      entryPoint,
      travelPurpose,
      stayDays: Number(stayDays),
      addressInChile,
      companions: hasCompanions ? companions : [],
      sagDeclaration: {
        bringsOrganic,
        organicDetails: bringsOrganic ? organicDetails : '',
        bringsLiveAnimals,
        animalDetails: bringsLiveAnimals ? animalDetails : '',
        bringsSoilPlants,
        plantDetails: bringsSoilPlants ? plantDetails : ''
      },
      aduanaDeclaration: {
        bringsCashOver10k,
        cashAmount: bringsCashOver10k ? Number(cashAmount) : 0,
        bringsCommercialGoods,
        goodsDetails: bringsCommercialGoods ? goodsDetails : '',
        bringsRestrictedItems,
        restrictedDetails: bringsRestrictedItems ? restrictedDetails : ''
      },
      passportPhoto: null,
      scannedDocInfo: scanSuccess ? {
        fullName,
        documentNumber,
        birthDate,
        nationality,
        parsedSuccessfully: true
      } : null,
      statusPDI: 'pending',
      statusAduana: 'pending',
      createdAt: new Date().toISOString()
    };

    setRegisteredDoc(newDoc);
    onRegister(newDoc);
    setStep(5);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" id="traveler-app-portal">
      {/* Sleek Minimalist Border Accent */}
      <div className="h-1 w-full bg-slate-900" />

      {/* App Header */}
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="inline-block px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest bg-slate-100 text-slate-800 rounded mb-1 font-mono">
            Portal Oficial del Viajero
          </span>
          <h2 className="text-lg font-sans font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="h-5 w-5 text-slate-900" /> Declaración Pre-Viaje Chile
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete este formulario antes de abordar para ingresar expeditamente por PDI y Aduana/SAG.
          </p>
        </div>
        <div className="hidden sm:flex items-center text-xs text-right text-slate-400 font-mono">
          <div>Ref: SAG / ADUANA / PDI<br/>Formulario Único Digital</div>
        </div>
      </div>

      {/* Step Tracker (Only visible during filing) */}
      {step < 5 && (
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 px-6 sm:px-12">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Identidad', icon: User },
              { num: 2, label: 'Viaje', icon: Plane },
              { num: 3, label: 'Compañeros', icon: Users },
              { num: 4, label: 'Declaración', icon: ShieldAlert }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                  step === s.num 
                    ? 'border-slate-900 bg-slate-900 text-white font-bold ring-4 ring-slate-100' 
                    : step > s.num 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                      : 'border-slate-200 bg-white text-slate-400'
                }`}>
                  {step > s.num ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-xs">{s.num}</span>
                  )}
                </div>
                <span className={`text-xs font-semibold hidden md:inline-block ${
                  step === s.num ? 'text-slate-900 font-bold' : 'text-slate-400'
                }`}>{s.label}</span>
                {s.num < 4 && <div className="hidden md:block flex-1 h-0.5 max-w-16 bg-slate-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Body */}
      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex gap-3.5 text-slate-700">
                <Sparkles className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900">Agilice el llenado con un escaneo simulado:</span> Seleccione uno de los ejemplos oficiales para pre-cargar y simular un escaneo por OCR óptico de su documento de identidad.
                  
                  {/* Mock selector pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {PASSPORT_MOCKS.map((mock, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => triggerMockScan(i)}
                        disabled={scanning}
                        className="px-2.5 py-1 text-xs bg-white hover:bg-slate-50 border border-slate-200 rounded font-medium text-slate-800 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        {mock.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scanning visual overlay */}
              {scanning && (
                <div className="bg-slate-950 text-white rounded-xl p-6 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-32 border border-slate-800">
                  <motion.div 
                    className="absolute inset-x-0 h-0.5 bg-white opacity-80"
                    animate={{ top: ['5%', '95%', '5%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                  <Camera className="w-8 h-8 text-slate-400 animate-pulse mb-2" />
                  <p className="text-xs font-mono tracking-widest text-slate-300">DISPOSITIVO MRZ ACTIVO...</p>
                  <p className="text-[10px] text-slate-500 mt-1">Extrayendo datos de pasaporte de forma simulada</p>
                </div>
              )}

              {scanSuccess && !scanning && (
                <div className="bg-emerald-50 rounded-lg p-3 text-emerald-850 text-xs border border-emerald-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> ¡Documento escaneado y reconocido con éxito!
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setScanSuccess(false)}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Deshacer
                  </button>
                </div>
              )}

              <h3 className="font-sans font-bold text-slate-800 text-sm uppercase tracking-wider border-b pb-2 mb-4">
                1. Datos de Identidad del Pasajero
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre Completo (como en pasaporte) *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Amélie Dupont"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-100 focus:border-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Género Registrado</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-100 focus:border-slate-900 outline-none bg-white"
                  >
                    <option>Femenino</option>
                    <option>Masculino</option>
                    <option>Otro / X</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-100 focus:border-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nacionalidad de Origen</label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-100 focus:border-slate-900 outline-none bg-white"
                  >
                    {NATIONALITIES.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo de Documento de Viaje *</label>
                  <div className="flex gap-4 mt-1.5">
                    {[
                      { val: 'pasaporte', lbl: 'Pasaporte' },
                      { val: 'dni', lbl: 'DNI / Cédula Mercosur' }
                    ].map(opt => (
                      <label key={opt.val} className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="docType"
                          checked={documentType === opt.val}
                          onChange={() => setDocumentType(opt.val as any)}
                          className="text-[#002f6c] focus:ring-[#002f6c]"
                        />
                        {opt.lbl}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    required
                    value={documentNumber}
                    onChange={(e) => {
                      setDocumentNumber(e.target.value);
                      if (showDocError && e.target.value.trim() !== '') {
                        setShowDocError(false);
                      }
                    }}
                    placeholder="Ej. FR8432298"
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg outline-none ${
                      showDocError && documentNumber.trim() === ''
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50/10 text-red-900'
                        : 'border-slate-300 focus:ring-2 focus:ring-[#002f6c]'
                    }`}
                  />
                  {showDocError && documentNumber.trim() === '' && (
                    <p className="text-red-500 text-xs mt-1">Campo obligatorio</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">País Emisor del Documento</label>
                  <select
                    value={countryOfIssue}
                    onChange={(e) => setCountryOfIssue(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002f6c] outline-none bg-white"
                  >
                    {NATIONALITIES.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Correo Electrónico (para notificaciones) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amelie@ejemplo.com"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002f6c] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Teléfono Móvil (Contacto de Emergencia)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +33 612 345 678"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002f6c] outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: TRIP DETAILS */}
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="font-sans font-bold text-slate-800 text-base border-b pb-2 mb-4">
                2. Planificación del Viaje y Destino en Chile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">País de Procedencia del Viaje *</label>
                  <select
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002f6c] outline-none bg-white"
                  >
                    {NATIONALITIES.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ciudad de Embarque *</label>
                  <input
                    type="text"
                    required
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    placeholder="Ej. París o Buenos Aires"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002f6c] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Número de Vuelo / Companía Terrestre</label>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="Ej. AF406 o Auto Particular"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002f6c] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Paso Fronterizo de Entrada a Chile *</label>
                  <select
                    value={entryPoint}
                    onChange={(e) => setEntryPoint(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002f6c] outline-none bg-white"
                  >
                    {CHILEAN_BORDER_CROSSINGS.map(pt => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Motivo Principal del Viaje</label>
                  <select
                    value={travelPurpose}
                    onChange={(e) => setTravelPurpose(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002f6c] outline-none bg-white"
                  >
                    <option>Turismo</option>
                    <option>Negocios</option>
                    <option>Estudios</option>
                    <option>Trabajo / Contrato</option>
                    <option>Residente que retorna</option>
                    <option>Razones Humanitarias</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Días Previstos de Estadía *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={180}
                    value={stayDays}
                    onChange={(e) => setStayDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002f6c] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Dirección Prevista en Chile (Hotel/Domicilio) *</label>
                  <input
                    type="text"
                    required
                    value={addressInChile}
                    onChange={(e) => setAddressInChile(e.target.value)}
                    placeholder="Ej. Hotel El Singular, Lastarria 298, Santiago de Chile"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002f6c] outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: COMPANIONS */}
          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <h3 className="font-sans font-bold text-slate-800 text-base border-b pb-2 mb-4 flex justify-between items-center">
                <span>3. Grupo Familiar o Acompañantes</span>
                <span className="text-xs bg-slate-100 text-slate-600 py-0.5 px-2 rounded font-normal">
                  Fines estadísticos y de declaración única
                </span>
              </h3>

              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700">¿Viaja acompañado de familiares a su cargo?</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Acompañantes directos que comparten la misma declaración aduanera y de SAG.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasCompanions} 
                      onChange={(e) => setHasCompanions(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002f6c]"></div>
                  </label>
                </div>

                <AnimatePresence>
                  {hasCompanions && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-slate-200"
                    >
                      {/* Companion addition sub-form */}
                      <div className="bg-white p-4 border border-slate-200 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Nombre Completo del Acompañante</label>
                            <input
                              type="text"
                              value={newCompName}
                              onChange={(e) => setNewCompName(e.target.value)}
                              placeholder="Ej. Greta Müller"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-950 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Nº Identificación / Pasaporte</label>
                            <input
                              type="text"
                              value={newCompNumber}
                              onChange={(e) => setNewCompNumber(e.target.value)}
                              placeholder="DE55431110"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-950 outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Edad</label>
                              <input
                                type="number"
                                min={0}
                                max={120}
                                value={newCompAge}
                                onChange={(e) => {
                                  const age = Number(e.target.value);
                                  setNewCompAge(age);
                                  if (age >= 18) {
                                    setNewCompFile('');
                                  }
                                }}
                                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-950 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Relación</label>
                              <select
                                value={newCompRelationship}
                                onChange={(e) => setNewCompRelationship(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-slate-950 outline-none font-medium text-slate-850"
                              >
                                <option>Cónyuge o Pareja</option>
                                <option>Hijo/a</option>
                                <option>Hermano/a</option>
                                <option>Padre/Madre</option>
                                <option>Familiar / Otro</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* File Upload Section for Minors */}
                        {newCompAge < 18 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-start gap-2">
                              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-xs font-semibold text-slate-800 block">Autorización Notarial Obligatoria (Menor de Edad)</span>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                  Al viajar con un menor de edad, se requiere adjuntar digitalmente el permiso notarial o consular apostillado correspondiente para autorizar su salida del país de origen de forma anticipada y reducir tiempos de control.
                                </p>
                              </div>
                            </div>

                            {/* Drag and Drop Area */}
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                              }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                  const file = e.dataTransfer.files[0];
                                  setNewCompFile(file.name);
                                }
                              }}
                              className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all ${
                                isDragging 
                                  ? 'border-indigo-500 bg-indigo-50/50' 
                                  : newCompFile 
                                    ? 'border-emerald-300 bg-emerald-50/20' 
                                    : 'border-slate-300 bg-white hover:bg-slate-50'
                              }`}
                            >
                              <input
                                type="file"
                                id="notarial-file-upload"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    setNewCompFile(e.target.files[0].name);
                                  }
                                }}
                              />
                              
                              {!newCompFile ? (
                                <label htmlFor="notarial-file-upload" className="cursor-pointer space-y-2 flex flex-col items-center w-full py-1">
                                  <Upload className={`w-8 h-8 ${isDragging ? 'text-indigo-500' : 'text-slate-400'}`} />
                                  <div>
                                    <span className="text-xs font-semibold text-slate-800 hover:underline">Seleccione un archivo</span>
                                    <span className="text-xs text-slate-500"> o arrástrelo aquí</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400">PDF, JPG, PNG (hasta 10MB)</p>
                                </label>
                              ) : (
                                <div className="w-full flex items-center justify-between bg-white border border-emerald-100 p-2 rounded-md">
                                  <div className="flex items-center gap-2 text-left">
                                    <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded">
                                      <Paperclip className="w-4 h-4" />
                                    </div>
                                    <div className="truncate max-w-[180px] sm:max-w-[300px]">
                                      <span className="text-xs font-semibold text-slate-800 block truncate">{newCompFile}</span>
                                      <span className="text-[10px] text-emerald-600 font-medium">Autorización cargada correctamente</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setNewCompFile('')}
                                    className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Option to mock for easy user flow */}
                            {!newCompFile && (
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setNewCompFile(`Autorizacion_Viaje_${newCompName ? newCompName.trim().replace(/\s+/g, '_') : 'Menor'}.pdf`)}
                                  className="text-[10px] font-semibold text-slate-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-all flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" /> Simular Carga de Autorización Notarial
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={addCompanion}
                            disabled={!newCompName.trim() || !newCompNumber.trim() || (newCompAge < 18 && !newCompFile)}
                            className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-1.5 transition-all text-white ${
                              (!newCompName.trim() || !newCompNumber.trim() || (newCompAge < 18 && !newCompFile))
                                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                                : 'bg-[#002f6c] hover:bg-[#001f4c]'
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Finalizar
                          </button>
                        </div>
                      </div>

                      {/* Display added companions */}
                      {companions.length > 0 ? (
                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono">
                                <th className="p-2.5 pl-4 font-semibold">Nombre del Acompañante</th>
                                <th className="p-2.5 font-semibold">Nº Doc</th>
                                <th className="p-2.5 font-semibold">Relación</th>
                                <th className="p-2.5 font-semibold text-center">Edad</th>
                                <th className="p-2.5 font-semibold">Autorización Notarial</th>
                                <th className="p-2.5 pr-4 text-right font-semibold">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {companions.map((comp) => (
                                <tr key={comp.id} className="border-b last:border-0 border-slate-100 hover:bg-slate-50/50">
                                  <td className="p-2.5 pl-4 font-medium text-slate-800">
                                    {comp.fullName}
                                    {comp.age < 18 && (
                                      <span className="ml-1.5 inline-block text-[9px] bg-amber-100 text-amber-800 font-bold px-1 py-0.2 rounded">
                                        Menor
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-2.5 text-slate-600 font-mono">{comp.documentNumber}</td>
                                  <td className="p-2.5 text-slate-600">{comp.relationship}</td>
                                  <td className="p-2.5 text-slate-705 text-center font-semibold">{comp.age} años</td>
                                  <td className="p-2.5">
                                    {comp.age < 18 ? (
                                      comp.notarialFile ? (
                                        <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                                          <Paperclip className="w-3 h-3 text-emerald-600" />
                                          <span className="truncate max-w-[130px] inline-block font-mono text-[11px]" title={comp.notarialFile}>
                                            {comp.notarialFile}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-amber-700 font-bold flex items-center gap-1 text-[10px]">
                                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Faltante
                                        </span>
                                      )
                                    ) : (
                                      <span className="text-slate-400 font-normal">No requerido</span>
                                    )}
                                  </td>
                                  <td className="p-2.5 pr-4 text-right">
                                    <button
                                      type="button"
                                      onClick={() => removeCompanion(comp.id)}
                                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-all inline-flex align-middle"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center p-6 border-2 border-dashed border-slate-200 bg-white rounded-lg text-slate-400 text-xs">
                          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          Aún no hay acompañantes agregados. Rellene los campos anteriores y pulse "Agregar".
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SAG / ADUANA DECLARATIONS */}
          {step === 4 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="font-sans font-bold text-slate-800 text-base border-b pb-2 mb-4 flex justify-between items-center">
                <span>4. Declaración Jurada Conjunta (SAG / Aduanas)</span>
                <span className="text-xs text-red-600 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" /> Declaración Obligatoria
                </span>
              </h3>

              <div className="space-y-5">
                
                {/* 1. SECCIÓN SAG (SERVICIO AGRÍCOLA Y GANADERO) */}
                <div className="border border-[#1d4ed8]/20 rounded-xl p-5 bg-[#eff6ff]/30 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-900 border-b border-blue-100 pb-1.5">
                    <span className="bg-blue-600 text-white text-[10px] uppercase font-mono px-1.5 py-0.5 rounded">SAG</span>
                    Control Sanitario Silvoagropecuario de Chile
                  </div>

                  <p className="text-xs text-slate-600">
                    Chile resguarda rigurosamente su patrimonio fito y zoosanitario libre de plagas. El ingreso de material orgánico no declarado conlleva severas multas de inmediato.
                  </p>

                  <div className="space-y-4 pt-2">
                    {/* Organic Question */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 theme-question">
                      <div className="max-w-xl">
                        <h4 className="text-xs font-semibold text-slate-800">
                          ¿Porta productos de origen vegetal en su equipaje?
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Semillas, frutas, verduras frescas, flores, frutos secos, tierra, maderas rústicas, café en grano crudo, etc.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBringsOrganic(true)}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            bringsOrganic ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-100' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          SÍ
                        </button>
                        <button
                          type="button"
                          onClick={() => { setBringsOrganic(false); setOrganicDetails(''); }}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            !bringsOrganic ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                    {bringsOrganic && (
                      <textarea
                        required
                        value={organicDetails}
                        onChange={(e) => setOrganicDetails(e.target.value)}
                        placeholder="Especifique tipo de producto vegetal e indíquele al fiscalizador agrícola."
                        className="w-full text-xs p-2.5 border border-red-200 focus:ring-1 focus:ring-red-500 outline-none rounded bg-white"
                      />
                    )}

                    {/* Live Animals Question */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 theme-question">
                      <div className="max-w-xl">
                        <h4 className="text-xs font-semibold text-slate-800">
                          ¿Ingresa animales vivos, subproductos, comida para mascotas o productos biológicos?
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Perros, gatos, aves, carnes procesadas, embutidos, quesos frescos o lácteos no pasteurizados, etc.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBringsLiveAnimals(true)}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            bringsLiveAnimals ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-100' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          SÍ
                        </button>
                        <button
                          type="button"
                          onClick={() => { setBringsLiveAnimals(false); setAnimalDetails(''); }}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            !bringsLiveAnimals ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                    {bringsLiveAnimals && (
                      <textarea
                        required
                        value={animalDetails}
                        onChange={(e) => setAnimalDetails(e.target.value)}
                        placeholder="Especifique especie de mascota, procedencia y vacuna, o tipo de carne lácteo a fiscalizar."
                        className="w-full text-xs p-2.5 border border-red-200 focus:ring-1 focus:ring-red-500 outline-none rounded bg-white"
                      />
                    )}

                    {/* Soil/Plants Question */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 theme-question">
                      <div className="max-w-xl">
                        <h4 className="text-xs font-semibold text-slate-800">
                          ¿Porta plaguicidas, fármacos de uso veterinario, abonos o sustrato orgánico/tierra de jardinería?
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBringsSoilPlants(true)}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            bringsSoilPlants ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-100' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          SÍ
                        </button>
                        <button
                          type="button"
                          onClick={() => { setBringsSoilPlants(false); setPlantDetails(''); }}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            !bringsSoilPlants ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                    {bringsSoilPlants && (
                      <textarea
                        required
                        value={plantDetails}
                        onChange={(e) => setPlantDetails(e.target.value)}
                        placeholder="Describa el pesticida o tipo de tierra/planta introducida."
                        className="w-full text-xs p-2.5 border border-red-200 focus:ring-1 focus:ring-red-500 outline-none rounded bg-white"
                      />
                    )}
                  </div>
                </div>

                {/* 2. SECCIÓN ADUANAS */}
                <div className="border border-amber-200 rounded-xl p-5 bg-amber-50/20 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-900 border-b border-amber-100 pb-1.5">
                    <span className="bg-amber-600 text-white text-[10px] uppercase font-mono px-1.5 py-0.5 rounded">ADUANA</span>
                    Declaración de Mercancías e Instrumentos Monetarios
                  </div>

                  <div className="space-y-4">
                    {/* Valuta cash > 10K */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 theme-question">
                      <div className="max-w-xl">
                        <h4 className="text-xs font-semibold text-slate-800">
                          ¿Ingresa moneda legal, instrumentos financieros o títulos con un valor superior a USD $10.000 o equivalente?
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Si responde SÍ, tiene la obligación legal de declarar el monto exacto, origen lícito y fin de los fondos. Es por motivos anti-lavado de activos.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBringsCashOver10k(true)}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            bringsCashOver10k ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-100' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          SÍ
                        </button>
                        <button
                          type="button"
                          onClick={() => { setBringsCashOver10k(false); setCashAmount(0); }}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            !bringsCashOver10k ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                    {bringsCashOver10k && (
                      <div className="flex gap-3 items-center bg-white p-2 border border-red-200 rounded max-w-sm">
                        <span className="text-xs font-semibold text-slate-600">Importe declarado (USD)</span>
                        <input
                          type="number"
                          required
                          min={10001}
                          value={cashAmount}
                          onChange={(e) => setCashAmount(Number(e.target.value))}
                          placeholder="Monto en USD"
                          className="flex-1 text-xs p-1 border rounded focus:ring-1 focus:ring-red-500 outline-none"
                        />
                      </div>
                    )}

                    {/* Commercial Goods */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 theme-question">
                      <div className="max-w-xl">
                        <h4 className="text-xs font-semibold text-slate-800">
                          ¿Porta mercancías con carácter comercial, mercaderías nuevas o muestras promocionales?
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          No se consideran efectos de equipaje personal común (artículos nuevos de alto valor destinados a distribución o exhibición comercial).
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBringsCommercialGoods(true)}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            bringsCommercialGoods ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-100' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          SÍ
                        </button>
                        <button
                          type="button"
                          onClick={() => { setBringsCommercialGoods(false); setGoodsDetails(''); }}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            !bringsCommercialGoods ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                    {bringsCommercialGoods && (
                      <textarea
                        required
                        value={goodsDetails}
                        onChange={(e) => setGoodsDetails(e.target.value)}
                        placeholder="Describa el tipo de artículos comerciales, empaques, cantidad y valor estimado."
                        className="w-full text-xs p-2.5 border border-red-200 focus:ring-1 focus:ring-red-500 outline-none rounded bg-white"
                      />
                    )}

                    {/* Restricted Goods (e.g. drugs/arms/fines) */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 theme-question">
                      <div className="max-w-xl">
                        <h4 className="text-xs font-semibold text-slate-800">
                          ¿Trae mercancías sujetas a restricciones especiales de importación o armas de fuego?
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Sustancias químicas, medicamentos de control especial, armas, municiones, fuegos artificiales, etc.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBringsRestrictedItems(true)}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            bringsRestrictedItems ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-100' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          SÍ
                        </button>
                        <button
                          type="button"
                          onClick={() => { setBringsRestrictedItems(false); setRestrictedDetails(''); }}
                          className={`px-3 py-1 text-xs border rounded-lg font-semibold transition-all ${
                            !bringsRestrictedItems ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                    {bringsRestrictedItems && (
                      <textarea
                        required
                        value={restrictedDetails}
                        onChange={(e) => setRestrictedDetails(e.target.value)}
                        placeholder="Declare las armas, municiones o elementos químicos bajo restricción fiscal de la DGMN."
                        className="w-full text-xs p-2.5 border border-red-200 focus:ring-1 focus:ring-red-500 outline-none rounded bg-white"
                      />
                    )}
                  </div>
                </div>

                {/* Juridic Consent Legal check */}
                <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200 text-[11px] text-slate-600 space-y-2">
                  <p className="font-bold uppercase text-slate-700">Declaración de fe de veracidad jurídica:</p>
                  <p>
                    Declaro bajo juramento que los antecedentes suministrados en este formulario digital son la fiel expresión de la verdad. Estoy en conocimiento de que el ocultamiento, falseamiento u omisión de información silvoagropecuaria o de mercancías tributables faculta al personal fiscalizador a la confiscación inmediata, remisión y aplicación de sanciones pecuniarias según lo dispuesto por las leyes vigentes de la República de Chile.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: RECEIPT & QR ACCORDION */}
          {step === 5 && registeredDoc && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 flex gap-3 items-center">
                <CheckCircle className="w-10 h-10 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">¡Pase de Registro Generado Satisfactoriamente!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Su código se ha registrado en las bases integradas de PDI y Aduana/SAG. Presente este voucher digital o impreso a las autoridades al llegar a la ventanilla.
                  </p>
                </div>
              </div>

              {/* VOUCHER DESIGN STYLING */}
              <div className="border border-slate-350 rounded-xl bg-white overflow-hidden max-w-lg mx-auto shadow-sm print:border-0 print:shadow-none" id="printable-voucher-card">
                {/* Upper banner mimicking passport/government cover */}
                <div className="bg-slate-950 p-6 text-white text-center relative pointer-events-none">
                  <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-400 font-mono">REPUBLICA DE CHILE</div>
                  <div className="font-display text-lg font-bold mt-1 tracking-tight">CONTROL MIGRATORIO INTEGRADO</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest">PDI • ADUANA • SAG</div>
                  <div className="absolute top-4 right-4 bg-white text-slate-950 font-mono text-[9px] px-2 py-0.5 font-bold rounded">
                    DIGITAL PASS
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* QR Core with scanning mock instructions */}
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <QrCodeSvg value={registeredDoc.id} size={150} />
                    <div>
                      <div className="text-sm font-bold text-slate-800 tracking-wider font-mono">
                        CÓDIGO DE INGRESO: {registeredDoc.id}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Registrado a las {new Date(registeredDoc.createdAt).toLocaleTimeString()} el {new Date(registeredDoc.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Summary of traveler identities */}
                  <div className="border-t border-b border-slate-100 py-4 grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">VIAJERO DE FRONTERA</span>
                      <strong className="text-slate-800 text-sm font-sans block truncate">{registeredDoc.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">DOCUMENTO DE ID</span>
                      <strong className="text-slate-800 block">{registeredDoc.documentNumber} ({registeredDoc.documentType.toUpperCase()})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">PASO FRONTERIZO</span>
                      <strong className="text-slate-800 text-[11px] font-sans block truncate">{registeredDoc.entryPoint.split(' ')[0]}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">PROCEDENCIA / MEDIO</span>
                      <strong className="text-slate-800 block truncate">{registeredDoc.originCity}, {registeredDoc.originCountry} ({registeredDoc.flightNumber})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">ACOMPAÑANTES</span>
                      <strong className="text-slate-800 block">{registeredDoc.companions.length > 0 ? `${registeredDoc.companions.length} miembros cargo` : 'Ninguno'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">PROPÓSITO / DÍAS</span>
                      <strong className="text-slate-800 block">{registeredDoc.travelPurpose} ({registeredDoc.stayDays} días)</strong>
                    </div>
                  </div>

                  {/* Highlights regarding declarations */}
                  <div className="space-y-2 border border-slate-100 rounded-lg p-3 bg-slate-50">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">DECLARACIONES RESPONDIDAS</span>
                    
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center justify-between">
                        <span>Frutas, semillas, carnes frescas (SAG):</span>
                        <strong className={registeredDoc.sagDeclaration.bringsOrganic || registeredDoc.sagDeclaration.bringsLiveAnimals ? 'text-red-600' : 'text-emerald-600'}>
                          {registeredDoc.sagDeclaration.bringsOrganic || registeredDoc.sagDeclaration.bringsLiveAnimals ? 'TIENE ELEMENTOS' : 'NADA QUE DECLARAR'}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Dinero superior $10,000 USD (Aduana):</span>
                        <strong className={registeredDoc.aduanaDeclaration.bringsCashOver10k ? 'text-red-600' : 'text-emerald-600'}>
                          {registeredDoc.aduanaDeclaration.bringsCashOver10k ? `SÍ ($${registeredDoc.aduanaDeclaration.cashAmount.toLocaleString()})` : 'NADA QUE DECLARAR'}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Bienes comerciales o importaciones:</span>
                        <strong className={registeredDoc.aduanaDeclaration.bringsCommercialGoods ? 'text-red-600' : 'text-emerald-600'}>
                          {registeredDoc.aduanaDeclaration.bringsCommercialGoods ? 'TIENE ELEMENTOS' : 'NADA QUE DECLARAR'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Stamp space simulation */}
                  <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50 flex items-center gap-3">
                    <div className="w-10 h-10 border border-dashed border-slate-400 rounded flex items-center justify-center font-bold text-slate-500 text-xs tracking-widest font-mono shrink-0 rotate-12">
                      PASS
                    </div>
                    <div className="text-[10px] text-slate-500">
                      <span className="font-bold block text-slate-800">Uso Exclusivo de Control de Ventanilla</span>
                      El oficial de frontera correspondiente validará este comprobante y autorizará el tránsito definitivo.
                    </div>
                  </div>
                </div>

                {/* Footer instructions */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium leading-relaxed leading-[1.4] pointer-events-none">
                  Este pase electrónico es intransferible y posee validez de 72 horas corridas previas al vuelo. El Servicio de Aduanas y la PDI podrán requerir el equipaje físico complementariamente.
                </div>
              </div>

              {/* Action operations on bottom voucher */}
              <div className="flex justify-center flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Imprimir Pase de Ingreso
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // reset form
                    setStep(1);
                    setFullName('');
                    setDocumentNumber('');
                    setBirthDate('');
                    setScanSuccess(false);
                  }}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  Registar Nueva Declaración
                </button>
              </div>
            </motion.div>
          )}

          {/* Steps navigation footer */}
          {step < 5 && (
            <div className="mt-8 border-t border-slate-100 pt-6 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Anterior
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  Continuar <ArrowRight className="w-4 h-4 text-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Generar Código QR
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
