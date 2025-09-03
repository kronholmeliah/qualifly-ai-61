import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lead } from "@/types/lead";
import { getScoreColor, getScoreEmoji } from "@/utils/leadScoring";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Euro, 
  User, 
  Phone,
  Home,
  Wrench,
  ClipboardList
} from "lucide-react";

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    const foundLead = savedLeads.find((l: Lead) => l.id === id);
    if (foundLead) {
      if (typeof foundLead.createdAt === 'string') {
        foundLead.createdAt = new Date(foundLead.createdAt);
      }
      setLead(foundLead);
    }
  }, [id]);

  const handleUpdateLead = (updates: Partial<Lead>) => {
    if (!lead) return;
    const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    const updatedLeads = savedLeads.map((l: Lead) => 
      l.id === lead.id ? { ...l, ...updates } : l
    );
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    setLead({ ...lead, ...updates });
  };

  if (!lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Lead hittades inte</h1>
            <Button onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka till Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const scoreColor = getScoreColor(lead.score);
  const scoreEmoji = getScoreEmoji(lead.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/modern-dashboard')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Tillbaka
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{lead.serviceType}</h1>
            <p className="text-muted-foreground">Lead-ID: {lead.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Kunduppgifter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Namn</p>
                      <p className="font-medium">{lead.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <p className="font-medium">{lead.customerContact}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Adress</p>
                    <p className="font-medium">{lead.customerAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI-genererad Projektanalys */}
            {lead.structuredProject?.aiSummary ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">🤖 AI-Projektanalys</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Projektinnehåll */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Projektinnehåll
                    </h4>
                    <div className="bg-background border rounded-md p-4">
                      <ul className="space-y-2">
                        {lead.structuredProject.aiSummary.projektinnehall.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tekniska krav - Checklista */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Tekniska krav
                    </h4>
                    <div className="bg-background border rounded-md p-4">
                      <div className="grid gap-3">
                        {Object.entries(lead.structuredProject.aiSummary.tekniska_krav).map(([kategori, status]) => (
                          <div key={kategori} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center text-sm font-bold ${
                              status === "[x]" 
                                ? "bg-primary border-primary text-primary-foreground" 
                                : "border-muted-foreground/30 text-muted-foreground/50"
                            }`}>
                              {status === "[x]" ? "✓" : ""}
                            </div>
                            <span className={`text-sm font-medium ${
                              status === "[x]" ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {kategori}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Projektbeskrivning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{lead.detailedDescription}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lead Score & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge 
                    variant={scoreColor === "success" ? "default" : scoreColor === "warning" ? "secondary" : "destructive"}
                    className="text-lg px-3 py-1"
                  >
                    {scoreEmoji} {lead.score}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tidsram & Kostnad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Plats</p>
                    <p className="text-sm font-medium">{lead.location}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Rekommenderat pris</p>
                  <div className="flex items-center gap-1">
                    <Euro className="h-4 w-4 text-primary" />
                    <p className="text-xl font-bold text-primary">
                      {(lead.finalPrice || 0).toLocaleString("sv-SE")} kr
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;