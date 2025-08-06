import React, { useState, useEffect } from "react";
import { LeadDashboard } from "@/components/LeadDashboard";
import { Lead } from "@/types/lead";

const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Load leads from localStorage or create example leads
    const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    
    if (savedLeads.length === 0) {
      // Create example leads
      const exampleLeads: Lead[] = [
        {
          id: "lead-001",
          serviceType: "Badrumsrenovering",
          scope: "Helrenovering",
          location: "Stockholm",
          timeframe: "Inom 2 veckor",
          notes: "Komplett badrumsrenovering med nya vitvaror och kakel",
          attachments: [],
          estimatedCost: 150000,
          score: 85,
          margin: 20,
          finalPrice: 180000,
          createdAt: new Date("2024-01-15"),
          status: "new",
          customerName: "Sara Andersson",
          customerContact: "sara.andersson@email.com",
          customerAddress: "Köpmansgatan 4, 111 31 Stockholm",
          detailedDescription: "Sara vill göra en total renovering av sitt 8 kvm badrum. Projektet omfattar rivning av befintligt kakel, installation av golvvärme, nya VVS-system, elinstallationer och kakel på golv och väggar.",
          projectType: "Badrum",
          renovationType: "Renovering",
          technicalRequirements: {
            electrical: "Ny belysning, uttag och säkerhetsbrytare krävs",
            plumbing: "Flytta VVS för dusch och handfat, nytt avlopp",
            heating: "Installation av golvvärme i hela badrummet",
            demolition: "Rivning av kakel, golv och vissa väggar",
            structuralWork: "Mindre bärande ingrepp för nya ledningar",
            permits: "Bygglov ej krävs för detta projekt",
            groundwork: "Ej aktuellt",
            otherTechnical: "Ventilation behöver förbättras"
          },
          materials: {
            responsibility: "Vi står för material och arbetskraft",
            preferences: "Högkvalitativa material, skandinavisk stil",
            style: "Modern skandinavisk med naturmaterial",
            inspirationImages: "Bifogade bilder från Pinterest-board",
            extras: "Handdukstork, inbyggd förvaring, spegelskåp",
            specialRequests: "Miljövänliga material önskas"
          },
          planning: {
            drawingsIncluded: "Ja, ritningar av nuvarande layout bifogade",
            desiredStart: "September 2024",
            deadline: "Innan julhelgen 2024"
          }
        },
        {
          id: "lead-002",
          serviceType: "Köksrenovering", 
          scope: "Komplett renovering",
          location: "Göteborg",
          timeframe: "Inom 1 månad",
          notes: "Stort kök med öppning mot vardagsrum, nya vitvaror",
          attachments: [],
          estimatedCost: 200000,
          score: 65,
          margin: 25,
          finalPrice: 250000,
          createdAt: new Date("2024-01-12"),
          status: "contacted",
          customerName: "Erik Johansson",
          customerContact: "erik.j@gmail.com",
          customerAddress: "Vasagatan 12, 411 24 Göteborg",
          detailedDescription: "Erik äger ett 15 kvm kök som behöver totalrenoveras. Vill öppna upp mot vardagsrummet och skapa ett modernt kök med köksö och nya vitvaror.",
          projectType: "Kök",
          renovationType: "Renovering",
          technicalRequirements: {
            electrical: "Ny elinstallation för induktionshäll och vitvaror",
            plumbing: "Ny diskmaskin och kylskåp med vattenanslutning",
            heating: "Befintlig radiator ska flyttas",
            demolition: "Rivning av vägg mellan kök och vardagsrum", 
            structuralWork: "Bärande vägg - konstruktör konsulteras",
            permits: "Bygglov krävs för väggrivning",
            groundwork: "Ej aktuellt",
            otherTechnical: "Ventilation för spisfläkt, ny belysning"
          },
          materials: {
            responsibility: "Kunden köper vitvaror, vi står för resten",
            preferences: "Vit kökslucka, marmorbänkskiva, mässingsdetaljer",
            style: "Klassisk med moderna inslag",
            inspirationImages: "Bilder från Ballingslöv och IKEA",
            extras: "Köksö, vinförvaring, belysning under skåp",
            specialRequests: "Tyst diskmaskin och energieffektiva vitvaror"
          },
          planning: {
            drawingsIncluded: "Skisser på önskad layout finns",
            desiredStart: "Oktober 2024", 
            deadline: "Januari 2025"
          }
        },
        {
          id: "lead-003",
          serviceType: "Målning & tapetsering",
          scope: "Vardagsrum och sovrum",
          location: "Malmö",
          timeframe: "Inom 1 vecka",
          notes: "Snabbt jobb, måla om två rum",
          attachments: [],
          estimatedCost: 25000,
          score: 90,
          margin: 40,
          finalPrice: 35000,
          createdAt: new Date("2024-01-18"),
          status: "new",
          customerName: "Anna Nilsson",
          customerContact: "070-123-4567",
          customerAddress: "Storgatan 8, 211 34 Malmö",
          detailedDescription: "Anna ska sälja sin lägenhet och behöver snabbt måla om vardagsrum och sovrum för att öka försäljningsvärdet.",
          projectType: "Målning",
          renovationType: "Renovering",
          technicalRequirements: {
            electrical: "Ej aktuellt",
            plumbing: "Ej aktuellt", 
            heating: "Ej aktuellt",
            demolition: "Ev. borttagning av gammal tapet",
            structuralWork: "Ej aktuellt",
            permits: "Ej krävs",
            groundwork: "Ej aktuellt",
            otherTechnical: "Möbelskydd och grundlig städning"
          },
          materials: {
            responsibility: "Vi tillhandahåller all färg och material",
            preferences: "Ljusa, neutrala färger för försäljning",
            style: "Klassiskt vitt/off-white för bred appeal",
            inspirationImages: "Inga specifika bilder",
            extras: "Grundlig spackling och slipning",
            specialRequests: "Snabb tork, låg lukt pga snabb flyttning"
          },
          planning: {
            drawingsIncluded: "Nej, enkelt projekt",
            desiredStart: "Nästa vecka",
            deadline: "Inom 10 dagar senast"
          }
        },
        {
          id: "lead-004", 
          serviceType: "Helrenovering",
          scope: "Komplett lägenhet",
          location: "Uppsala",
          timeframe: "Flexibel/Inget stressade",
          notes: "Total renovering av 3:a, inget stressat",
          attachments: [],
          estimatedCost: 350000,
          score: 40,
          margin: 28,
          finalPrice: 450000,
          createdAt: new Date("2024-01-10"),
          status: "quoted",
          customerName: "Michael Berg",
          customerContact: "m.berg@company.se", 
          customerAddress: "Parkvägen 15, 752 37 Uppsala",
          detailedDescription: "Michael äger en 75 kvm lägenhet från 1960-talet som behöver totalrenoveras. Allt ska bytas ut - golv, väggar, tak, kök, badrum, el och VVS.",
          projectType: "Helrenovering",
          renovationType: "Renovering",
          technicalRequirements: {
            electrical: "Helt ny elinstallation, nya uttag överallt",
            plumbing: "Nya vatten- och avloppsledningar i hela lägenheten",
            heating: "Nytt värmesystem och radiatorer",
            demolition: "Total rivning av kök och badrum, vissa innerväggar",
            structuralWork: "Kontroll av bärande väggar och balkar",
            permits: "Bygglov för stora förändringar",
            groundwork: "Ej aktuellt (lägenhet)",
            otherTechnical: "Ny ventilation, internet och TV-uttag"
          },
          materials: {
            responsibility: "Diskussion pågår om ansvarsfördelning",
            preferences: "Högkvalitativa, tidlösa material",
            style: "Modern skandinavisk med kvalitetskänsla",
            inspirationImages: "Flera Pinterest-boards med inspiration",
            extras: "Smart home-lösningar, inbyggd belysning",
            specialRequests: "Miljötänk och energieffektiva lösningar"
          },
          planning: {
            drawingsIncluded: "Ursprungliga ritningar finns, nya ska tas fram",
            desiredStart: "Vinter/vår 2025",
            deadline: "Inga hårda deadlines"
          }
        },
        {
          id: "lead-005",
          serviceType: "VVS-arbeten", 
          scope: "Nytt badrum",
          location: "Västerås",
          timeframe: "Inom 3 månader",
          notes: "VVS för nytt badrum i källare",
          attachments: [],
          estimatedCost: 75000,
          score: 70,
          margin: 26,
          finalPrice: 95000,
          createdAt: new Date("2024-01-14"),
          status: "contacted",
          customerName: "Lena Gustafsson",
          customerContact: "lena.g@hotmail.com",
          customerAddress: "Björkvägen 22, 722 13 Västerås",
          detailedDescription: "Lena vill installera ett nytt badrum i sin villas källare. Behöver dra nya vatten- och avloppsledningar samt installera pump för avlopp.",
          projectType: "VVS-arbeten",
          renovationType: "Nybyggnation",
          technicalRequirements: {
            electrical: "Uttag för belysning och ventilation",
            plumbing: "Nya ledningar från källare till huvudledning, avloppspump",
            heating: "Anslutning till befintligt värmesystem",
            demolition: "Öppning i betongbotten för avlopp",
            structuralWork: "Håltagning i betongbjälklag",
            permits: "Kontakt med kommun för avloppstillstånd",
            groundwork: "Schaktning utanför hus för nya ledningar",
            otherTechnical: "Ventilation och fuktspärr i källare"
          },
          materials: {
            responsibility: "Vi tillhandahåller alla VVS-komponenter",
            preferences: "Kvalitetskomponenter med lång livslängd",
            style: "Funktionellt och praktiskt",
            inspirationImages: "Inga specifika önskemål",
            extras: "Golvvärme i badrummet, extra uttag",
            specialRequests: "Ljuddämpning av avloppspump"
          },
          planning: {
            drawingsIncluded: "Skiss över källarplan finns",
            desiredStart: "Mars-april 2024",
            deadline: "Sommaren 2024"
          }
        }
      ];
      
      setLeads(exampleLeads);
      localStorage.setItem('leads', JSON.stringify(exampleLeads));
    } else {
      setLeads(savedLeads);
    }
  }, []);

  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, ...updates } : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Lead Dashboard
            </h1>
            <p className="text-muted-foreground">
              Hantera och följ upp dina inkommande förfrågningar
            </p>
          </div>
        </div>
        
        <LeadDashboard 
          leads={leads} 
          onUpdateLead={handleUpdateLead}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;