import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  ChefHat, 
  Bath, 
  Building,
  Plus,
  Hammer,
  Sun,
  Palette,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

// Types
interface FormData {
  // General information
  name: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  description: string;
  timeline: string;
  decisionMaker: string;
  
  // Dynamic fields based on category
  dynamicFields: Record<string, any>;
  files: File[];
}

interface CategoryConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'select' | 'multi-select' | 'text' | 'number';
  options?: string[];
  required?: boolean;
}

// Category configurations
const categories: CategoryConfig[] = [
  {
    id: 'renovering',
    name: 'Renovering',
    icon: <Home className="w-6 h-6" />,
    fields: []
  },
  {
    id: 'nyproduktion',
    name: 'Nyproduktion',
    icon: <Building className="w-6 h-6" />,
    fields: [
      { id: 'type', label: 'Vilken typ av nyproduktion planerar du?', type: 'select', options: ['Villa', 'Attefall', 'Garage', 'Förråd', 'Annat'], required: true },
      { id: 'size', label: 'Hur stor ska byggnaden vara? (ange storlek i m²)', type: 'number', required: true },
      { id: 'floors', label: 'Hur många våningar ska byggnaden ha?', type: 'number', required: true },
      { id: 'drawings', label: 'Har du redan ritningar för projektet?', type: 'select', options: ['Ja, ritningar finns', 'Nej, behöver hjälp med ritningar'], required: true },
      { id: 'permit', label: 'Vad är status på bygglovet?', type: 'select', options: ['Bygglov är klart', 'Bygglov är inskickat', 'Bygglov är inte påbörjat'], required: true },
      { id: 'frame', label: 'Vilken typ av stomme föredrar du?', type: 'select', options: ['Trä', 'Betong', 'Stål', 'Vet inte/osäker'] },
      { id: 'groundwork', label: 'Ska mark- och grundarbete ingå i projektet?', type: 'select', options: ['Ja, inkludera', 'Nej, inte aktuellt'] },
      { id: 'energy', label: 'Vilken energilösning föredrar du?', type: 'select', options: ['Värmepump', 'Solceller', 'Fjärrvärme', 'Vet inte/osäker'] }
    ]
  },
  {
    id: 'tillbyggnad',
    name: 'Tillbyggnad',
    icon: <Plus className="w-6 h-6" />,
    fields: [
      { id: 'type', label: 'Vilken typ av tillbyggnad planerar du?', type: 'select', options: ['Rum', 'Uterum', 'Garage', 'Balkong', 'Annat'], required: true },
      { id: 'size', label: 'Hur stor ska tillbyggnaden vara? (ange storlek i m²)', type: 'number', required: true },
      { id: 'integration', label: 'Vilka installationer behöver integreras i tillbyggnaden?', type: 'multi-select', options: ['Kök', 'Badrum', 'El', 'VVS'] },
      { id: 'foundation', label: 'Behövs grundläggning eller markarbete?', type: 'select', options: ['Ja', 'Nej', 'Osäker'] },
      { id: 'facade', label: 'Hur ska tillbyggnaden förhålla sig till befintlig byggnad?', type: 'select', options: ['Matcha husets stil', 'Avvika från befintlig stil'] },
      { id: 'permit', label: 'Vad är status på bygglovet?', type: 'select', options: ['Bygglov är klart', 'Bygglov behövs', 'Bygglov är på gång'] },
      { id: 'insulation', label: 'Ska isolering, fönster och dörrar ingå?', type: 'select', options: ['Ja, inkludera', 'Nej, inte aktuellt'] }
    ]
  },
  {
    id: 'tak',
    name: 'Tak',
    icon: <Home className="w-6 h-6" />,
    fields: [
      { id: 'scope', label: 'Vilken omfattning har takprojektet?', type: 'select', options: ['Hela taket', 'Delar av taket'], required: true },
      { id: 'currentMaterial', label: 'Vilket material har taket idag?', type: 'select', options: ['Tegel', 'Betong', 'Plåt', 'Papp', 'Vet inte/osäker'] },
      { id: 'materialChange', label: 'Vill du byta material på taket?', type: 'select', options: ['Ja', 'Nej'] },
      { id: 'problems', label: 'Vilka problem finns med taket idag?', type: 'multi-select', options: ['Läckage', 'Dålig isolering', 'Problem med snöras', 'Inga kända problem'] },
      { id: 'metalWork', label: 'Vilka plåtarbeten behövs?', type: 'multi-select', options: ['Rännor', 'Hängrännor', 'Skorstensbeslag'] },
      { id: 'insulation', label: 'Vad gäller isoleringen?', type: 'select', options: ['Behålla befintlig', 'Förbättra isoleringen'] },
      { id: 'access', label: 'Hur ska taket nås under arbetet?', type: 'select', options: ['Ställning', 'Lift', 'Vet inte/osäker'] },
      { id: 'solar', label: 'Är solceller aktuellt?', type: 'select', options: ['Förbereda för solceller', 'Installera solceller', 'Inte aktuellt'] }
    ]
  },
  {
    id: 'kok',
    name: 'Kök',
    icon: <ChefHat className="w-6 h-6" />,
    fields: [
      { id: 'layout', label: 'Vill du behålla eller ändra planlösningen?', type: 'select', options: ['Behålla befintlig planlösning', 'Ändra planlösningen'], required: true },
      { id: 'cabinets', label: 'Vad gäller köksstommarna?', type: 'select', options: ['Behålla befintliga stommar', 'Byta till nya stommar'] },
      { id: 'flooring', label: 'Vad gäller golvet?', type: 'select', options: ['Behålla befintligt golv', 'Byta golv'] },
      { id: 'walls', label: 'Vilka vägg- och takarbeten behövs?', type: 'multi-select', options: ['Målning', 'Kakel', 'Gipsning'] },
      { id: 'electrical', label: 'Vilka elinstallationer behövs?', type: 'multi-select', options: ['Nya uttag', 'Belysning', 'Anslutning för vitvaror'] },
      { id: 'plumbing', label: 'Vilka VVS-arbeten behövs?', type: 'multi-select', options: ['Diskbänk', 'Diskmaskin', 'Flytta vattenledningar'] },
      { id: 'ventilation', label: 'Vad gäller ventilation och fläkt?', type: 'select', options: ['Behålla befintlig', 'Byta till ny'] },
      { id: 'demolition', label: 'Behövs rivning och bortforsling?', type: 'select', options: ['Ja', 'Nej'] }
    ]
  },
  {
    id: 'badrum',
    name: 'Badrum',
    icon: <Bath className="w-6 h-6" />,
    fields: [
      { id: 'scope', label: 'Vilken omfattning har badrumsprojektet?', type: 'select', options: ['Helrenovering', 'Delrenovering'], required: true },
      { id: 'layout', label: 'Vill du behålla eller ändra planlösningen?', type: 'select', options: ['Behålla befintlig planlösning', 'Ändra planlösningen'] },
      { id: 'problems', label: 'Finns det några befintliga problem?', type: 'multi-select', options: ['Fuktproblem', 'Problem med stammar', 'Ventilationsproblem', 'Inga kända problem'] },
      { id: 'drain', label: 'Vad gäller golvbrunnen?', type: 'select', options: ['Behålla befintlig', 'Byta till ny'] },
      { id: 'waterproofing', label: 'Behövs nytt tätskikt?', type: 'select', options: ['Ja, nytt tätskikt', 'Vet inte/osäker'] },
      { id: 'electrical', label: 'Vilka elinstallationer behövs?', type: 'multi-select', options: ['Golvvärme', 'Belysning', 'Uttag'] },
      { id: 'plumbing', label: 'Vilka VVS-arbeten behövs?', type: 'multi-select', options: ['Ny rördragning', 'Blandare', 'Flytta toalett eller dusch'] },
      { id: 'certification', label: 'Behövs intyg för BRF eller försäkring?', type: 'select', options: ['Ja, för BRF/försäkring', 'Nej, inte aktuellt'] }
    ]
  },
  {
    id: 'altan',
    name: 'Altan/Uterum',
    icon: <Sun className="w-6 h-6" />,
    fields: [
      { id: 'type', label: 'Vilken typ av konstruktion planerar du?', type: 'select', options: ['Altan', 'Uterum', 'Terrass', 'Balkong'], required: true },
      { id: 'size', label: 'Hur stor ska konstruktionen vara? (ange storlek i m²)', type: 'number', required: true },
      { id: 'design', label: 'Hur ska konstruktionen utformas?', type: 'select', options: ['Öppen konstruktion', 'Inglasad', 'Med tak'] },
      { id: 'flooring', label: 'Vilket golvmaterial föredrar du?', type: 'select', options: ['Trä', 'Komposit', 'Sten', 'Vet inte/osäker'] },
      { id: 'foundation', label: 'Behövs grundläggning eller stolpar?', type: 'select', options: ['Ja', 'Nej', 'Osäker'] },
      { id: 'railings', label: 'Ska räcken och trappor ingå?', type: 'select', options: ['Ja, inkludera', 'Nej, inte aktuellt'] },
      { id: 'electrical', label: 'Behövs el och belysning?', type: 'select', options: ['Ja', 'Nej'] }
    ]
  },
  {
    id: 'finsnickeri',
    name: 'Finsnickeri',
    icon: <Palette className="w-6 h-6" />,
    fields: [
      { id: 'type', label: 'Vilken typ av finsnickeri handlar det om?', type: 'select', options: ['Trappa', 'Platsbyggd möbel', 'Garderob', 'Panelvägg', 'Annat'], required: true },
      { id: 'drawings', label: 'Finns det ritning eller skiss?', type: 'select', options: ['Ja, ritning finns', 'Nej, behöver hjälp'] },
      { id: 'material', label: 'Vilka material föredrar du?', type: 'select', options: ['Specifikt träslag', 'Lack', 'Färg', 'Vet inte/osäker'] },
      { id: 'measurements', label: 'Beskriv mått och utrymme för projektet', type: 'text' },
      { id: 'electrical', label: 'Behövs el och belysning?', type: 'select', options: ['Ja', 'Nej'] },
      { id: 'installation', label: 'Hur ska montaget ske?', type: 'select', options: ['Montage på plats', 'Endast leverans'] }
    ]
  },
  {
    id: 'annat',
    name: 'Annat',
    icon: <Hammer className="w-6 h-6" />,
    fields: []
  }
];

const timelineOptions = ['<3 mån', '3–6 mån', '>6 mån'];
const decisionMakerOptions = ['Privat', 'BRF', 'Företag', 'Offentlig'];

interface IntakeFormProps {
  onSubmit: (data: FormData) => void;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    category: '',
    description: '',
    timeline: '',
    decisionMaker: '',
    dynamicFields: {},
    files: []
  });

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateDynamicField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      dynamicFields: {
        ...prev.dynamicFields,
        [field]: value
      }
    }));
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true; // Welcome step
      case 1:
        return formData.name && formData.phone && formData.email && formData.address && 
               formData.category && formData.description && formData.timeline && formData.decisionMaker;
      case 2:
        if (!selectedCategory || selectedCategory.fields.length === 0) return true;
        return selectedCategory.fields
          .filter(field => field.required)
          .every(field => formData.dynamicFields[field.id]);
      case 3:
        return true; // Final step
      default:
        return false;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
        <Home className="w-10 h-10 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Välkommen till Aidrin!</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Här kan du beskriva ditt projekt. Det tar bara några minuter.
        </p>
        <p className="text-muted-foreground">
          Dina svar används för att snabbt kunna ge dig en korrekt offert som är skräddarsydd för just ditt projekt.
        </p>
      </div>
    </div>
  );

  const renderGeneralInfo = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Allmänna uppgifter</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Namn *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Ditt namn"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            placeholder="070-123 45 67"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-post *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="din@email.se"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adress/område *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            placeholder="Stockholms län"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Projektkategori *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={formData.category === category.id ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => updateFormData('category', category.id)}
            >
              {category.icon}
              <span className="text-sm">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Kort beskrivning av projektet *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Beskriv ditt projekt i några meningar..."
          maxLength={300}
          rows={3}
        />
        <p className="text-sm text-muted-foreground">
          {formData.description.length}/300 tecken
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Tidsplan för start *</Label>
          <div className="grid gap-2">
            {timelineOptions.map((option) => (
              <Button
                key={option}
                variant={formData.timeline === option ? "default" : "outline"}
                onClick={() => updateFormData('timeline', option)}
                className="justify-start"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Beslutsfattare *</Label>
          <div className="grid gap-2">
            {decisionMakerOptions.map((option) => (
              <Button
                key={option}
                variant={formData.decisionMaker === option ? "default" : "outline"}
                onClick={() => updateFormData('decisionMaker', option)}
                className="justify-start"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDynamicFields = () => {
    if (!selectedCategory || selectedCategory.fields.length === 0) {
      return (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Projektspecifik information</h2>
          <p className="text-muted-foreground">
            Inga ytterligare frågor behövs för denna kategori. Du kan gå vidare eller ladda upp filer.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          {selectedCategory.icon}
          <h2 className="text-2xl font-bold text-foreground">{selectedCategory.name}</h2>
        </div>

        <div className="grid gap-6">
          {selectedCategory.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === 'select' && (
                <div className="grid gap-2">
                  {field.options?.map((option) => (
                    <Button
                      key={option}
                      variant={formData.dynamicFields[field.id] === option ? "default" : "outline"}
                      onClick={() => updateDynamicField(field.id, option)}
                      className="justify-start"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {field.type === 'multi-select' && (
                <div className="grid gap-2">
                  {field.options?.map((option) => {
                    const selectedOptions = formData.dynamicFields[field.id] || [];
                    const isSelected = selectedOptions.includes(option);
                    return (
                      <Button
                        key={option}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => {
                          const current = formData.dynamicFields[field.id] || [];
                          const updated = isSelected
                            ? current.filter((item: string) => item !== option)
                            : [...current, option];
                          updateDynamicField(field.id, updated);
                        }}
                        className="justify-start"
                      >
                        {option}
                        {isSelected && <CheckCircle className="w-4 h-4 ml-auto" />}
                      </Button>
                    );
                  })}
                </div>
              )}

              {field.type === 'text' && (
                <Input
                  id={field.id}
                  value={formData.dynamicFields[field.id] || ''}
                  onChange={(e) => updateDynamicField(field.id, e.target.value)}
                  placeholder={`Ange ${field.label.toLowerCase()}`}
                />
              )}

              {field.type === 'number' && (
                <Input
                  id={field.id}
                  type="number"
                  value={formData.dynamicFields[field.id] || ''}
                  onChange={(e) => updateDynamicField(field.id, e.target.value)}
                  placeholder={`Ange ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFinalStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Nästan klar!</h2>
        <p className="text-muted-foreground mb-6">
          Ladda gärna upp bilder, skisser eller andra filer som kan hjälpa oss förstå ditt projekt bättre.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Ladda upp filer (frivilligt)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
            
            {formData.files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uppladdade filer:</p>
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Ta bort
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sammanfattning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Namn:</strong> {formData.name}</p>
              <p><strong>Telefon:</strong> {formData.phone}</p>
              <p><strong>E-post:</strong> {formData.email}</p>
              <p><strong>Adress:</strong> {formData.address}</p>
            </div>
            <div>
              <p><strong>Kategori:</strong> {selectedCategory?.name}</p>
              <p><strong>Tidsplan:</strong> {formData.timeline}</p>
              <p><strong>Beslutsfattare:</strong> {formData.decisionMaker}</p>
              <p><strong>Filer:</strong> {formData.files.length} st</p>
            </div>
          </div>
          <div>
            <p><strong>Beskrivning:</strong></p>
            <p className="text-muted-foreground">{formData.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Steg {currentStep + 1} av {totalSteps}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {currentStep === 0 && renderWelcomeStep()}
              {currentStep === 1 && renderGeneralInfo()}
              {currentStep === 2 && renderDynamicFields()}
              {currentStep === 3 && renderFinalStep()}
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Tillbaka
            </Button>

            {currentStep < totalSteps - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Nästa
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary"
              >
                Skicka förfrågan
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeForm;