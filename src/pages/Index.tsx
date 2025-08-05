import React, { useState } from "react";
import { LeadChatWidget } from "@/components/LeadChatWidget";
import { LeadDashboard } from "@/components/LeadDashboard";
import { Lead } from "@/types/lead";
import { calculateLeadScore } from "@/utils/leadScoring";

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleLeadSubmitted = (leadData: any) => {
    const newLead: Lead = {
      id: Date.now().toString(),
      serviceType: leadData.serviceType,
      scope: leadData.scope,
      location: leadData.location,
      timeframe: leadData.timeframe,
      notes: leadData.notes,
      attachments: leadData.attachments,
      estimatedCost: leadData.estimatedCost,
      score: 0,
      margin: 20, // Default 20% margin
      finalPrice: 0,
      createdAt: new Date(),
      status: "new"
    };

    // Calculate score and final price
    const { score } = calculateLeadScore(newLead);
    newLead.score = score;
    newLead.finalPrice = Math.round(newLead.estimatedCost * (1 + newLead.margin / 100));

    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, ...updates } : lead
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <div className="container mx-auto px-4 py-8">
        <LeadDashboard 
          leads={leads} 
          onUpdateLead={handleUpdateLead}
        />
      </div>
      
      <LeadChatWidget onLeadSubmitted={handleLeadSubmitted} />
    </div>
  );
};

export default Index;
