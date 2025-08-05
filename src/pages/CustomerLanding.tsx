import React from "react";
import { LeadChatWidget } from "@/components/LeadChatWidget";
import { Lead } from "@/types/lead";
import { calculateLeadScore } from "@/utils/leadScoring";

const CustomerLanding = () => {
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

    // Save to localStorage
    const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    const updatedLeads = [newLead, ...existingLeads];
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Få en kostnadskalkyl för ditt projekt
          </h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Berätta om ditt renoveringsprojekt och få en direkt uppskattning av kostnaden. 
            Våra experter kommer att kontakta dig med ett skräddarsytt förslag.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Snabb bedömning</h3>
              <p className="text-muted-foreground">Få en kostnadskalkyl på bara några minuter</p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Professionell service</h3>
              <p className="text-muted-foreground">Erfarna hantverkare med hög kvalitet</p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent prissättning</h3>
              <p className="text-muted-foreground">Inga dolda kostnader eller överraskningar</p>
            </div>
          </div>
        </div>
      </div>
      
      <LeadChatWidget onLeadSubmitted={handleLeadSubmitted} />
    </div>
  );
};

export default CustomerLanding;