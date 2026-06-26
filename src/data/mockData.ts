import { TravelerDeclaration, TransitStats } from '../types';

export const initialDeclarations: TravelerDeclaration[] = [
  {
    id: 'CL-48219',
    fullName: 'Amélie Dupont',
    gender: 'Femenino',
    birthDate: '1992-05-14',
    nationality: 'Francia',
    documentType: 'pasaporte',
    documentNumber: 'FR8432298',
    countryOfIssue: 'Francia',
    email: 'amelie.dupont@gmail.com',
    phone: '+33 612 345 678',
    originCountry: 'Francia',
    originCity: 'París',
    flightNumber: 'AF406',
    entryPoint: 'Aeropuerto Arturo Merino Benítez (SCL)',
    travelPurpose: 'Turismo',
    stayDays: 14,
    addressInChile: 'Hotel Singular, Lastarria 298, Santiago',
    companions: [],
    sagDeclaration: {
      bringsOrganic: false,
      organicDetails: '',
      bringsLiveAnimals: false,
      animalDetails: '',
      bringsSoilPlants: false,
      plantDetails: ''
    },
    aduanaDeclaration: {
      bringsCashOver10k: false,
      cashAmount: 0,
      bringsCommercialGoods: false,
      goodsDetails: '',
      bringsRestrictedItems: false,
      restrictedDetails: ''
    },
    passportPhoto: null,
    scannedDocInfo: null,
    statusPDI: 'approved',
    statusAduana: 'cleared',
    pdiComments: 'Verificación biométrica exitosa. Viaje por turismo aprobado.',
    aduanaComments: 'Inspección de equipaje mediante rayos X - Sin novedades de productos orgánicos ni aduaneros.',
    pdiCheckedAt: '2026-06-22T10:15:00-07:00',
    aduanaCheckedAt: '2026-06-22T10:28:00-07:00',
    pdiOfficer: 'Inspector R. Sanhueza (PDI)',
    aduanaOfficer: 'Fiscalizador J. Garmendia (Aduana)',
    createdAt: '2026-06-21T18:30:00-07:00'
  },
  {
    id: 'CL-92041',
    fullName: 'Roberto Carlos Silva',
    gender: 'Masculino',
    birthDate: '1985-11-23',
    nationality: 'Brasil',
    documentType: 'dni',
    documentNumber: '42.983.102-K',
    countryOfIssue: 'Brasil',
    email: 'rcsilva@uol.com.br',
    phone: '+55 11 98822 4111',
    originCountry: 'Brasil',
    originCity: 'São Paulo',
    flightNumber: 'LA802',
    entryPoint: 'Aeropuerto Arturo Merino Benítez (SCL)',
    travelPurpose: 'Negocios',
    stayDays: 5,
    addressInChile: 'San Sebastián 2800, Las Condes, Santiago',
    companions: [],
    sagDeclaration: {
      bringsOrganic: true,
      organicDetails: 'Mercancía agrícola: 2 kg de café en grano crudo artesanal (sin sellado industrial).',
      bringsLiveAnimals: false,
      animalDetails: '',
      bringsSoilPlants: false,
      plantDetails: ''
    },
    aduanaDeclaration: {
      bringsCashOver10k: false,
      cashAmount: 0,
      bringsCommercialGoods: true,
      goodsDetails: 'Muestrario de calzado deportivo de cuero (fines promocionales no para venta directa).',
      bringsRestrictedItems: false,
      restrictedDetails: ''
    },
    passportPhoto: null,
    scannedDocInfo: null,
    statusPDI: 'approved',
    statusAduana: 'pending',
    pdiComments: 'Ingreso autorizado bajo acuerdo de residencia Mercosur temporal vigente.',
    aduanaComments: '',
    pdiCheckedAt: '2026-06-22T11:40:00-07:00',
    createdAt: '2026-06-22T08:12:00-07:00'
  },
  {
    id: 'CL-11498',
    fullName: 'Hans Müller',
    gender: 'Masculino',
    birthDate: '1970-02-09',
    nationality: 'Alemania',
    documentType: 'pasaporte',
    documentNumber: 'DE55431109',
    countryOfIssue: 'Alemania',
    email: 'hans.m@muller-tech.de',
    phone: '+49 89 229103',
    originCountry: 'Alemania',
    originCity: 'Fráncfort',
    flightNumber: 'LH501',
    entryPoint: 'Aeropuerto Arturo Merino Benítez (SCL)',
    travelPurpose: 'Estudios',
    stayDays: 180,
    addressInChile: 'Av. Providencia 1920, Depto 62, Santiago',
    companions: [
      { id: 'C1', fullName: 'Greta Müller', documentNumber: 'DE55431110', relationship: 'Cónyuge o Pareja', age: 48 },
      { id: 'C2', fullName: 'Lukas Müller', documentNumber: 'DE55431111', relationship: 'Hijo/a', age: 14 }
    ],
    sagDeclaration: {
      bringsOrganic: false,
      organicDetails: '',
      bringsLiveAnimals: true,
      animalDetails: 'Canino de compañía (Golden Retriever), con certificado zoosanitario europeo e implantación de microchip.',
      bringsSoilPlants: false,
      plantDetails: ''
    },
    aduanaDeclaration: {
      bringsCashOver10k: true,
      cashAmount: 12500,
      bringsCommercialGoods: false,
      goodsDetails: '',
      bringsRestrictedItems: false,
      restrictedDetails: ''
    },
    passportPhoto: null,
    scannedDocInfo: null,
    statusPDI: 'pending',
    statusAduana: 'pending',
    createdAt: '2026-06-22T09:45:00-07:00'
  },
  {
    id: 'CL-39082',
    fullName: 'María Alejandra González',
    gender: 'Femenino',
    birthDate: '1988-08-30',
    nationality: 'Argentina',
    documentType: 'dni',
    documentNumber: 'AR32840192',
    countryOfIssue: 'Argentina',
    email: 'maria.gonzalez@hotmail.com',
    phone: '+54 11 4831 9284',
    originCountry: 'Argentina',
    originCity: 'Mendoza',
    flightNumber: 'Vehículo Particular (Land)',
    entryPoint: 'Paso Los Libertadores (Valparaíso)',
    travelPurpose: 'Turismo',
    stayDays: 7,
    addressInChile: 'Condominio Marina Sol, Av. del Mar 4500, La Serena',
    companions: [
      { id: 'C3', fullName: 'Facundo Rossi', documentNumber: 'AR35920194', relationship: 'Cónyuge o Pareja', age: 39 }
    ],
    sagDeclaration: {
      bringsOrganic: true,
      organicDetails: 'Manzanas frescas y uvas cultivadas (3 kg en bolso térmico).',
      bringsLiveAnimals: false,
      animalDetails: '',
      bringsSoilPlants: true,
      plantDetails: 'Planta de jardín viva (esquejes de rosas para obsequiar).'
    },
    aduanaDeclaration: {
      bringsCashOver10k: false,
      cashAmount: 0,
      bringsCommercialGoods: false,
      goodsDetails: '',
      bringsRestrictedItems: false,
      restrictedDetails: ''
    },
    passportPhoto: null,
    scannedDocInfo: null,
    statusPDI: 'warning',
    statusAduana: 'secondary',
    pdiComments: 'Alerta migratoria menor: Ingreso anterior excedió visa de turista por 2 días en 2024. Se le realiza amonestación verbal y se autoriza por esta estadía exacta de 7 días.',
    aduanaComments: 'Inspección física realizada: Se detectan frutas no declaradas comercialmente. Se realiza confiscación y destrucción reglamentaria de manzanas y esquejes por riesgo fitosanitario. Se aplica amonestación preventiva sin multa económica por autodeclaración voluntaria.',
    pdiCheckedAt: '2026-06-22T08:30:00-07:00',
    aduanaCheckedAt: '2026-06-22T08:52:00-07:00',
    pdiOfficer: 'Inspector S. Pardo (PDI)',
    aduanaOfficer: 'Fiscalizador M. Olea (SAG/Aduana)',
    createdAt: '2026-06-22T06:20:00-07:00'
  },
  {
    id: 'CL-77510',
    fullName: 'Steve Miller',
    gender: 'Masculino',
    birthDate: '1979-06-03',
    nationality: 'Estados Unidos',
    documentType: 'pasaporte',
    documentNumber: 'US55431802',
    countryOfIssue: 'Estados Unidos',
    email: 'smiller@aim.com',
    phone: '+1 415 555 9823',
    originCountry: 'Estados Unidos',
    originCity: 'Los Ángeles',
    flightNumber: 'AA957',
    entryPoint: 'Aeropuerto Arturo Merino Benítez (SCL)',
    travelPurpose: 'Trabajo',
    stayDays: 90,
    addressInChile: 'Ahumada 312, Oficina 804, Santiago Centro',
    companions: [],
    sagDeclaration: {
      bringsOrganic: false,
      organicDetails: '',
      bringsLiveAnimals: false,
      animalDetails: '',
      bringsSoilPlants: false,
      plantDetails: ''
    },
    aduanaDeclaration: {
      bringsCashOver10k: false,
      cashAmount: 0,
      bringsCommercialGoods: false,
      goodsDetails: '',
      bringsRestrictedItems: false,
      restrictedDetails: ''
    },
    passportPhoto: null,
    scannedDocInfo: null,
    statusPDI: 'pending',
    statusAduana: 'pending',
    createdAt: '2026-06-22T10:50:00-07:00'
  },
  {
    id: 'CL-23891',
    fullName: 'Laura Viviana Ortega',
    gender: 'Femenino',
    birthDate: '1995-12-04',
    nationality: 'Colombia',
    documentType: 'pasaporte',
    documentNumber: 'CO11048293',
    countryOfIssue: 'Colombia',
    email: 'laura.ortega@gmail.com',
    phone: '+57 301 293 8411',
    originCountry: 'Colombia',
    originCity: 'Bogotá',
    flightNumber: 'AV097',
    entryPoint: 'Aeropuerto Arturo Merino Benítez (SCL)',
    travelPurpose: 'Negocios',
    stayDays: 15,
    addressInChile: 'Av. El Bosque Norte 0120, Las Condes',
    companions: [],
    sagDeclaration: {
      bringsOrganic: false,
      organicDetails: '',
      bringsLiveAnimals: false,
      animalDetails: '',
      bringsSoilPlants: false,
      plantDetails: ''
    },
    aduanaDeclaration: {
      bringsCashOver10k: true,
      cashAmount: 18000,
      bringsCommercialGoods: false,
      goodsDetails: '',
      bringsRestrictedItems: false,
      restrictedDetails: ''
    },
    passportPhoto: null,
    scannedDocInfo: null,
    statusPDI: 'pending',
    statusAduana: 'pending',
    createdAt: '2026-06-22T11:15:00-07:00'
  }
];

export const mockStats = (declarations: TravelerDeclaration[]): TransitStats => {
  const total = declarations.length;
  const approved = declarations.filter(d => d.statusPDI === 'approved').length;
  const rejected = declarations.filter(d => d.statusPDI === 'rejected').length;
  const warning = declarations.filter(d => d.statusPDI === 'warning').length;
  const aduanaClear = declarations.filter(d => d.statusAduana === 'cleared').length;
  const aduanaSec = declarations.filter(d => d.statusAduana === 'secondary').length;
  const aduanaFine = declarations.filter(d => d.statusAduana === 'fined').length;

  return {
    totalProcessed: total,
    approvedEntry: approved,
    rejectedEntry: rejected,
    warningAlerts: warning,
    customsCleared: aduanaClear,
    customsSecondary: aduanaSec,
    customsFined: aduanaFine,
    averageSpeedSeconds: 145 // 2 minutes 25 seconds average process in windows
  };
};

export const CHILEAN_BORDER_CROSSINGS = [
  'Aeropuerto Arturo Merino Benítez (SCL)',
  'Paso Los Libertadores (Valparaíso - Valmando)',
  'Paso Chacalluta (Arica - Tacna)',
  'Paso Mamuil Malal (La Araucanía)',
  'Paso Cardenal Samoré (Los Lagos)',
  'Paso Dorotea (Magallanes)'
];

export const NATIONALITIES = [
  'Argentina',
  'Brasil',
  'Bolivia',
  'Colombia',
  'Ecuador',
  'Perú',
  'Paraguay',
  'Uruguay',
  'Venezuela',
  'Estados Unidos',
  'Canadá',
  'España',
  'Francia',
  'Alemania',
  'Reino Unido',
  'Italia',
  'China',
  'Japón',
  'Australia',
  'Chile'
];
