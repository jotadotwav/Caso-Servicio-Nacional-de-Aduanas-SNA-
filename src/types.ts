export interface Companion {
  id: string;
  fullName: string;
  documentNumber: string;
  relationship: string;
  age: number;
  notarialFile?: string;
  notarialFileStatus?: 'pending' | 'loaded';
}

export interface SagDeclaration {
  bringsOrganic: boolean;
  organicDetails: string;
  bringsLiveAnimals: boolean;
  animalDetails: string;
  bringsSoilPlants: boolean;
  plantDetails: string;
}

export interface AduanaDeclaration {
  bringsCashOver10k: boolean;
  cashAmount: number;
  bringsCommercialGoods: boolean;
  goodsDetails: string;
  bringsRestrictedItems: boolean;
  restrictedDetails: string;
}

export type PdiStatus = 'pending' | 'approved' | 'rejected' | 'warning';
export type AduanaStatus = 'pending' | 'cleared' | 'secondary' | 'fined';

export interface TravelerDeclaration {
  id: string; // Formatted like CL-XXXXX
  fullName: string;
  gender: string;
  birthDate: string;
  nationality: string;
  documentType: 'pasaporte' | 'dni' | 'cedula';
  documentNumber: string;
  countryOfIssue: string;
  email: string;
  phone: string;
  
  // Trip info
  originCountry: string;
  originCity: string;
  flightNumber: string;
  entryPoint: string;
  travelPurpose: string;
  stayDays: number;
  addressInChile: string;
  
  // Companions
  companions: Companion[];
  
  // Declarations
  sagDeclaration: SagDeclaration;
  aduanaDeclaration: AduanaDeclaration;
  
  // Document scan simulation records
  passportPhoto: string | null;
  scannedDocInfo: {
    fullName?: string;
    documentNumber?: string;
    birthDate?: string;
    nationality?: string;
    parsedSuccessfully?: boolean;
  } | null;
  
  // Official processing
  statusPDI: PdiStatus;
  statusAduana: AduanaStatus;
  pdiComments?: string;
  aduanaComments?: string;
  pdiCheckedAt?: string;
  aduanaCheckedAt?: string;
  pdiOfficer?: string;
  aduanaOfficer?: string;
  
  createdAt: string;
}

export interface TransitStats {
  totalProcessed: number;
  approvedEntry: number;
  rejectedEntry: number;
  warningAlerts: number;
  customsCleared: number;
  customsSecondary: number;
  customsFined: number;
  averageSpeedSeconds: number;
}
