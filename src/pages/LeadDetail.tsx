import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GoogleMapsEmbed } from "@/components/ui/google-maps-embed";
import { StreetViewStatic } from "@/components/ui/street-view-static";
import { Lead } from "@/types/lead";
import { getScoreColor, getScoreEmoji, calculateLeadScore } from "@/utils/leadScoring";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Euro, 
  User, 
  Phone,
  Home,
  Wrench,
  ClipboardList,
  ExternalLink,
  TrendingUp,
  Clock,
  AlertTriangle,
  FileText
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
  const { factors } = calculateLeadScore(lead);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
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
          <Button onClick={() => navigate(`/admin/quote/${id}`)}>
            <FileText className="h-4 w-4 mr-2" />
            Skapa offert
          </Button>
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

            {/* Kombinerad Karta och Street View */}
            {lead.customerAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Karta & Street View
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Google Maps */}
                    <div className="space-y-4">
                      <div className="rounded-lg overflow-hidden border">
                        <iframe
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyA1IILY3T9YwXVkMlshkOMnLxBsCoQDHzo&q=${encodeURIComponent(lead.customerAddress)}`}
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Google Maps"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.customerAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.customerAddress)}`,
                                '_blank',
                                'noopener,noreferrer'
                              );
                            }}
                            className="flex items-center gap-2"
                            title={`Öppna ${lead.customerAddress} i Google Maps`}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Öppna i Google Maps
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Street View */}
                    <div className="space-y-4">
                      <StreetViewStatic address={lead.customerAddress} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 📋 Integrerad Projektöversikt */}
            {lead.structuredProject ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    📋 Projektöversikt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* 1. Projektsammanfattning */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">1</div>
                      Projektsammanfattning
                    </div>
                    <div className="ml-8 space-y-3">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-6 rounded-lg border-l-4 border-primary">
                        <p className="text-foreground leading-relaxed font-medium">
                          {lead.structuredProject.executiveSummary}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-card border rounded-lg p-4">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Projekttyp</p>
                          <p className="font-semibold text-primary">{lead.structuredProject.projectCategory}</p>
                        </div>
                        <div className="bg-card border rounded-lg p-4">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Storlek</p>
                          <p className="font-semibold">{lead.structuredProject.scope.size}</p>
                        </div>
                        <div className="bg-card border rounded-lg p-4">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Tidsram</p>
                          <p className="font-semibold">{lead.timeframe}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* 2. Omfattning & Arbetsmomenter */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">2</div>
                      Omfattning & Arbetsmomenter
                    </div>
                    <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lead.structuredProject.scope.demolition && (
                        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-destructive font-medium">🔨 Rivning</span>
                          </div>
                          <p className="text-sm text-foreground">{lead.structuredProject.scope.demolition}</p>
                        </div>
                      )}
                      {lead.structuredProject.scope.newConstruction && (
                        <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-success font-medium">🏗️ Nybyggnation</span>
                          </div>
                          <p className="text-sm text-foreground">{lead.structuredProject.scope.newConstruction}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    📋 Projektöversikt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-6 rounded-lg border-l-4 border-primary">
                    <h4 className="font-semibold mb-3 text-primary">Projektbeskrivning</h4>
                    <p className="text-foreground leading-relaxed">{lead.detailedDescription}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Projekttyp</p>
                      <p className="font-semibold text-primary">{lead.projectType}</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Typ</p>
                      <p className="font-semibold">{lead.renovationType}</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Omfattning</p>
                      <p className="font-semibold">{lead.scope}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 3. Tekniska Specifikationer */}
            {lead.structuredProject?.technicalRequirements ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    🔧 Tekniska Specifikationer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">3</div>
                      Teknisk Genomgång per Område
                    </div>

                    {/* Bygg & stomme */}
                    {lead.structuredProject.technicalRequirements.construction && (
                      <div className="ml-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">🏗️</span>
                          <h5 className="font-semibold text-yellow-800">Bygg & Stomme</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(lead.structuredProject.technicalRequirements.construction).map(([key, value]) => 
                            value && (
                              <div key={key} className="bg-white/60 border border-yellow-200/50 rounded-md p-3">
                                <span className="font-medium text-yellow-900">
                                  {key === 'walls' ? 'Väggar' : key === 'floors' ? 'Golv' : key === 'ceiling' ? 'Tak' : 
                                   key === 'structural' ? 'Bärande' : key === 'surfacing' ? 'Ytskikt' : key}:
                                </span>
                                <p className="text-sm text-yellow-800 mt-1">{value}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* VVS */}
                    {lead.structuredProject.technicalRequirements.plumbing && (
                      <div className="ml-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">🚰</span>
                          <h5 className="font-semibold text-blue-800">VVS (Vatten, Värme, Sanitet)</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(lead.structuredProject.technicalRequirements.plumbing).map(([key, value]) => 
                            value && (
                              <div key={key} className="bg-white/60 border border-blue-200/50 rounded-md p-3">
                                <span className="font-medium text-blue-900">
                                  {key === 'waterSupply' ? 'Vatten/avlopp' : key === 'drains' ? 'Golvbrunn' : 
                                   key === 'heating' ? 'Värme/golvvärme' : key}:
                                </span>
                                <p className="text-sm text-blue-800 mt-1">{value}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* El & styr */}
                    {lead.structuredProject.technicalRequirements.electrical && (
                      <div className="ml-8 bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">⚡</span>
                          <h5 className="font-semibold text-amber-800">El & Styr</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(lead.structuredProject.technicalRequirements.electrical).map(([key, value]) => 
                            value && (
                              <div key={key} className="bg-white/60 border border-amber-200/50 rounded-md p-3">
                                <span className="font-medium text-amber-900">
                                  {key === 'outlets' ? 'Uttag' : key === 'panel' ? 'Central' : key === 'lighting' ? 'Belysning' : 
                                   key === 'floorHeating' ? 'Golvvärme' : key}:
                                </span>
                                <p className="text-sm text-amber-800 mt-1">{value}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Ventilation */}
                    {lead.structuredProject.technicalRequirements.ventilation && (
                      <div className="ml-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">💨</span>
                          <h5 className="font-semibold text-green-800">Ventilation & Inomhusklimat</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(lead.structuredProject.technicalRequirements.ventilation).map(([key, value]) => 
                            value && (
                              <div key={key} className="bg-white/60 border border-green-200/50 rounded-md p-3">
                                <span className="font-medium text-green-900">
                                  {key === 'fans' ? 'Fläktar' : key === 'ducts' ? 'Kanaler' : key === 'airflow' ? 'Luftflöde' : key}:
                                </span>
                                <p className="text-sm text-green-800 mt-1">{value}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Klimatskal / Mark */}
                    {lead.structuredProject.technicalRequirements.building && (
                      <div className="ml-8 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">🏠</span>
                          <h5 className="font-semibold text-purple-800">Klimatskal & Mark</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(lead.structuredProject.technicalRequirements.building).map(([key, value]) => 
                            value && (
                              <div key={key} className="bg-white/60 border border-purple-200/50 rounded-md p-3">
                                <span className="font-medium text-purple-900">
                                  {key === 'roof' ? 'Tak' : key === 'facade' ? 'Fasad' : key === 'windows' ? 'Fönster' : 
                                   key === 'drainage' ? 'Dränering' : key === 'foundation' ? 'Grund' : key === 'access' ? 'Åtkomst' : key}:
                                </span>
                                <p className="text-sm text-purple-800 mt-1">{value}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Risk Assessment */}
                    {lead.structuredProject.riskAssessment && Object.values(lead.structuredProject.riskAssessment).some(v => v) && (
                      <div className="ml-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">⚠️</span>
                          <h5 className="font-semibold text-red-800">Riskbedömning & Särskilda Förhållanden</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(lead.structuredProject.riskAssessment).map(([key, value]) => 
                            value && (
                              <div key={key} className="bg-white/60 border border-red-200/50 rounded-md p-3">
                                <span className="font-medium text-red-900">
                                  {key === 'moisture' ? 'Fukt' : key === 'mold' ? 'Mögel' : key === 'asbestos' ? 'Asbest' : 
                                   key === 'radon' ? 'Radon' : key === 'heritage' ? 'Kulturklassning' : key === 'other' ? 'Övrigt' : key}:
                                </span>
                                <p className="text-sm text-red-800 mt-1">{value}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
            {/* Lead Score & Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lead Score & Ranking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Badge 
                    variant={scoreColor === "success" ? "default" : scoreColor === "warning" ? "secondary" : "destructive"}
                    className="text-lg px-4 py-2"
                  >
                    {scoreEmoji} {lead.score} poäng
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {lead.score >= 80 ? "Högt prioriterat lead" : 
                     lead.score >= 60 ? "Medel prioriterat lead" : "Lågt prioriterat lead"}
                  </p>
                </div>

                <Separator />

                {/* Score Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">RANKING FÖRKLARING</h4>
                  
                  {/* Economic Potential */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">Ekonomisk potential</span>
                        <span className="text-xs text-muted-foreground">(40%)</span>
                      </div>
                      <span className="text-sm font-medium">{Math.round(factors.economicPotential)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${factors.economicPotential}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Baserat på uppskattad kostnad: {lead.estimatedCost.toLocaleString("sv-SE")} kr
                    </p>
                  </div>

                  {/* Complexity */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="text-sm font-medium">Komplexitet & risk</span>
                        <span className="text-xs text-muted-foreground">(25%)</span>
                      </div>
                      <span className="text-sm font-medium">{Math.round(factors.complexity)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-warning h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${factors.complexity}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {lead.serviceType} - {factors.complexity >= 70 ? "Låg komplexitet" : 
                       factors.complexity >= 50 ? "Medel komplexitet" : "Hög komplexitet"}
                    </p>
                  </div>

                  {/* Time Criticality */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Tidskritikalitet</span>
                        <span className="text-xs text-muted-foreground">(20%)</span>
                      </div>
                      <span className="text-sm font-medium">{Math.round(factors.timeframe)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${factors.timeframe}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Önskar start: {lead.timeframe} - {factors.timeframe >= 80 ? "Mycket bråttom" : 
                       factors.timeframe >= 60 ? "Måttligt bråttom" : "Ej bråttom"}
                    </p>
                  </div>

                  {/* Customer Seriousness */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium">Kundallvar</span>
                        <span className="text-xs text-muted-foreground">(15%)</span>
                      </div>
                      <span className="text-sm font-medium">{Math.round(factors.seriousness)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${factors.seriousness}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {lead.attachments.length > 0 ? `${lead.attachments.length} bifogade filer` : "Inga filer"} • 
                      {lead.notes.length > 50 ? " Detaljerade anteckningar" : " Korta anteckningar"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Status Management */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Lead Status</p>
                    <Badge variant="outline" className="text-sm">
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
                </div>
              </CardContent>
            </Card>

            {/* Tidsram */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Calendar className="h-5 w-5" />
                  Tidsram
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    Inom två veckor
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Projektet kan påbörjas snart
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-sm text-primary font-medium mt-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    Redo att starta
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