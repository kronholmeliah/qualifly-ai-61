// 🏗️ Strukturerad lead-sammanställning interface
export interface StructuredProject {
  // 1. Projekttyp
  projectCategory: string; // Badrumsrenovering, köksrenovering, takbyte, altan, tillbyggnad osv.
  
  // 2. Omfattning
  scope: {
    size?: string; // Storlek (m², antal rum, våningar)
    demolition?: string; // Rivning/demolering
    newConstruction?: string; // Nybyggnation/tillägg
  };
  
  // 3. Tekniska krav
  technicalRequirements: {
    // Bygg & stomme
    construction?: {
      walls?: string; // Väggar
      floors?: string; // Golv
      ceiling?: string; // Tak
      structural?: string; // Bärande delar
      surfacing?: string; // Ytskikt
    };
    // VVS
    plumbing?: {
      waterSupply?: string; // Vatten/avlopp
      drains?: string; // Golvbrunn
      heating?: string; // Värme/golvvärme
    };
    // El & styr
    electrical?: {
      outlets?: string; // Nya uttag
      panel?: string; // Elcentral
      lighting?: string; // Belysning
      floorHeating?: string; // Elgolvvärme
    };
    // Ventilation & inomhusklimat
    ventilation?: {
      fans?: string; // Fläktar
      ducts?: string; // Kanaler
      airflow?: string; // Till-/frånluft
    };
    // Klimatskal / Mark
    building?: {
      roof?: string; // Tak
      facade?: string; // Fasad
      windows?: string; // Fönster
      drainage?: string; // Dränering
      foundation?: string; // Grund
      access?: string; // Åtkomst/logistik
    };
  };
  
  // 4. Tidsram
  timeline: {
    startTime?: string; // Starttid
    deadline?: string; // Deadline
    restrictions?: string; // Eventuella restriktioner (semester, säsong, bullerregler)
  };
  
  // 5. Kostnad
  cost: {
    budgetRange?: string; // Budgetintervall
    financing?: string; // Finansiering (lån, eget kapital)
  };
  
  // 6. Status & risk
  riskAssessment: {
    moisture?: string; // Fukt
    mold?: string; // Mögel
    asbestos?: string; // Asbest
    radon?: string; // Radon
    heritage?: string; // Kulturklassning
    other?: string; // Övriga risker
  };
  
  // 7. Sammanfattning i löpande text
  executiveSummary: string;
}

export interface Lead {
  id: string;
  serviceType: string;
  scope: string;
  location: string;
  timeframe: string;
  notes: string;
  attachments: File[];
  estimatedCost: number;
  score: number;
  margin: number;
  finalPrice: number;
  createdAt: Date;
  status: "new" | "contacted" | "quoted" | "closed";
  // Enhanced customer details
  customerName?: string;
  customerContact?: string;
  customerAddress?: string;
  detailedDescription?: string;
  projectType?: string;
  renovationType?: string;
  // NEW: Strukturerad projektdata
  structuredProject?: StructuredProject;
  // AI Summary and Chat data
  aiSummary?: string;
  structuredSummary?: {
    customer?: string;
    project?: string;
    building?: string;
    hvac?: string;
    electrical?: string;
    ventilation?: string;
  };
  chatHistory?: Array<{
    id: string;
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
  }>;
  hasCompletedChat?: boolean;
  technicalRequirements?: {
    electrical?: string;
    plumbing?: string;
    heating?: string;
    demolition?: string;
    structuralWork?: string;
    permits?: string;
    groundwork?: string;
    otherTechnical?: string;
  };
  materials?: {
    responsibility?: string;
    preferences?: string;
    style?: string;
    inspirationImages?: string;
    extras?: string;
    specialRequests?: string;
  };
  planning?: {
    drawingsIncluded?: string;
    desiredStart?: string;
    deadline?: string;
  };
}

export interface LeadScoreFactors {
  economicPotential: number; // 40%
  complexity: number; // 25%
  timeframe: number; // 20%
  seriousness: number; // 15%
}

export const SCORE_WEIGHTS = {
  economicPotential: 0.4,
  complexity: 0.25,
  timeframe: 0.2,
  seriousness: 0.15
};

export const TIMEFRAME_SCORES: Record<string, number> = {
  "Inom 1 vecka": 100,
  "Inom 2 veckor": 85,
  "Inom 1 månad": 70,
  "Inom 3 månader": 40,
  "Flexibel/Inget stressade": 10
};

export const COMPLEXITY_SCORES: Record<string, number> = {
  "Målning & tapetsering": 90,
  "Golvläggning": 80,
  "Elektriker": 70,
  "VVS-arbeten": 65,
  "Badrumsrenovering": 50,
  "Köksrenovering": 40,
  "Helrenovering": 20,
  "Annat": 60
};