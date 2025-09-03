import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lead } from "@/types/lead";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Search, 
  Filter,
  MoreHorizontal,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Home,
  Wrench,
  Palette
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ModernDashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    // Load leads from localStorage
    const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    console.log('ModernDashboard: Loaded leads from localStorage:', savedLeads.length, 'leads');
    console.log('ModernDashboard: Lead IDs found:', savedLeads.map((l: any) => l.id));
    
    if (savedLeads.length === 0) {
      // Create complete example leads if none exist
      const exampleLeads: Lead[] = [
        {
          id: "lead-001",
          serviceType: "Badrumsrenovering",
          scope: "Helrenovering",
          location: "Stockholm",
          timeframe: "Inom 2 veckor",
          notes: "Komplett badrumsrenovering med nya vitvaror och kakel",
          attachments: [],
          estimatedCost: 150000,
          score: 85,
          margin: 20,
          finalPrice: 180000,
          createdAt: new Date("2024-01-15"),
          status: "new" as const,
          customerName: "Sara Andersson",
          customerContact: "sara.andersson@email.com",
          customerAddress: "Köpmansgatan 4, 111 31 Stockholm",
          detailedDescription: "Komplett badrumsrenovering med moderna lösningar",
          projectType: "Badrum",
          renovationType: "Renovering"
        },
        {
          id: "lead-002",
          serviceType: "Köksrenovering", 
          scope: "Komplett renovering",
          location: "Göteborg",
          timeframe: "Inom 1 månad",
          notes: "Stort kök med öppning mot vardagsrum, nya vitvaror",
          attachments: [],
          estimatedCost: 200000,
          score: 65,
          margin: 25,
          finalPrice: 250000,
          createdAt: new Date("2024-01-12"),
          status: "contacted" as const,
          customerName: "Erik Johansson",
          customerContact: "erik.j@gmail.com",
          customerAddress: "Vasagatan 12, 411 24 Göteborg",
          detailedDescription: "Köksrenovering med öppen planlösning",
          projectType: "Kök",
          renovationType: "Renovering"
        },
        {
          id: "lead-003",
          serviceType: "Målning & tapetsering",
          scope: "Vardagsrum och sovrum",
          location: "Malmö",
          timeframe: "Inom 1 vecka",
          notes: "Snabbt jobb, måla om två rum",
          attachments: [],
          estimatedCost: 25000,
          score: 90,
          margin: 40,
          finalPrice: 35000,
          createdAt: new Date("2024-01-18"),
          status: "new" as const,
          customerName: "Anna Nilsson",
          customerContact: "070-123-4567",
          customerAddress: "Storgatan 8, 211 34 Malmö",
          detailedDescription: "Målning inför försäljning",
          projectType: "Målning",
          renovationType: "Renovering"
        },
        {
          id: "lead-004", 
          serviceType: "Helrenovering",
          scope: "Komplett lägenhet",
          location: "Uppsala",
          timeframe: "Flexibel/Inget stressade",
          notes: "Total renovering av 3:a, inget stressat",
          attachments: [],
          estimatedCost: 350000,
          score: 40,
          margin: 28,
          finalPrice: 450000,
          createdAt: new Date("2024-01-10"),
          status: "quoted" as const,
          customerName: "Michael Berg",
          customerContact: "m.berg@company.se", 
          customerAddress: "Parkvägen 15, 752 37 Uppsala",
          detailedDescription: "3-rumslägenhet från 1960-talet, 75 m², kräver totalrenovering",
          projectType: "Helrenovering",
          renovationType: "Renovering"
        },
        {
          id: "lead-mats",
          serviceType: "Badrumsrenovering",
          scope: "Badrumsrenovering med duschinstallation, ny fläkt och elgolvvärme",
          location: "Lerum",
          timeframe: "Inom 2 veckor",
          notes: "Chat genomförd med AI-assistent",
          attachments: [],
          estimatedCost: 120000,
          score: 78,
          margin: 25,
          finalPrice: 150000,
          createdAt: new Date("2024-01-19"),
          status: "new" as const,
          customerName: "Mats Nilsson",
          customerContact: "mats.svensson@email.com",
          customerAddress: "Björkvägen 7, Lerum",
          detailedDescription: "Totalrenovering av 9 m² badrum i Lerum. Ta bort badkar och installera duschväggar, flytta handfat närmare dörren, ny ventilationsfläkt och elgolvvärme.",
          projectType: "Badrum",
          renovationType: "Renovering",
          hasCompletedChat: true
        },
        {
          id: "lead-005",
          serviceType: "VVS-arbeten", 
          scope: "Nytt badrum",
          location: "Västerås",
          timeframe: "Inom 3 månader",
          notes: "VVS för nytt badrum i källare",
          attachments: [],
          estimatedCost: 75000,
          score: 70,
          margin: 26,
          finalPrice: 95000,
          createdAt: new Date("2024-01-14"),
          status: "contacted" as const,
          customerName: "Lena Gustafsson",
          customerContact: "lena.g@hotmail.com",
          customerAddress: "Björkvägen 22, 722 13 Västerås",
          detailedDescription: "Installation av nytt badrum i villas källare",
          projectType: "VVS-arbeten",
          renovationType: "Nybyggnation"
        }
      ];
      
      setLeads(exampleLeads);
      localStorage.setItem('leads', JSON.stringify(exampleLeads));
    } else {
      const leadsWithDates = savedLeads.map((lead: any) => ({
        ...lead,
        createdAt: new Date(lead.createdAt)
      }));
      setLeads(leadsWithDates);
    }
  }, []);

  const resetToExampleData = () => {
    const exampleLeads: Lead[] = [
      {
        id: "lead-001",
        serviceType: "Badrumsrenovering",
        scope: "Helrenovering",
        location: "Stockholm",
        timeframe: "Inom 2 veckor",
        notes: "Komplett badrumsrenovering med nya vitvaror och kakel",
        attachments: [],
        estimatedCost: 150000,
        score: 85,
        margin: 20,
        finalPrice: 180000,
        createdAt: new Date("2024-01-15"),
        status: "new" as const,
        customerName: "Sara Andersson",
        customerContact: "sara.andersson@email.com",
        customerAddress: "Köpmansgatan 4, 111 31 Stockholm",
        detailedDescription: "Komplett badrumsrenovering med moderna lösningar",
        projectType: "Badrum",
        renovationType: "Renovering"
      },
      {
        id: "lead-002",
        serviceType: "Köksrenovering", 
        scope: "Komplett renovering",
        location: "Göteborg",
        timeframe: "Inom 1 månad",
        notes: "Stort kök med öppning mot vardagsrum, nya vitvaror",
        attachments: [],
        estimatedCost: 200000,
        score: 65,
        margin: 25,
        finalPrice: 250000,
        createdAt: new Date("2024-01-12"),
        status: "contacted" as const,
        customerName: "Erik Johansson",
        customerContact: "erik.j@gmail.com",
        customerAddress: "Vasagatan 12, 411 24 Göteborg",
        detailedDescription: "Köksrenovering med öppen planlösning",
        projectType: "Kök",
        renovationType: "Renovering"
      },
      {
        id: "lead-003",
        serviceType: "Målning & tapetsering",
        scope: "Vardagsrum och sovrum",
        location: "Malmö",
        timeframe: "Inom 1 vecka",
        notes: "Snabbt jobb, måla om två rum",
        attachments: [],
        estimatedCost: 25000,
        score: 90,
        margin: 40,
        finalPrice: 35000,
        createdAt: new Date("2024-01-18"),
        status: "new" as const,
        customerName: "Anna Nilsson",
        customerContact: "070-123-4567",
        customerAddress: "Storgatan 8, 211 34 Malmö",
        detailedDescription: "Målning inför försäljning",
        projectType: "Målning",
        renovationType: "Renovering"
      },
      {
        id: "lead-004", 
        serviceType: "Helrenovering",
        scope: "Komplett lägenhet",
        location: "Uppsala",
        timeframe: "Flexibel/Inget stressade",
        notes: "Total renovering av 3:a, inget stressat",
        attachments: [],
        estimatedCost: 350000,
        score: 40,
        margin: 28,
        finalPrice: 450000,
        createdAt: new Date("2024-01-10"),
        status: "quoted" as const,
        customerName: "Michael Berg",
        customerContact: "m.berg@company.se", 
        customerAddress: "Parkvägen 15, 752 37 Uppsala",
        detailedDescription: "3-rumslägenhet från 1960-talet, 75 m², kräver totalrenovering",
        projectType: "Helrenovering",
        renovationType: "Renovering"
      },
      {
        id: "lead-mats",
        serviceType: "Badrumsrenovering",
        scope: "Ta bort badkar, installera duschväggar",
        location: "Lerum",
        timeframe: "Inom 2 veckor",
        notes: "Chat genomförd med AI-assistent",
        attachments: [],
        estimatedCost: 120000,
        score: 78,
        margin: 25,
        finalPrice: 150000,
        createdAt: new Date("2024-01-19"),
        status: "new" as const,
        customerName: "Mats Nilsson",
        customerContact: "mats.svensson@email.com",
        customerAddress: "Björkvägen 7, Lerum",
        detailedDescription: "Mats Nilsson har skickat in en förfrågan om totalrenovering av sitt cirka 9 m² stora badrum i Lerum. Han vill ta bort det befintliga badkaret och istället sätta in duschväggar samt en ny kommod. Toaletten kan stå kvar på sin nuvarande plats, men handfatet ska flyttas närmare dörren. Ventilationen fungerar dåligt och Mats vill därför installera en ny fläkt. Han önskar även elgolvvärme i golvet och byte av den gamla golvbrunnen.",
        projectType: "Badrum",
        renovationType: "Renovering",
        hasCompletedChat: true
      },
      {
        id: "lead-005",
        serviceType: "VVS-arbeten", 
        scope: "Nytt badrum",
        location: "Västerås",
        timeframe: "Inom 3 månader",
        notes: "VVS för nytt badrum i källare",
        attachments: [],
        estimatedCost: 75000,
        score: 70,
        margin: 26,
        finalPrice: 95000,
        createdAt: new Date("2024-01-14"),
        status: "contacted" as const,
        customerName: "Lena Gustafsson",
        customerContact: "lena.g@hotmail.com",
        customerAddress: "Björkvägen 22, 722 13 Västerås",
        detailedDescription: "Installation av nytt badrum i villas källare",
        projectType: "VVS-arbeten",
        renovationType: "Nybyggnation"
      }
    ];
    
    localStorage.clear();
    localStorage.setItem('leads', JSON.stringify(exampleLeads));
    setLeads(exampleLeads);
    toast({
      title: "Data återställd",
      description: "Alla leads har återställts till exempeldata med Mats Nilsson inkluderad."
    });
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    const matchesScore = scoreFilter === "all" || 
                        (scoreFilter === "high" && lead.score >= 80) ||
                        (scoreFilter === "medium" && lead.score >= 50 && lead.score < 80) ||
                        (scoreFilter === "low" && lead.score < 50);
    
    return matchesSearch && matchesStatus && matchesScore;
  });

  // Calculate stats
  const totalLeads = leads.length;
  const highPriorityLeads = leads.filter(l => l.score >= 80).length;
  const totalPotential = leads.reduce((sum, lead) => sum + (lead.finalPrice || 0), 0);
  const avgScore = leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "contacted": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "quoted": return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      case "closed": return "bg-green-500/10 text-green-700 border-green-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getProjectIcon = (projectType: string) => {
    switch (projectType?.toLowerCase()) {
      case "badrum": return <Home className="h-4 w-4" />;
      case "kök": return <Wrench className="h-4 w-4" />;
      case "målning": return <Palette className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const handleUpdateStatus = (leadId: string, newStatus: "new" | "contacted" | "quoted" | "closed") => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    
    toast({
      title: "Status uppdaterad",
      description: `Lead-status ändrad till ${newStatus}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Modern Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Hantera dina leads med stil och effektivitet
              </p>
            </div>
            <Button 
              onClick={resetToExampleData}
              variant="outline"
              className="w-fit"
            >
              Återställ Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Totala Leads
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalLeads}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {highPriorityLeads} högprioriterade
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Genomsnittlig Score
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">{avgScore}</div>
              <Progress value={avgScore} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Total Potential
              </CardTitle>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {(totalPotential / 1000).toFixed(0)}k kr
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Uppskattad omsättning
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Senaste Lead
              </CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">Idag</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {leads.length > 0 ? leads[leads.length - 1]?.customerName : "Inga leads"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Sök
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Sök på kund, tjänst eller plats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla status</SelectItem>
                  <SelectItem value="new">Ny</SelectItem>
                  <SelectItem value="contacted">Kontaktad</SelectItem>
                  <SelectItem value="quoted">Offererad</SelectItem>
                  <SelectItem value="closed">Stängd</SelectItem>
                </SelectContent>
              </Select>

              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla scores</SelectItem>
                  <SelectItem value="high">Hög (80+)</SelectItem>
                  <SelectItem value="medium">Medium (50-79)</SelectItem>
                  <SelectItem value="low">Låg (&lt;50)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <Card 
              key={lead.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(`/admin/lead/${lead.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {lead.customerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{lead.customerName}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getProjectIcon(lead.projectType)}
                        <span>{lead.serviceType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-1 text-sm font-semibold ${getScoreColor(lead.score)}`}>
                      <Star className="h-4 w-4" />
                      {lead.score}
                    </div>
                    <Badge className={`text-xs ${getStatusColor(lead.status)}`}>
                      {lead.status === "new" ? "Ny" :
                       lead.status === "contacted" ? "Kontaktad" :
                       lead.status === "quoted" ? "Offererad" :
                       lead.status === "closed" ? "Stängd" : "Okänd"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{lead.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{lead.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{lead.customerContact}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Omfattning:</div>
                  <div className="text-sm text-muted-foreground">{lead.scope}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-lg font-bold text-primary">
                    {(lead.finalPrice || lead.estimatedCost).toLocaleString()} kr
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Inga leads hittades</h3>
              <p className="text-muted-foreground text-center">
                Inga leads matchar dina sökkriterier. Prova att ändra filtren eller sökorden.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ModernDashboard;