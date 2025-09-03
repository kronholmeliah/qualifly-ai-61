import { Lead, StructuredProject } from "@/types/lead";

// Centraliserad lead-data som används av alla komponenter
export const EXAMPLE_LEADS: Lead[] = [
  {
    id: 'lead-mats',
    serviceType: 'Badrumsrenovering',
    scope: 'Totalrenovering av badrum (9 m²)',
    location: 'Lerum',
    timeframe: 'Inom 3 månader',
    notes: 'Kunden vill ha en modern lösning med goda förvaringsmöjligheter. Viktigt med bra ventilation.',
    attachments: [],
    estimatedCost: 180000,
    score: 85,
    margin: 25,
    finalPrice: 225000,
    createdAt: new Date('2024-01-15'),
    status: 'new',
    customerName: 'Mats Nilsson',
    customerContact: '+46 70 123 45 67',
    customerAddress: 'Storgatan 12, 443 30 Lerum',
    detailedDescription: 'Mats Nilsson har skickat in en förfrågan om totalrenovering av sitt cirka 9 m² stora badrum i Lerum. Han vill ta bort badkaret och ersätta det med duschväggar samt en ny kommod. Toaletten behålls på samma plats, men handfatet ska flyttas närmare dörren. Ventilationen ska förbättras genom installation av en ny fläkt. Han önskar elgolvvärme i golvet och byte av den gamla golvbrunnen.',
    projectType: 'Badrumsrenovering',
    renovationType: 'Totalrenovering',
    structuredProject: {
      projectCategory: 'Badrumsrenovering',
      scope: {
        size: '9 m² badrum i villa',
        demolition: 'Rivning av befintligt badkar och kakel',
        newConstruction: 'Installation av duschvägg och ny kommod'
      },
      technicalRequirements: {
        construction: {
          walls: 'Nya klinkerplattor på vägg',
          floors: 'Nytt klinkergolv med golvvärme',
          ceiling: 'Målning efter ventilationsinstallation',
          structural: 'Inga bärande väggar påverkas',
          surfacing: 'Kakel och klinker enligt kundens val'
        },
        plumbing: {
          waterSupply: 'Omdragning av vatten för nytt handfat närmare dörren',
          drains: 'Byte av befintlig golvbrunn',
          heating: 'Installation av elgolvvärme'
        },
        electrical: {
          outlets: 'Nya uttag vid spegeln',
          floorHeating: 'Elgolvvärme med separat termostat',
          lighting: 'LED-belysning vid spegel och i tak'
        },
        ventilation: {
          fans: 'Installation av ny våtrumsfläkt',
          ducts: 'Anslutning till befintlig ventilation',
          airflow: 'Förbättrad luftcirkulation'
        }
      },
      timeline: {
        startTime: 'Våren 2024',
        deadline: 'Inom 3 månader från projektstart',
        restrictions: 'Helst inga arbeten under semesterperioder'
      },
      cost: {
        budgetRange: '150 000 - 200 000 kr',
        financing: 'Eget kapital'
      },
      riskAssessment: {
        moisture: 'Inga kända fuktproblem',
        mold: 'Inga tecken på mögel',
        asbestos: 'Huset byggt 1985, låg risk för asbest',
        radon: 'Normalvärden enligt senaste mätning'
      },
      executiveSummary: 'Kunden önskar en totalrenovering av ett badrum på cirka 9 m² i sin villa. Projektet omfattar rivning av befintligt badkar och installation av duschvägg, byte av golvbrunn samt omdragning av vatten för nytt handfat närmare dörren. Elgolvvärme och nya uttag vid spegeln ska installeras, tillsammans med ny våtrumsfläkt för bättre ventilation. Inga kända fuktproblem finns i dagsläget. Kunden vill gärna påbörja arbetet under våren och budgeten ligger runt 180 000 kr.'
    },
    technicalRequirements: {
      electrical: 'Nya uttag vid spegeln, elgolvvärme med termostat',
      plumbing: 'Omdragning av vatten för handfat, byte av golvbrunn',
      heating: 'Elgolvvärme i hela badrummet',
      demolition: 'Rivning av badkar och befintligt kakel',
      structuralWork: 'Inga bärande konstruktioner påverkas'
    }
  },
  {
    id: 'lead-anna',
    serviceType: 'Köksrenovering',
    scope: 'Nytt kök med köksö (25 m²)',
    location: 'Göteborg',
    timeframe: 'Inom 2 veckor',
    notes: 'Kunden har redan beställt köksluckor och vill ha hjälp med installation.',
    attachments: [],
    estimatedCost: 350000,
    score: 92,
    margin: 22,
    finalPrice: 427000,
    createdAt: new Date('2024-01-10'),
    status: 'contacted',
    customerName: 'Anna Petersson',
    customerContact: '+46 73 987 65 43',
    customerAddress: 'Vasagatan 8, 411 24 Göteborg',
    detailedDescription: 'Anna vill renovera sitt kök och skapa en modern miljö med köksö för mer arbetsyta.',
    projectType: 'Köksrenovering',
    renovationType: 'Totalrenovering',
    structuredProject: {
      projectCategory: 'Köksrenovering',
      scope: {
        size: '25 m² öppet kök med matplats',
        demolition: 'Rivning av befintligt kök och skafferi',
        newConstruction: 'Installation av köksö och ny köksinredning'
      },
      technicalRequirements: {
        construction: {
          walls: 'Flytta en icke-bärande vägg för öppnare layout',
          floors: 'Nytt laminatgolv med golvvärme',
          ceiling: 'Spotlights och takfläkt över köksö'
        },
        plumbing: {
          waterSupply: 'Nya vattenledningar till köksö',
          drains: 'Avlopp för diskmaskin och diskho'
        },
        electrical: {
          outlets: 'Eluttag på köksö och nya uttag längs bänkskiva',
          lighting: 'Under- och överskåpsbelysning plus spotlights'
        }
      },
      timeline: {
        startTime: 'Inom 2 veckor',
        deadline: '6 veckor totalt',
        restrictions: 'Kunden vill ha kök klart innan påsk'
      },
      cost: {
        budgetRange: '300 000 - 400 000 kr',
        financing: 'Banklån'
      },
      riskAssessment: {
        moisture: 'Inga problem',
        asbestos: 'Hus från 1960-talet, kontroll av lim kan behövas'
      },
      executiveSummary: 'Anna Petersson vill totalrenovera sitt 25 m² stora kök i Göteborg och skapa en modern miljö med köksö. Projektet omfattar rivning av befintligt kök, flytt av icke-bärande vägg, samt installation av ny köksinredning med köksö. Nya vatten- och elinstallationer krävs, samt golvvärme under nytt laminatgolv. Budget på 350 000 kr och önskan om snabb start inom 2 veckor.'
    }
  },
  {
    id: 'lead-erik',
    serviceType: 'Takbyte',
    scope: 'Nytt tak på villa (150 m²)',
    location: 'Borås',
    timeframe: 'Inom 1 månad',
    notes: 'Akut - läckage upptäckt. Kunden behöver snabb åtgärd.',
    attachments: [],
    estimatedCost: 280000,
    score: 78,
    margin: 20,
    finalPrice: 336000,
    createdAt: new Date('2024-01-08'),
    status: 'quoted',
    customerName: 'Erik Johansson',
    customerContact: '+46 76 543 21 09',
    customerAddress: 'Skogsvägen 15, 504 68 Borås',
    detailedDescription: 'Erik behöver akut takbyte på grund av läckage. Hela taket behöver bytas ut.',
    projectType: 'Takarbeten',
    renovationType: 'Takbyte',
    structuredProject: {
      projectCategory: 'Takbyte',
      scope: {
        size: '150 m² villatak',
        demolition: 'Rivning av befintlig takbeläggning och skadad takstol',
        newConstruction: 'Nytt takstol där behövs, ny underlagspapp och takpannor'
      },
      technicalRequirements: {
        building: {
          roof: 'Komplett takbyte med nya takpannor',
          facade: 'Nya takfot och stuprör',
          windows: 'Kontroll av takfönster, eventuell justering'
        },
        construction: {
          structural: 'Förstärkning av takstol vid skadade partier'
        }
      },
      timeline: {
        startTime: 'Akut - inom 1 vecka',
        deadline: '3 veckor från start',
        restrictions: 'Väder beroende, plastning vid regn'
      },
      cost: {
        budgetRange: '250 000 - 320 000 kr',
        financing: 'Försäkringsärende pågår'
      },
      riskAssessment: {
        moisture: 'Aktiv läckage i nordöstra hörnet',
        mold: 'Risk för mögel, kontroll av vindsutrymme'
      },
      executiveSummary: 'Erik Johansson behöver akut takbyte på sin villa i Borås på grund av upptäckt läckage. Projektet omfattar komplett rivning av befintlig takbeläggning på 150 m², förstärkning av skadad takstol, samt installation av ny underlagspapp och takpannor. Även nya takfot och stuprör ingår. Arbetet är akut och måste påbörjas inom en vecka. Budget på 280 000 kr, försäkringsärende pågår.'
    }
  }
];

// Funktion för att hämta centraliserade leads
export const getCentralizedLeads = (): Lead[] => {
  return EXAMPLE_LEADS.map(lead => ({
    ...lead,
    createdAt: typeof lead.createdAt === 'string' ? new Date(lead.createdAt) : lead.createdAt
  }));
};

// Funktion för att återställa leads till exempel-data
export const resetToExampleData = (): void => {
  localStorage.setItem('leads', JSON.stringify(EXAMPLE_LEADS));
  localStorage.setItem('detailedLeads', JSON.stringify(EXAMPLE_LEADS));
};

// Funktion för att ladda leads med fallback till exempel-data
export const loadLeads = (): Lead[] => {
  try {
    const saved = localStorage.getItem('leads');
    if (!saved) {
      resetToExampleData();
      return getCentralizedLeads();
    }
    
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      resetToExampleData();
      return getCentralizedLeads();
    }
    
    return parsed.map((lead: any) => ({
      ...lead,
      createdAt: new Date(lead.createdAt)
    }));
  } catch (error) {
    console.error('Error loading leads:', error);
    resetToExampleData();
    return getCentralizedLeads();
  }
};