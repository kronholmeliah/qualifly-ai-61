import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Euro, FileText, User, MessageSquare } from "lucide-react";
import { Lead } from "@/types/lead";
import { getScoreColor, getScoreEmoji } from "@/utils/leadScoring";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  const navigate = useNavigate();
  const scoreColor = getScoreColor(lead.score);
  const scoreEmoji = getScoreEmoji(lead.score);
  
  const handleClick = () => {
    navigate(`/admin/lead/${lead.id}`);
  };
  
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-card-hover border-l-4 border-l-primary/20"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{lead.serviceType}</h3>
              <Badge 
                variant={scoreColor === "success" ? "default" : scoreColor === "warning" ? "secondary" : "destructive"}
                className="text-xs"
              >
                {scoreEmoji} {lead.score}
              </Badge>
              {lead.hasCompletedChat && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  AI Chat
                </Badge>
              )}
              {lead.structuredProject?.aiSummary && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  🤖 AI Summary
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {lead.customerName || "Okänd kund"}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {lead.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {lead.timeframe}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">
            {lead.status === "new" ? "Ny" : lead.status === "contacted" ? "Kontaktad" : lead.status === "quoted" ? "Offererad" : "Stängd"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Omfattning:</span>
            <span className="text-sm font-medium">{lead.scope}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Uppskattad kostnad:</span>
            <div className="flex items-center gap-1">
              <Euro className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">{(lead.estimatedCost || 0).toLocaleString("sv-SE")} kr</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rekommenderat pris:</span>
            <div className="flex items-center gap-1">
              <Euro className="h-3 w-3 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {(lead.finalPrice || 0).toLocaleString("sv-SE")} kr
              </span>
            </div>
          </div>
          
          {(lead.attachments && lead.attachments.length > 0) && (
            <div className="flex items-center gap-2 pt-2">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {lead.attachments.length} bifogad(e) fil(er)
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};