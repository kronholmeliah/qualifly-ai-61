import React, { useState, useEffect } from "react";
import { LeadDashboard } from "@/components/LeadDashboard";
import { Lead } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load leads from localStorage
    const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    setLeads(savedLeads);
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
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka till kundsida
          </Button>
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