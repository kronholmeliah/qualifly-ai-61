import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Calendar, 
  Euro, 
  FileText, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  Star,
  Calculator,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Lead } from "@/types/lead";
import { getScoreColor, getScoreEmoji, generateLeadSummary, calculateLeadScore } from "@/utils/leadScoring";

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateLead,
}) => {
  const [margin, setMargin] = useState(lead?.margin || 20);
  const [showChatHistory, setShowChatHistory] = useState(false);
  
  if (!lead) return null;

  const { factors } = calculateLeadScore(lead);
  const scoreColor = getScoreColor(lead.score);
  const scoreEmoji = getScoreEmoji(lead.score);
  const finalPrice = Math.round(lead.estimatedCost * (1 + margin / 100));
  const summary = generateLeadSummary({ ...lead, margin, finalPrice });

  const handleMarginChange = (newMargin: number[]) => {
    const marginValue = newMargin[0];
    setMargin(marginValue);
    const updatedFinalPrice = Math.round(lead.estimatedCost * (1 + marginValue / 100));
    onUpdateLead(lead.id, { 
      margin: marginValue, 
      finalPrice: updatedFinalPrice 
    });
  };

  const statusOptions = [
    { value: "new", label: "Ny", color: "secondary" },
    { value: "contacted", label: "Kontaktad", color: "default" },
    { value: "quoted", label: "Offererad", color: "warning" },
    { value: "closed", label: "Stängd", color: "success" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span>{lead.serviceType}</span>
            <Badge 
              variant={scoreColor === "success" ? "default" : scoreColor === "warning" ? "secondary" : "destructive"}
            >
              {scoreEmoji} {lead.score}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Information */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Projektinformation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Tjänstetyp</Label>
                    <p className="font-medium">{lead.serviceType}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div className="flex gap-1 mt-1">
                      {statusOptions.map((status) => (
                        <Button
                          key={status.value}
                          variant={lead.status === status.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => onUpdateLead(lead.id, { status: status.value as Lead["status"] })}
                          className="text-xs px-2 py-1 h-auto"
                        >
                          {status.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Omfattning</Label>
                  <p className="font-medium">{lead.scope}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Plats
                    </Label>
                    <p className="font-medium">{lead.location}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Önskad starttid
                    </Label>
                    <p className="font-medium">{lead.timeframe}</p>
                  </div>
                </div>

                {lead.notes && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Anteckningar</Label>
                    <p className="text-sm bg-muted p-3 rounded-md">{lead.notes}</p>
                  </div>
                )}

                {lead.attachments.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Bifogade filer ({lead.attachments.length})
                    </Label>
                    <div className="space-y-1 mt-1">
                      {lead.attachments.map((file, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {file.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lead Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Lead Score Uppdelning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-primary" />
                    <span className="text-sm">Ekonomisk potential (40%)</span>
                  </div>
                  <Badge variant="outline">{Math.round(factors.economicPotential)}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm">Komplexitet & risk (25%)</span>
                  </div>
                  <Badge variant="outline">{Math.round(factors.complexity)}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Tidskritikalitet (20%)</span>
                  </div>
                  <Badge variant="outline">{Math.round(factors.timeframe)}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-success" />
                    <span className="text-sm">Kundseriositet (15%)</span>
                  </div>
                  <Badge variant="outline">{Math.round(factors.seriousness)}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing & Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Priskalkyl
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Uppskattad kostnad</Label>
                  <p className="text-lg font-semibold">
                    {lead.estimatedCost.toLocaleString("sv-SE")} kr <span className="text-sm text-muted-foreground">(±10%)</span>
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Önskad vinstmarginal</Label>
                    <Input
                      type="number"
                      value={margin}
                      onChange={(e) => handleMarginChange([parseInt(e.target.value) || 0])}
                      className="w-20 text-right"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <Slider
                    value={[margin]}
                    onValueChange={handleMarginChange}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="text-center">
                    <Label className="text-xs text-muted-foreground">Rekommenderat fakturapris</Label>
                    <p className="text-2xl font-bold text-primary">
                      {finalPrice.toLocaleString("sv-SE")} kr
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +{Math.round(finalPrice - lead.estimatedCost).toLocaleString("sv-SE")} kr vinst
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🏗️ Strukturerad Projektsammanställning */}
            {lead.structuredProject && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    🏗️ Strukturerad projektsammanställning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 7. Sammanfattning i löpande text */}
                  <div>
                    <Label className="text-sm font-medium text-foreground">Sammanfattning</Label>
                    <p className="text-sm leading-relaxed bg-muted p-4 rounded-md mt-2">
                      {lead.structuredProject.executiveSummary}
                    </p>
                  </div>

                  {/* 1. Projekttyp */}
                  <div>
                    <Label className="text-sm font-medium text-foreground">1. Projekttyp</Label>
                    <p className="text-sm mt-1">{lead.structuredProject.projectCategory}</p>
                  </div>

                  {/* 2. Omfattning */}
                  <div>
                    <Label className="text-sm font-medium text-foreground">2. Omfattning</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      {lead.structuredProject.scope.size && (
                        <div><span className="font-medium">Storlek:</span> {lead.structuredProject.scope.size}</div>
                      )}
                      {lead.structuredProject.scope.demolition && (
                        <div><span className="font-medium">Rivning:</span> {lead.structuredProject.scope.demolition}</div>
                      )}
                      {lead.structuredProject.scope.newConstruction && (
                        <div><span className="font-medium">Nybyggnation:</span> {lead.structuredProject.scope.newConstruction}</div>
                      )}
                    </div>
                  </div>

                  {/* 3. Tekniska krav */}
                  <div>
                    <Label className="text-sm font-medium text-foreground">3. Tekniska krav</Label>
                    <div className="mt-2 space-y-3 text-sm">
                      {/* Bygg & stomme */}
                      {lead.structuredProject.technicalRequirements.construction && (
                        <div>
                          <span className="font-medium text-muted-foreground">Bygg & stomme:</span>
                          <div className="ml-4 mt-1 space-y-1">
                            {Object.entries(lead.structuredProject.technicalRequirements.construction).map(([key, value]) => 
                              value && <div key={key}><span className="capitalize">{key === 'walls' ? 'Väggar' : key === 'floors' ? 'Golv' : key === 'ceiling' ? 'Tak' : key === 'structural' ? 'Bärande' : key === 'surfacing' ? 'Ytskikt' : key}:</span> {value}</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* VVS */}
                      {lead.structuredProject.technicalRequirements.plumbing && (
                        <div>
                          <span className="font-medium text-muted-foreground">VVS:</span>
                          <div className="ml-4 mt-1 space-y-1">
                            {Object.entries(lead.structuredProject.technicalRequirements.plumbing).map(([key, value]) => 
                              value && <div key={key}><span className="capitalize">{key === 'waterSupply' ? 'Vatten/avlopp' : key === 'drains' ? 'Golvbrunn' : key === 'heating' ? 'Värme' : key}:</span> {value}</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* El & styr */}
                      {lead.structuredProject.technicalRequirements.electrical && (
                        <div>
                          <span className="font-medium text-muted-foreground">El & styr:</span>
                          <div className="ml-4 mt-1 space-y-1">
                            {Object.entries(lead.structuredProject.technicalRequirements.electrical).map(([key, value]) => 
                              value && <div key={key}><span className="capitalize">{key === 'outlets' ? 'Uttag' : key === 'panel' ? 'Central' : key === 'lighting' ? 'Belysning' : key === 'floorHeating' ? 'Golvvärme' : key}:</span> {value}</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Ventilation */}
                      {lead.structuredProject.technicalRequirements.ventilation && (
                        <div>
                          <span className="font-medium text-muted-foreground">Ventilation:</span>
                          <div className="ml-4 mt-1 space-y-1">
                            {Object.entries(lead.structuredProject.technicalRequirements.ventilation).map(([key, value]) => 
                              value && <div key={key}><span className="capitalize">{key === 'fans' ? 'Fläktar' : key === 'ducts' ? 'Kanaler' : key === 'airflow' ? 'Luftflöde' : key}:</span> {value}</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Klimatskal / Mark */}
                      {lead.structuredProject.technicalRequirements.building && (
                        <div>
                          <span className="font-medium text-muted-foreground">Klimatskal / Mark:</span>
                          <div className="ml-4 mt-1 space-y-1">
                            {Object.entries(lead.structuredProject.technicalRequirements.building).map(([key, value]) => 
                              value && <div key={key}><span className="capitalize">{key === 'roof' ? 'Tak' : key === 'facade' ? 'Fasad' : key === 'windows' ? 'Fönster' : key === 'drainage' ? 'Dränering' : key === 'foundation' ? 'Grund' : key === 'access' ? 'Åtkomst' : key}:</span> {value}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Tidsram */}
                  <div>
                    <Label className="text-sm font-medium text-foreground">4. Tidsram</Label>
                    <div className="mt-2 space-y-1 text-sm">
                      {lead.structuredProject.timeline.startTime && (
                        <div><span className="font-medium">Starttid:</span> {lead.structuredProject.timeline.startTime}</div>
                      )}
                      {lead.structuredProject.timeline.deadline && (
                        <div><span className="font-medium">Deadline:</span> {lead.structuredProject.timeline.deadline}</div>
                      )}
                      {lead.structuredProject.timeline.restrictions && (
                        <div><span className="font-medium">Restriktioner:</span> {lead.structuredProject.timeline.restrictions}</div>
                      )}
                    </div>
                  </div>

                  {/* 5. Kostnad */}
                  <div>
                    <Label className="text-sm font-medium text-foreground">5. Kostnad</Label>
                    <div className="mt-2 space-y-1 text-sm">
                      {lead.structuredProject.cost.budgetRange && (
                        <div><span className="font-medium">Budget:</span> {lead.structuredProject.cost.budgetRange}</div>
                      )}
                      {lead.structuredProject.cost.financing && (
                        <div><span className="font-medium">Finansiering:</span> {lead.structuredProject.cost.financing}</div>
                      )}
                    </div>
                  </div>

                  {/* 6. Status & risk */}
                  <div>
                    <Label className="text-sm font-medium text-foreground">6. Status & risk</Label>
                    <div className="mt-2 space-y-1 text-sm">
                      {Object.entries(lead.structuredProject.riskAssessment).map(([key, value]) => 
                        value && (
                          <div key={key}>
                            <span className="font-medium capitalize">
                              {key === 'moisture' ? 'Fukt' : 
                               key === 'mold' ? 'Mögel' : 
                               key === 'asbestos' ? 'Asbest' : 
                               key === 'radon' ? 'Radon' : 
                               key === 'heritage' ? 'Kulturklassning' : 
                               key === 'other' ? 'Övrigt' : key}:
                            </span> {value}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Summary (fallback) */}
            {!lead.structuredProject && lead.aiSummary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    AI-genererad sammanfattning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Löpande text</Label>
                    <p className="text-sm leading-relaxed bg-muted p-4 rounded-md mt-1">
                      {lead.aiSummary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chat History */}
            {lead.chatHistory && lead.chatHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat-historik ({lead.chatHistory.length} meddelanden)
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowChatHistory(!showChatHistory)}
                      className="ml-auto"
                    >
                      {showChatHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showChatHistory && (
                  <CardContent>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {lead.chatHistory.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg text-sm ${
                              message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                            }`}>
                              {message.timestamp.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Auto-generated Summary (fallback) */}
            {!lead.aiSummary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Automatisk sammanfattning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed bg-muted p-4 rounded-md">
                    {summary}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="text-xs text-muted-foreground">
              Skapad: {lead.createdAt.toLocaleDateString("sv-SE")} {lead.createdAt.toLocaleTimeString("sv-SE")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};