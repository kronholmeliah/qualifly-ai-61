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