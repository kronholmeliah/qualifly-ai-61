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
  Calculator
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

            {/* Auto-generated Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sammanfattning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed bg-muted p-4 rounded-md">
                  {summary}
                </p>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground">
              Skapad: {lead.createdAt.toLocaleDateString("sv-SE")} {lead.createdAt.toLocaleTimeString("sv-SE")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};