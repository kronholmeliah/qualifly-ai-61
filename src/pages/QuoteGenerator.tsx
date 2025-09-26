import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Save, FileText, Building2, User, Calculator, Settings } from 'lucide-react';
import { loadLeads } from '@/data/leads';
import { generateStructuredProjectSummary } from '@/utils/aiSummaryService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  orgNumber: string;
  vatNumber: string;
}

const QuoteGenerator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [lead, setLead] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('company');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "Ditt Byggföretag AB",
    address: "Byggargatan 123, 123 45 Stockholm",
    phone: "08-123 456 78",
    email: "info@dittbyggforetag.se",
    orgNumber: "556123-4567",
    vatNumber: "SE556123456701"
  });

  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [quoteInfo, setQuoteInfo] = useState({
    quoteNumber: `OFF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    workDescription: '',
    terms: `Offerten gäller i 30 dagar från utfärdandedatum.
Arbetet utförs enligt SS-EN och gällande byggnormer.
ROT-avdrag kan tillämpas enligt gällande regler.
Betalning sker enligt överenskommelse.
Garanti: 5 år på utfört arbete, 2 år på material.`
  });

  useEffect(() => {
    if (id) {
      const allLeads = loadLeads();
      const foundLead = allLeads.find(l => l.id === id);
      if (foundLead) {
        setLead(foundLead);
        generateQuoteContent(foundLead);
      }
    }
  }, [id]);

  const generateQuoteContent = (leadData: any) => {
    const summary = generateStructuredProjectSummary(leadData);
    
    // Generate work description with fallback
    const description = summary?.projektinnehall?.length > 0 
      ? summary.projektinnehall.join(' ')
      : leadData.kort_beskrivning || leadData.projekttyp || 'Byggarbeten enligt överenskommelse';
    setQuoteInfo(prev => ({ ...prev, workDescription: description }));
    
    // Generate quote items based on technical requirements
    const items: QuoteItem[] = [];
    let itemCounter = 1;
    
    if (summary?.tekniska_krav?.["Bygg & stomme"] === "[x]") {
      items.push({
        id: String(itemCounter++),
        description: "Bygg- och stommarbeten",
        quantity: 1,
        unit: "st",
        unitPrice: 85000,
        total: 85000
      });
    }
    
    if (summary?.tekniska_krav?.["VVS"] === "[x]") {
      items.push({
        id: String(itemCounter++),
        description: "VVS-installation",
        quantity: 1,
        unit: "st",
        unitPrice: 45000,
        total: 45000
      });
    }
    
    if (summary?.tekniska_krav?.["El & styr"] === "[x]") {
      items.push({
        id: String(itemCounter++),
        description: "Elinstallation",
        quantity: 1,
        unit: "st",
        unitPrice: 35000,
        total: 35000
      });
    }
    
    if (summary?.tekniska_krav?.["Ventilation & inomhusklimat"] === "[x]") {
      items.push({
        id: String(itemCounter++),
        description: "Ventilation",
        quantity: 1,
        unit: "st",
        unitPrice: 25000,
        total: 25000
      });
    }
    
    if (summary?.tekniska_krav?.["Klimatskal"] === "[x]") {
      items.push({
        id: String(itemCounter++),
        description: "Klimatskal och ytskikt",
        quantity: 1,
        unit: "st",
        unitPrice: 55000,
        total: 55000
      });
    }
    
    if (items.length === 0) {
      items.push({
        id: "1",
        description: leadData.projekttyp || "Byggarbeten",
        quantity: 1,
        unit: "st",
        unitPrice: leadData.estimatedCost || 100000,
        total: leadData.estimatedCost || 100000
      });
    }
    
    setQuoteItems(items);
  };

  const updateQuoteItem = (id: string, field: keyof QuoteItem, value: any) => {
    setQuoteItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const addQuoteItem = () => {
    const newItem: QuoteItem = {
      id: String(Date.now()),
      description: "Nytt arbetsmoment",
      quantity: 1,
      unit: "st",
      unitPrice: 0,
      total: 0
    };
    setQuoteItems(prev => [...prev, newItem]);
  };

  const removeQuoteItem = (id: string) => {
    setQuoteItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return quoteItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * 0.25;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const generatePDF = async () => {
    if (!printRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Offert_${lead?.namn || 'Kund'}_${quoteInfo.quoteNumber}.pdf`);
      
      toast({
        title: "PDF genererad",
        description: "Offerten har exporterats som PDF"
      });
    } catch (error) {
      toast({
        title: "Fel vid PDF-generering",
        description: "Kunde inte skapa PDF-filen",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const saveQuote = () => {
    const quoteData = {
      companyInfo,
      quoteInfo,
      quoteItems,
      lead,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`quote_${id}`, JSON.stringify(quoteData));
    toast({
      title: "Offert sparad",
      description: "Utkastet har sparats lokalt"
    });
  };

  if (!lead) {
    return <div className="container mx-auto py-8">Lead hittades inte</div>;
  }

  const sidebarItems = [
    { id: 'company', label: 'Företag', icon: Building2 },
    { id: 'customer', label: 'Kund', icon: User },
    { id: 'items', label: 'Arbetsmoment', icon: Calculator },
    { id: 'terms', label: 'Villkor', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tillbaka
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Offertgenerator</h1>
                <p className="text-muted-foreground">{lead.namn} - {lead.projekttyp}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={saveQuote}>
                <Save className="h-4 w-4 mr-2" />
                Spara utkast
              </Button>
              <Button onClick={generatePDF} disabled={isGeneratingPDF}>
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? 'Genererar...' : 'Exportera PDF'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-card min-h-screen">
          <div className="p-4">
            <h3 className="font-medium mb-4">Sektioner</h3>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Editor */}
          <div className="flex-1 p-6">
            {activeSection === 'company' && (
              <Card>
                <CardHeader>
                  <CardTitle>Företagsinformation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Företagsnamn</Label>
                      <Input
                        id="companyName"
                        value={companyInfo.name}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="orgNumber">Organisationsnummer</Label>
                      <Input
                        id="orgNumber"
                        value={companyInfo.orgNumber}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, orgNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Adress</Label>
                    <Input
                      id="address"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={companyInfo.phone}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-post</Label>
                      <Input
                        id="email"
                        value={companyInfo.email}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'customer' && (
              <Card>
                <CardHeader>
                  <CardTitle>Kundinformation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Namn</Label>
                      <p className="text-sm bg-muted p-2 rounded">{lead.namn}</p>
                    </div>
                    <div>
                      <Label>Adress</Label>
                      <p className="text-sm bg-muted p-2 rounded">{lead.adress}</p>
                    </div>
                    <div>
                      <Label>Projektbeskrivning</Label>
                      <Textarea
                        value={quoteInfo.workDescription}
                        onChange={(e) => setQuoteInfo(prev => ({ ...prev, workDescription: e.target.value }))}
                        rows={6}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'items' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Arbetsmoment
                    <Button size="sm" onClick={addQuoteItem}>
                      Lägg till rad
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quoteItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <Input
                            value={item.description}
                            onChange={(e) => updateQuoteItem(item.id, 'description', e.target.value)}
                            placeholder="Beskrivning"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuoteItem(item.id, 'quantity', Number(e.target.value))}
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            value={item.unit}
                            onChange={(e) => updateQuoteItem(item.id, 'unit', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateQuoteItem(item.id, 'unitPrice', Number(e.target.value))}
                          />
                        </div>
                        <div className="col-span-1">
                          <span className="text-sm font-medium">
                            {item.total.toLocaleString('sv-SE')} kr
                          </span>
                        </div>
                        <div className="col-span-1">
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => removeQuoteItem(item.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="space-y-2 text-right">
                      <div className="flex justify-between">
                        <span>Summa exkl. moms:</span>
                        <span className="font-medium">{calculateSubtotal().toLocaleString('sv-SE')} kr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Moms (25%):</span>
                        <span className="font-medium">{calculateVAT().toLocaleString('sv-SE')} kr</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Totalt inkl. moms:</span>
                        <span>{calculateTotal().toLocaleString('sv-SE')} kr</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'terms' && (
              <Card>
                <CardHeader>
                  <CardTitle>Villkor och information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quoteNumber">Offertnummer</Label>
                      <Input
                        id="quoteNumber"
                        value={quoteInfo.quoteNumber}
                        onChange={(e) => setQuoteInfo(prev => ({ ...prev, quoteNumber: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="validUntil">Gäller till</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={quoteInfo.validUntil}
                        onChange={(e) => setQuoteInfo(prev => ({ ...prev, validUntil: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="terms">Villkor</Label>
                    <Textarea
                      id="terms"
                      value={quoteInfo.terms}
                      onChange={(e) => setQuoteInfo(prev => ({ ...prev, terms: e.target.value }))}
                      rows={8}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview */}
          <div className="w-96 border-l bg-muted/30 p-4">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ transform: 'scale(0.6)', transformOrigin: 'top' }}>
                <div ref={printRef} className="p-8 bg-white" style={{ width: '595px', minHeight: '842px' }}>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h1 className="text-3xl font-bold text-primary">{companyInfo.name}</h1>
                      <div className="text-sm text-gray-600 mt-2">
                        <p>{companyInfo.address}</p>
                        <p>{companyInfo.phone} | {companyInfo.email}</p>
                        <p>Org.nr: {companyInfo.orgNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-2xl font-bold">OFFERT</h2>
                      <p className="text-sm">Nr: {quoteInfo.quoteNumber}</p>
                      <p className="text-sm">Datum: {new Date().toLocaleDateString('sv-SE')}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-8">
                    <h3 className="font-semibold mb-2">Till:</h3>
                    <div className="text-sm">
                      <p className="font-medium">{lead.namn}</p>
                      <p>{lead.adress}</p>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="mb-8">
                    <h3 className="font-semibold mb-2">Projektbeskrivning:</h3>
                    <p className="text-sm whitespace-pre-line">{quoteInfo.workDescription}</p>
                  </div>

                  {/* Quote Items */}
                  <div className="mb-8">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Beskrivning</th>
                          <th className="text-center py-2">Antal</th>
                          <th className="text-center py-2">Enhet</th>
                          <th className="text-right py-2">à-pris</th>
                          <th className="text-right py-2">Summa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quoteItems.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2">{item.description}</td>
                            <td className="text-center py-2">{item.quantity}</td>
                            <td className="text-center py-2">{item.unit}</td>
                            <td className="text-right py-2">{item.unitPrice.toLocaleString('sv-SE')} kr</td>
                            <td className="text-right py-2">{item.total.toLocaleString('sv-SE')} kr</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={4} className="text-right py-2 font-medium">Summa exkl. moms:</td>
                          <td className="text-right py-2 font-medium">{calculateSubtotal().toLocaleString('sv-SE')} kr</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="text-right py-2">Moms (25%):</td>
                          <td className="text-right py-2">{calculateVAT().toLocaleString('sv-SE')} kr</td>
                        </tr>
                        <tr className="border-t-2">
                          <td colSpan={4} className="text-right py-2 font-bold">Totalt inkl. moms:</td>
                          <td className="text-right py-2 font-bold">{calculateTotal().toLocaleString('sv-SE')} kr</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Terms */}
                  <div className="mb-8">
                    <h3 className="font-semibold mb-2">Villkor:</h3>
                    <p className="text-xs whitespace-pre-line">{quoteInfo.terms}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end">
                    <div className="text-xs">
                      <p>Offerten gäller till: {new Date(quoteInfo.validUntil).toLocaleDateString('sv-SE')}</p>
                    </div>
                    <div className="text-xs text-right">
                      <p>Med vänliga hälsningar</p>
                      <p className="mt-8 border-t border-gray-300 pt-2">{companyInfo.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteGenerator;