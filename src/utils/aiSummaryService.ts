import { DetailedLeadData } from '@/components/EnhancedLeadChatWidget';

interface StructuredProjectSummary {
  projektinnehall: string[];
  tekniska_krav: {
    "Bygg & stomme": "[x]" | "[ ]";
    "VVS": "[x]" | "[ ]";
    "El & styr": "[x]" | "[ ]";
    "Ventilation & inomhusklimat": "[x]" | "[ ]";
    "Klimatskal": "[x]" | "[ ]";
    "Mark & grund": "[x]" | "[ ]";
    "Status & risk": "[x]" | "[ ]";
  };
}

export const generateStructuredProjectSummary = (leadData: DetailedLeadData, chatHistory?: any[]): StructuredProjectSummary => {
  // Generate Projektinnehåll - professional bullet points in full sentences
  const projektinnehall: string[] = [];
  
  if (leadData.projekttyp && leadData.status) {
    const action = leadData.status.toLowerCase().includes('renovering') ? 'renoveras' : 'byggas';
    projektinnehall.push(`${leadData.projekttyp} ska ${action} ${leadData.adress ? `på ${leadData.adress}` : ''}.`.trim());
  }

  if (leadData.kort_beskrivning) {
    projektinnehall.push(leadData.kort_beskrivning);
  }

  if (leadData.rivning && leadData.rivning.toLowerCase().includes('ja')) {
    if (leadData.projekttyp.toLowerCase().includes('badrum')) {
      projektinnehall.push("Befintligt badkar ska rivas och ersättas med duschväggar.");
    } else {
      projektinnehall.push("Befintliga delar ska rivas enligt projektbeskrivning.");
    }
  }

  if (leadData.vvs_installation && leadData.vvs_installation.toLowerCase().includes('ja')) {
    projektinnehall.push("VVS-installationer ska utföras för vatten och avlopp.");
  }

  if (leadData.golvvärme && leadData.golvvärme.toLowerCase().includes('ja')) {
    if (leadData.golvvärme.toLowerCase().includes('el')) {
      projektinnehall.push("Elgolvvärme ska installeras.");
    } else {
      projektinnehall.push("Golvvärme ska installeras.");
    }
  }

  if (leadData.elinstallation && leadData.elinstallation.toLowerCase().includes('ja')) {
    projektinnehall.push("Ny elinstallation ska utföras med uttag och belysning.");
  }

  if (leadData.materialpreferenser) {
    projektinnehall.push(`Material: ${leadData.materialpreferenser}.`);
  }

  if (leadData.onskad_start || leadData.deadline) {
    let timeInfo = "Projektet ska";
    if (leadData.onskad_start) timeInfo += ` påbörjas ${leadData.onskad_start}`;
    if (leadData.deadline) timeInfo += ` slutföras senast ${leadData.deadline}`;
    projektinnehall.push(`${timeInfo}.`);
  }

  // Ensure we have at least 3-5 points, add generic ones if needed
  if (projektinnehall.length < 3) {
    if (!projektinnehall.some(p => p.includes('kvalitet'))) {
      projektinnehall.push("Arbetet ska utföras med hög kvalitet och enligt branschstandard.");
    }
    if (!projektinnehall.some(p => p.includes('säkerhet'))) {
      projektinnehall.push("Alla säkerhetsföreskrifter ska följas under byggprocessen.");
    }
  }

  // Generate Tekniska krav - check each category
  const tekniska_krav = {
    "Bygg & stomme": (
      (leadData.barande_ingrepp && leadData.barande_ingrepp.toLowerCase().includes('ja')) ||
      (leadData.rivning && leadData.rivning.toLowerCase().includes('ja')) ||
      leadData.projekttyp.toLowerCase().includes('tillbyggnad') ||
      leadData.projekttyp.toLowerCase().includes('renovering')
    ) ? "[x]" as const : "[ ]" as const,

    "VVS": (
      (leadData.vvs_installation && leadData.vvs_installation.toLowerCase().includes('ja')) ||
      (leadData.golvvärme && leadData.golvvärme.toLowerCase().includes('vatten')) ||
      leadData.projekttyp.toLowerCase().includes('badrum') ||
      leadData.projekttyp.toLowerCase().includes('kök')
    ) ? "[x]" as const : "[ ]" as const,

    "El & styr": (
      (leadData.elinstallation && leadData.elinstallation.toLowerCase().includes('ja')) ||
      (leadData.golvvärme && leadData.golvvärme.toLowerCase().includes('el')) ||
      leadData.kort_beskrivning?.toLowerCase().includes('el') ||
      leadData.kort_beskrivning?.toLowerCase().includes('uttag')
    ) ? "[x]" as const : "[ ]" as const,

    "Ventilation & inomhusklimat": (
      leadData.projekttyp.toLowerCase().includes('badrum') ||
      leadData.projekttyp.toLowerCase().includes('kök') ||
      leadData.kort_beskrivning?.toLowerCase().includes('ventilation') ||
      leadData.kort_beskrivning?.toLowerCase().includes('fläkt')
    ) ? "[x]" as const : "[ ]" as const,

    "Klimatskal": (
      leadData.projekttyp.toLowerCase().includes('tak') ||
      leadData.projekttyp.toLowerCase().includes('fasad') ||
      leadData.kort_beskrivning?.toLowerCase().includes('fönster') ||
      leadData.kort_beskrivning?.toLowerCase().includes('tak')
    ) ? "[x]" as const : "[ ]" as const,

    "Mark & grund": (
      (leadData.markarbete && leadData.markarbete.toLowerCase().includes('ja')) ||
      leadData.projekttyp.toLowerCase().includes('tillbyggnad') ||
      leadData.kort_beskrivning?.toLowerCase().includes('grund')
    ) ? "[x]" as const : "[ ]" as const,

    "Status & risk": (
      (leadData.bygglov_status && leadData.bygglov_status.toLowerCase().includes('behövs')) ||
      leadData.kort_beskrivning?.toLowerCase().includes('fukt') ||
      leadData.kort_beskrivning?.toLowerCase().includes('mögel') ||
      leadData.kort_beskrivning?.toLowerCase().includes('asbest')
    ) ? "[x]" as const : "[ ]" as const
  };

  return {
    projektinnehall,
    tekniska_krav
  };
};