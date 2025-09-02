import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LeadCard } from "./LeadCard";
import { LeadDetailModal } from "./LeadDetailModal";
import { Lead } from "@/types/lead";
import { 
  Search, 
  Filter, 
  SortAsc, 
  Users, 
  TrendingUp, 
  Euro,
  Calendar
} from "lucide-react";

interface LeadDashboardProps {
  leads: Lead[];
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
}

type SortField = "score" | "estimatedCost" | "createdAt" | "finalPrice";
type SortOrder = "asc" | "desc";

export const LeadDashboard: React.FC<LeadDashboardProps> = ({ leads, onUpdateLead }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredAndSortedLeads = leads
    .filter((lead) => {
      const matchesSearch = 
        (lead.serviceType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.scope || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.customerName || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      
      const matchesScore = 
        scoreFilter === "all" ||
        (scoreFilter === "high" && lead.score >= 80) ||
        (scoreFilter === "medium" && lead.score >= 60 && lead.score < 80) ||
        (scoreFilter === "low" && lead.score < 60);
      
      return matchesSearch && matchesStatus && matchesScore;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "score":
          comparison = a.score - b.score;
          break;
        case "estimatedCost":
          comparison = a.estimatedCost - b.estimatedCost;
          break;
        case "finalPrice":
          comparison = a.finalPrice - b.finalPrice;
          break;
        case "createdAt":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }
      
      return sortOrder === "desc" ? -comparison : comparison;
    });

  const stats = {
    total: leads.length,
    highScore: leads.filter(l => l.score >= 80).length,
    totalValue: leads.reduce((sum, lead) => sum + lead.finalPrice, 0),
    totalProfit: leads.reduce((sum, lead) => sum + (lead.finalPrice - lead.estimatedCost), 0),
    avgScore: leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length) : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Lead Dashboard
          </h1>
          <p className="text-muted-foreground">Hantera och prioritera inkommande förfrågningar</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.highScore} högprioriterade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genomsnittlig Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}</div>
            <p className="text-xs text-muted-foreground">
              av 100 möjliga
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Försäljningspotential</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalValue.toLocaleString("sv-SE")} kr
            </div>
            <p className="text-xs text-muted-foreground">
              varav {stats.totalProfit.toLocaleString("sv-SE")} kr vinst
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Senaste Lead</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.length > 0 ? "Idag" : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {leads.length > 0 ? leads[0]?.createdAt.toLocaleTimeString("sv-SE") : "Inga leads än"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter & Sortering</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sök på tjänst, plats eller omfattning..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla status</SelectItem>
                <SelectItem value="new">Nya</SelectItem>
                <SelectItem value="contacted">Kontaktade</SelectItem>
                <SelectItem value="quoted">Offererade</SelectItem>
                <SelectItem value="closed">Stängda</SelectItem>
              </SelectContent>
            </Select>

            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla scores</SelectItem>
                <SelectItem value="high">Hög (80+)</SelectItem>
                <SelectItem value="medium">Medium (60-79)</SelectItem>
                <SelectItem value="low">Låg (&lt;60)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortField}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split("-");
              setSortField(field as SortField);
              setSortOrder(order as SortOrder);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sortera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score-desc">Score (hög → låg)</SelectItem>
                <SelectItem value="score-asc">Score (låg → hög)</SelectItem>
                <SelectItem value="finalPrice-desc">Pris (hög → låg)</SelectItem>
                <SelectItem value="finalPrice-asc">Pris (låg → hög)</SelectItem>
                <SelectItem value="createdAt-desc">Datum (ny → gammal)</SelectItem>
                <SelectItem value="createdAt-asc">Datum (gammal → ny)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAndSortedLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => setSelectedLead(lead)}
          />
        ))}
      </div>

      {filteredAndSortedLeads.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Inga leads hittades</h3>
            <p className="text-muted-foreground">
              {leads.length === 0 
                ? "Inga leads har skapats än."
                : "Prova att ändra filter eller sökterm för att hitta leads."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateLead={onUpdateLead}
      />
    </div>
  );
};