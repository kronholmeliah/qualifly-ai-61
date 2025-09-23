import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GoogleMapsEmbed } from "@/components/ui/google-maps-embed";
import { StreetViewStatic } from "@/components/ui/street-view-static";
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
      // Parse dates if they're strings
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
          <Button 
            variant="outline" 
            onClick={() => navigate('/modern-dashboard')}
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

            {/* Karta */}
            {lead.customerAddress && (
              <GoogleMapsEmbed address={lead.customerAddress} />
            )}

            {/* Street View */}
            {lead.customerAddress && (
              <StreetViewStatic address={lead.customerAddress} />
            )}

            {/* 🏗️ Strukturerad Projektsammanställning */}
            {lead.structuredProject ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    🏗️ Strukturerad projektsammanställning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sammanfattning */}
                  <div>
                    <h4 className="font-medium mb-2">Sammanfattning</h4>
                    <p className="text-muted-foreground leading-relaxed bg-muted p-4 rounded-md">
                      {lead.structuredProject.executiveSummary}
                    </p>
                  </div>

                  <Separator />

                  {/* Grundläggande projektinfo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">1. Projekttyp</p>
                      <p className="font-medium">{lead.structuredProject.projectCategory}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Storlek</p>
                      <p className="font-medium">{lead.structuredProject.scope.size}</p>
                    </div>
                  </div>

                  {/* 2. Omfattning */}
                  {(lead.structuredProject.scope.demolition || lead.structuredProject.scope.newConstruction) && (
                    <div>
                      <h5 className="font-medium mb-2">2. Omfattning</h5>
                      <div className="space-y-2 text-sm">
                        {lead.structuredProject.scope.demolition && (
                          <div><span className="font-medium">Rivning:</span> {lead.structuredProject.scope.demolition}</div>
                        )}
                        {lead.structuredProject.scope.newConstruction && (
                          <div><span className="font-medium">Nybyggnation:</span> {lead.structuredProject.scope.newConstruction}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. Tidsram */}
                  {(lead.structuredProject.timeline.startTime || lead.structuredProject.timeline.deadline) && (
                    <div>
                      <h5 className="font-medium mb-2">4. Tidsram</h5>
                      <div className="space-y-1 text-sm">
                        {lead.structuredProject.timeline.startTime && (
                          <div><span className="font-medium">Start:</span> {lead.structuredProject.timeline.startTime}</div>
                        )}
                        {lead.structuredProject.timeline.deadline && (
                          <div><span className="font-medium">Deadline:</span> {lead.structuredProject.timeline.deadline}</div>
                        )}
                        {lead.structuredProject.timeline.restrictions && (
                          <div><span className="font-medium">Restriktioner:</span> {lead.structuredProject.timeline.restrictions}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 5. Kostnad */}
                  {(lead.structuredProject.cost.budgetRange || lead.structuredProject.cost.financing) && (
                    <div>
                      <h5 className="font-medium mb-2">5. Kostnad</h5>
                      <div className="space-y-1 text-sm">
                        {lead.structuredProject.cost.budgetRange && (
                          <div><span className="font-medium">Budget:</span> {lead.structuredProject.cost.budgetRange}</div>
                        )}
                        {lead.structuredProject.cost.financing && (
                          <div><span className="font-medium">Finansiering:</span> {lead.structuredProject.cost.financing}</div>
                        )}
                      </div>
                    </div>
                  )}
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
            )}

            {/* 3. Tekniska krav */}
            {lead.structuredProject?.technicalRequirements ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    3. Tekniska krav
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bygg & stomme */}
                  {lead.structuredProject.technicalRequirements.construction && (
                    <div>
                      <h5 className="font-medium text-muted-foreground mb-2">Bygg & stomme</h5>
                      <div className="space-y-1 text-sm ml-4">
                        {Object.entries(lead.structuredProject.technicalRequirements.construction).map(([key, value]) => 
                          value && (
                            <div key={key}>
                              <span className="font-medium">
                                {key === 'walls' ? 'Väggar' : key === 'floors' ? 'Golv' : key === 'ceiling' ? 'Tak' : 
                                 key === 'structural' ? 'Bärande' : key === 'surfacing' ? 'Ytskikt' : key}:
                              </span> {value}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* VVS */}
                  {lead.structuredProject.technicalRequirements.plumbing && (
                    <div>
                      <h5 className="font-medium text-muted-foreground mb-2">VVS</h5>
                      <div className="space-y-1 text-sm ml-4">
                        {Object.entries(lead.structuredProject.technicalRequirements.plumbing).map(([key, value]) => 
                          value && (
                            <div key={key}>
                              <span className="font-medium">
                                {key === 'waterSupply' ? 'Vatten/avlopp' : key === 'drains' ? 'Golvbrunn' : 
                                 key === 'heating' ? 'Värme/golvvärme' : key}:
                              </span> {value}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* El & styr */}
                  {lead.structuredProject.technicalRequirements.electrical && (
                    <div>
                      <h5 className="font-medium text-muted-foreground mb-2">El & styr</h5>
                      <div className="space-y-1 text-sm ml-4">
                        {Object.entries(lead.structuredProject.technicalRequirements.electrical).map(([key, value]) => 
                          value && (
                            <div key={key}>
                              <span className="font-medium">
                                {key === 'outlets' ? 'Uttag' : key === 'panel' ? 'Central' : key === 'lighting' ? 'Belysning' : 
                                 key === 'floorHeating' ? 'Golvvärme' : key}:
                              </span> {value}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ventilation */}
                  {lead.structuredProject.technicalRequirements.ventilation && (
                    <div>
                      <h5 className="font-medium text-muted-foreground mb-2">Ventilation & inomhusklimat</h5>
                      <div className="space-y-1 text-sm ml-4">
                        {Object.entries(lead.structuredProject.technicalRequirements.ventilation).map(([key, value]) => 
                          value && (
                            <div key={key}>
                              <span className="font-medium">
                                {key === 'fans' ? 'Fläktar' : key === 'ducts' ? 'Kanaler' : key === 'airflow' ? 'Luftflöde' : key}:
                              </span> {value}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Klimatskal / Mark */}
                  {lead.structuredProject.technicalRequirements.building && (
                    <div>
                      <h5 className="font-medium text-muted-foreground mb-2">Klimatskal / Mark</h5>
                      <div className="space-y-1 text-sm ml-4">
                        {Object.entries(lead.structuredProject.technicalRequirements.building).map(([key, value]) => 
                          value && (
                            <div key={key}>
                              <span className="font-medium">
                                {key === 'roof' ? 'Tak' : key === 'facade' ? 'Fasad' : key === 'windows' ? 'Fönster' : 
                                 key === 'drainage' ? 'Dränering' : key === 'foundation' ? 'Grund' : key === 'access' ? 'Åtkomst' : key}:
                              </span> {value}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* 6. Status & risk */}
                  {lead.structuredProject.riskAssessment && Object.values(lead.structuredProject.riskAssessment).some(v => v) && (
                    <div>
                      <h5 className="font-medium text-muted-foreground mb-2">6. Status & risk</h5>
                      <div className="space-y-1 text-sm ml-4">
                        {Object.entries(lead.structuredProject.riskAssessment).map(([key, value]) => 
                          value && (
                            <div key={key}>
                              <span className="font-medium">
                                {key === 'moisture' ? 'Fukt' : key === 'mold' ? 'Mögel' : key === 'asbestos' ? 'Asbest' : 
                                 key === 'radon' ? 'Radon' : key === 'heritage' ? 'Kulturklassning' : key === 'other' ? 'Övrigt' : key}:
                              </span> {value}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : lead.technicalRequirements && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Tekniska krav
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lead.structuredProject?.aiSummary?.tekniska_krav ? (
                    <div className="space-y-3">
                      {Object.entries(lead.structuredProject.aiSummary.tekniska_krav).map(([kategori, status]) => (
                        <div key={kategori} className="flex items-center gap-3">
                          <div className="w-4 h-4 border border-border rounded flex items-center justify-center text-xs font-mono">
                            {status === "[x]" ? "✓" : " "}
                          </div>
                          <span className={`text-sm ${status === "[x]" ? "font-medium" : "text-muted-foreground"}`}>
                            {kategori}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(lead.technicalRequirements).map(([key, value]) => (
                        value && key !== 'permits' && (
                          <div key={key}>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              {key === 'electrical' ? 'Elinstallation' :
                               key === 'plumbing' ? 'VVS' :
                               key === 'heating' ? 'Värme/Golvvärme' :
                               key === 'demolition' ? 'Rivning' :
                               key === 'structuralWork' ? 'Bärande ingrepp' :
                               key === 'groundwork' ? 'Markarbete' :
                               'Övrigt'}
                            </p>
                            <p className="text-sm">{value}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

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

            {/* Timeframe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tidsram
                </CardTitle>
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
                    <span className="text-sm font-medium">{(lead.estimatedCost || 0).toLocaleString("sv-SE")} kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Marginal</span>
                    <span className="text-sm font-medium">{lead.margin || 0}%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-sm">Rekommenderat pris</span>
                    <span className="text-sm text-primary">{(lead.finalPrice || 0).toLocaleString("sv-SE")} kr</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Uppladdade filer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lead.attachments && lead.attachments.length > 0 ? (
                  lead.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-secondary rounded">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{file.name || `Fil ${index + 1}`}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Inga filer uppladdade</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;