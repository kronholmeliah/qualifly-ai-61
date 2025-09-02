import React, { useState, useEffect } from "react";
import { LeadDashboard } from "@/components/LeadDashboard";
import { Lead } from "@/types/lead";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Load leads from localStorage or create example leads
    const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    console.log('AdminDashboard: Loaded leads from localStorage:', savedLeads.length, 'leads');
    console.log('AdminDashboard: Lead IDs found:', savedLeads.map((l: any) => l.id));
    
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
          detailedDescription: "Befintligt badrum från 1975, ca 6 m², med ursprungliga installationer. Omfattar: byte av alla sanitetsartiklar (toalett, handfat, duschkabin), rivning av befintligt kakel på väggar och golv, ny membranbeläggning, installation av golvvärme, takåtgärd för fuktskydd, ny belysning och ventilation. Vattenledningar från 1970-talet behöver ses över. Befintlig el är jordad men saknar FI-skydd för våtrum.",
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
          detailedDescription: "Befintligt kök från 1980-talet, 15 m², med ursprunglig inredning och vitvaror. Projektet omfattar: rivning av icke-bärande vägg mellan kök och vardagsrum för att skapa öppet planlösning (ca 3 meter vägg), komplett rivning av befintliga köksskåp och bänkskivor, ny elinstallation för induktionshäll och moderna vitvaror, VVS-arbeten för diskmaskin och kylskåp med vattenanslutning, installation av köksö med integrerad diskbänk, ny ventilationslösning med kraftfull köksfläkt. Befintligt golv (laminat) kommer att bytas mot klinkergolv.",
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
          detailedDescription: "Målningsarbete i 2-rumslägenhet inför försäljning. Vardagsrum: 20 m², befintlig väggtapet ska rivas, väggar spackel och slipas, målning med 2 stryker färg. Sovrum: 12 m², befintlig färg i gott skick, endast 1 strykning efter grundlig rengöring. Tak i båda rum ska målas vita. Tidsperspektiv är kritiskt då visningar är inbokade om 2 veckor. Färgval ska vara neutralt för att tillgodose bred målgrupp av köpare. All möblering ska skyddas eller flyttas ut temporärt.",
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
          detailedDescription: "3-rumslägenhet från 1960-talet, 75 m², kräver totalrenovering. Befintligt: original parkettgolv (delvis skadat), tapeter från 1980-talet, kök och badrum i ursprungsskick, el-installation från 1960 utan jordning. Projektet omfattar: rivning av befintligt kök och badrum, ny elinstallation enligt moderna standarder, nya vatten- och avloppsledningar, installation av nya golv i alla rum, målning av alla väggar och tak, nytt kök med integrerade vitvaror, nytt badrum med dusch och badkar, nya innerdörrar och lister. Ventilationssystem behöver uppgraderas.",
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
          id: "lead-mats",
          serviceType: "Badrumsrenovering",
          scope: "Ta bort badkar, installera duschväggar",
          location: "Lerum",
          timeframe: "Inom 2 veckor",
          notes: "Chat genomförd med AI-assistent",
          attachments: [],
          estimatedCost: 120000,
          score: 78,
          margin: 25,
          finalPrice: 150000,
          createdAt: new Date("2024-01-19"),
          status: "new",
          customerName: "Mats Svensson",
          customerContact: "mats.svensson@email.com",
          customerAddress: "Björkvägen 7, Lerum",
          detailedDescription: "Mats Nilsson har skickat in en förfrågan om totalrenovering av sitt cirka 9 m² stora badrum i Lerum. Han vill ta bort det befintliga badkaret och istället sätta in duschväggar samt en ny kommod. Toaletten kan stå kvar på sin nuvarande plats, men handfatet ska flyttas närmare dörren. Ventilationen fungerar dåligt och Mats vill därför installera en ny fläkt. Han önskar även elgolvvärme i golvet och byte av den gamla golvbrunnen.",
          projectType: "Badrum",
          renovationType: "Renovering",
          hasCompletedChat: true,
          aiSummary: "Mats Nilsson har skickat in en förfrågan om totalrenovering av sitt cirka 9 m² stora badrum i Lerum. Han vill ta bort badkaret och ersätta det med duschväggar samt en ny kommod. Toaletten behålls på samma plats, men handfatet ska flyttas närmare dörren. Ventilationen ska förbättras genom installation av en ny fläkt. Han önskar elgolvvärme i golvet och byte av den gamla golvbrunnen.",
          structuredSummary: {
            customer: "Mats Nilsson, Björkvägen 7, Lerum",
            project: "Badrumsrenovering, ca 9 m²",
            building: "Rivning av badkar, nytt duschparti med duschväggar, ny kommod, flytt av handfat, behållen wc",
            hvac: "Anpassning för flytt av handfat, byte av golvbrunn, anslutning till befintligt vatten och avlopp",
            electrical: "Installation av elgolvvärme, nytt eldrag till golv och anslutning av elförbrukare",
            ventilation: "Installation av ny fläkt för förbättrad frånluft"
          },
          chatHistory: [
            {
              id: "1",
              text: "Hej Mats, tack för din förfrågan om badrumsrenovering på Björkvägen 7. Jag ser att du vill ta bort badkaret och sätta in duschväggar – stämmer det?",
              sender: "ai",
              timestamp: new Date("2024-01-19T10:00:00")
            },
            {
              id: "2", 
              text: "Ja det stämmer! Badkaret tar för mycket plats och vi använder mest duschen ändå.",
              sender: "user",
              timestamp: new Date("2024-01-19T10:00:30")
            },
            {
              id: "3",
              text: "Förstår. Vill du behålla toaletten och handfatet på samma plats, eller ska de flyttas?",
              sender: "ai",
              timestamp: new Date("2024-01-19T10:01:00")
            },
            {
              id: "4",
              text: "Toaletten kan sitta kvar men handfatet skulle jag vilja flytta närmare dörren för bättre flöde.",
              sender: "user",
              timestamp: new Date("2024-01-19T10:01:45")
            },
            {
              id: "5",
              text: "Noterat. När det gäller ventilationen – vill du ha en ny fläkt installerad, eller är det förbättring av befintlig du tänker på?",
              sender: "ai",
              timestamp: new Date("2024-01-19T10:02:15")
            },
            {
              id: "6",
              text: "Den nuvarande fläkten fungerar dåligt så en helt ny hade varit bra.",
              sender: "user",
              timestamp: new Date("2024-01-19T10:02:50")
            },
            {
              id: "7",
              text: "Bra. Och hur är det med golvvärme – vill du lägga in det i samband med renoveringen?",
              sender: "ai",
              timestamp: new Date("2024-01-19T10:03:20")
            },
            {
              id: "8",
              text: "Ja, elgolvvärme skulle vara perfekt!",
              sender: "user",
              timestamp: new Date("2024-01-19T10:03:45")
            },
            {
              id: "9",
              text: "Perfekt. Vet du om golvbrunnen behöver bytas, eller är den relativt ny?",
              sender: "ai",
              timestamp: new Date("2024-01-19T10:04:15")
            },
            {
              id: "10",
              text: "Den är nog från när huset byggdes så den borde bytas.",
              sender: "user",
              timestamp: new Date("2024-01-19T10:04:40")
            }
          ],
          technicalRequirements: {
            electrical: "Elgolvvärme, nya uttag",
            plumbing: "Flytta handfat, ny golvbrunn, duschinstallation",
            heating: "Elgolvvärme",
            demolition: "Rivning av badkar",
            structuralWork: "Mindre anpassningar för nya installationer",
            permits: "Ej krävs för detta projekt",
            groundwork: "Ej aktuellt",
            otherTechnical: "Ny ventilationsfläkt"
          },
          materials: {
            responsibility: "Vi står för material och arbetskraft",
            preferences: "Moderna, funktionella lösningar",
            style: "Skandinavisk stil",
            inspirationImages: "Inga bifogade",
            extras: "Duschväggar, ny kommod",
            specialRequests: "Bra ventilation"
          },
          planning: {
            drawingsIncluded: "Nej",
            desiredStart: "Inom 2 veckor",
            deadline: "Flexibel"
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
          detailedDescription: "Installation av nytt badrum i villas källare, ca 8 m². Befintlig situation: obeslutat källarutrymme med betongbotten och tegelväggar, inga befintliga VVS-anslutningar. Projektet omfattar: borrning genom betongbotten för avloppsledning, installation av avloppspump då naturligt fall saknas, dragning av nya vattenledningar från huvudledning (ca 15 meter), anslutning till befintligt värmesystem för radiator, installation av komplett badrumsinstallation (dusch, toalett, handfat), ventilationslösning för fukthantering, vattenisolering av golv och väggar enligt BBR.",
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
      console.log('AdminDashboard: Created example leads:', exampleLeads.length, 'leads');
      console.log('AdminDashboard: Example lead IDs:', exampleLeads.map(l => l.id));
    } else {
      // Convert createdAt strings back to Date objects
      const leadsWithDates = savedLeads.map((lead: any) => ({
        ...lead,
        createdAt: new Date(lead.createdAt)
      }));
      setLeads(leadsWithDates);
      console.log('AdminDashboard: Using existing leads:', leadsWithDates.length, 'leads');
      console.log('AdminDashboard: Existing lead IDs:', leadsWithDates.map((l: any) => l.id));
    }
  }, []);

  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, ...updates } : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  const resetToExampleData = () => {
    localStorage.removeItem('leads');
    window.location.reload(); // Reload to trigger useEffect and load example data
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
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={resetToExampleData}
                className="text-sm"
              >
                Återställ till exempeldata (inkl. Mats lead)
              </Button>
            </div>
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