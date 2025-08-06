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
  Mail, 
  Phone,
  Home,
  Wrench,
  Palette,
  ClipboardList
} from "lucide-react";

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    const foundLead = savedLeads.find((l: Lead) => l.id === id);
    setLead(foundLead || null);
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
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Tillbaka
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {lead.serviceType}
            </h1>
            <p className="text-muted-foreground">
              Lead-ID: {lead.id}
            </p>
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
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Kontakt</p>
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

            {/* Project Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Projektbeskrivning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Detaljerad beskrivning</h4>
                    <p className="text-muted-foreground">{lead.detailedDescription}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Projekttyp</p>
                      <p className="font-medium">{lead.projectType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Typ</p>
                      <p className="font-medium">{lead.renovationType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Omfattning</p>
                      <p className="font-medium">{lead.scope}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Tekniska krav
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lead.technicalRequirements && Object.entries(lead.technicalRequirements).map(([key, value]) => (
                    value && (
                      <div key={key}>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {key === 'electrical' ? 'Elinstallation' :
                           key === 'plumbing' ? 'VVS' :
                           key === 'heating' ? 'Värme/Golvvärme' :
                           key === 'demolition' ? 'Rivning' :
                           key === 'structuralWork' ? 'Bärande ingrepp' :
                           key === 'permits' ? 'Bygglov' :
                           key === 'groundwork' ? 'Markarbete' :
                           'Övrigt'}
                        </p>
                        <p className="text-sm">{value}</p>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Materials & Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Material & stil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lead.materials && Object.entries(lead.materials).map(([key, value]) => (
                    value && (
                      <div key={key}>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {key === 'responsibility' ? 'Materialansvar' :
                           key === 'preferences' ? 'Materialpreferenser' :
                           key === 'style' ? 'Stilpreferens' :
                           key === 'inspirationImages' ? 'Inspirationsbilder' :
                           key === 'extras' ? 'Tillval' :
                           'Specialönskemål'}
                        </p>
                        <p className="text-sm">{value}</p>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lead Score & Status */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Score & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge 
                    variant={scoreColor === "success" ? "default" : scoreColor === "warning" ? "secondary" : "destructive"}
                    className="text-lg px-4 py-2"
                  >
                    {scoreEmoji} {lead.score}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline">
                    {lead.status === "new" ? "Ny" : 
                     lead.status === "contacted" ? "Kontaktad" : 
                     lead.status === "quoted" ? "Offererad" : "Stängd"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant={lead.status === "contacted" ? "default" : "outline"}
                    onClick={() => handleUpdateLead({ status: "contacted" })}
                  >
                    Kontaktad
                  </Button>
                  <Button 
                    size="sm" 
                    variant={lead.status === "quoted" ? "default" : "outline"}
                    onClick={() => handleUpdateLead({ status: "quoted" })}
                  >
                    Offererad
                  </Button>
                  <Button 
                    size="sm" 
                    variant={lead.status === "closed" ? "default" : "outline"}
                    onClick={() => handleUpdateLead({ status: "closed" })}
                  >
                    Stängd
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Projektinfo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.timeframe}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Uppskattad kostnad</span>
                    <span className="text-sm font-medium">{lead.estimatedCost.toLocaleString("sv-SE")} kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Marginal</span>
                    <span className="text-sm font-medium">{lead.margin}%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-sm">Rekommenderat pris</span>
                    <span className="text-sm text-primary">{lead.finalPrice.toLocaleString("sv-SE")} kr</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Planning */}
            {lead.planning && (
              <Card>
                <CardHeader>
                  <CardTitle>Planering</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(lead.planning).map(([key, value]) => (
                    value && (
                      <div key={key}>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {key === 'drawingsIncluded' ? 'Ritningar' :
                           key === 'desiredStart' ? 'Önskad start' :
                           'Deadline'}
                        </p>
                        <p className="text-sm">{value}</p>
                      </div>
                    )
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;