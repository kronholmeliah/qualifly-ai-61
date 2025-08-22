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
  ArrowLeft,
  MessageCircle,
  Bot
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

interface ConversationQuestion {
  id: string;
  question: string;
  type: 'select' | 'multi-select' | 'text' | 'number';
  options?: string[];
  required?: boolean;
}

interface CategoryConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Conversation questions by category
const conversationQuestions: Record<string, ConversationQuestion[]> = {
  tak: [
    { id: 'scope', question: 'Är det hela taket som ska bytas, eller bara delar av det?', type: 'select', options: ['Hela taket', 'Bara delar av taket'], required: true },
    { id: 'currentMaterial', question: 'Vilket material har ni idag (tegel, betong, plåt, annat)?', type: 'select', options: ['Tegel', 'Betong', 'Plåt', 'Papp', 'Annat/Vet inte'] },
    { id: 'materialChange', question: 'Vill ni behålla samma material eller byta till något annat?', type: 'select', options: ['Behålla samma material', 'Byta till annat material'] },
    { id: 'problems', question: 'Har ni märkt några problem (t.ex. läckage, isolering, snöras)?', type: 'multi-select', options: ['Läckage', 'Dålig isolering', 'Problem med snöras', 'Inga kända problem'] },
    { id: 'metalWork', question: 'Behöver ni byta hängrännor, stuprör eller andra plåtarbeten?', type: 'multi-select', options: ['Hängrännor', 'Stuprör', 'Skorstensbeslag', 'Inget av detta'] },
    { id: 'insulation', question: 'Hur är det med isoleringen – ska den behållas eller förbättras?', type: 'select', options: ['Behålla befintlig isolering', 'Förbättra isoleringen'] },
    { id: 'access', question: 'Är det lätt att komma åt taket för ställning eller lift?', type: 'select', options: ['Lätt åtkomst för ställning', 'Behöver lift', 'Svår åtkomst/osäker'] },
    { id: 'solar', question: 'Vill ni förbereda för solceller, eller installera direkt i samband med takbytet?', type: 'select', options: ['Förbereda för solceller', 'Installera solceller direkt', 'Inte intresserat av solceller'] }
  ],
  kok: [
    { id: 'layout', question: 'Vill ni behålla planlösningen eller ändra den?', type: 'select', options: ['Behålla befintlig planlösning', 'Ändra planlösningen'], required: true },
    { id: 'cabinets', question: 'Ska köksstommarna behållas eller bytas?', type: 'select', options: ['Behålla befintliga stommar', 'Byta till nya stommar'] },
    { id: 'flooring', question: 'Vad gäller golvet i köket?', type: 'select', options: ['Behålla befintligt golv', 'Byta golv'] },
    { id: 'walls', question: 'Vilka vägg- och takarbeten behövs?', type: 'multi-select', options: ['Målning', 'Kakel', 'Gipsning', 'Inget av detta'] },
    { id: 'electrical', question: 'Vilka elarbeten behövs i köket?', type: 'multi-select', options: ['Nya uttag', 'Belysning', 'Vitvaror', 'Inget av detta'] },
    { id: 'plumbing', question: 'Behöver ni VVS-arbeten som diskbänk, diskmaskin eller flytta ledningar?', type: 'multi-select', options: ['Diskbänk', 'Diskmaskin', 'Flytta vattenledningar', 'Inget av detta'] },
    { id: 'ventilation', question: 'Ska ventilation och fläkt behållas eller bytas?', type: 'select', options: ['Behålla befintlig', 'Byta till ny'] },
    { id: 'demolition', question: 'Behövs rivning och bortforsling?', type: 'select', options: ['Ja, behövs', 'Nej, inte aktuellt'] }
  ],
  badrum: [
    { id: 'scope', question: 'Handlar det om en helrenovering eller delrenovering?', type: 'select', options: ['Helrenovering', 'Delrenovering'], required: true },
    { id: 'layout', question: 'Vill ni behålla planlösningen eller ändra den?', type: 'select', options: ['Behålla befintlig planlösning', 'Ändra planlösningen'] },
    { id: 'problems', question: 'Finns det några befintliga problem som fukt, stammar eller ventilation?', type: 'multi-select', options: ['Fuktproblem', 'Problem med stammar', 'Ventilationsproblem', 'Inga kända problem'] },
    { id: 'drain', question: 'Ska golvbrunnen behållas eller bytas?', type: 'select', options: ['Behålla befintlig', 'Byta till ny'] },
    { id: 'waterproofing', question: 'Behövs nytt tätskikt?', type: 'select', options: ['Ja, nytt tätskikt behövs', 'Osäker'] },
    { id: 'electrical', question: 'Vilka elinstallationer behövs (golvvärme, belysning, uttag)?', type: 'multi-select', options: ['Golvvärme', 'Belysning', 'Uttag', 'Inget av detta'] },
    { id: 'plumbing', question: 'Behöver ni VVS-arbeten som rördragning, blandare eller flytta toalett/dusch?', type: 'multi-select', options: ['Ny rördragning', 'Blandare', 'Flytta toalett/dusch', 'Inget av detta'] },
    { id: 'certification', question: 'Behövs intyg för BRF eller försäkring?', type: 'select', options: ['Ja, för BRF/försäkring', 'Nej, inte aktuellt'] }
  ],
  tillbyggnad: [
    { id: 'type', question: 'Vilken typ av tillbyggnad planerar ni?', type: 'select', options: ['Rum', 'Uterum', 'Garage', 'Balkong', 'Annat'], required: true },
    { id: 'size', question: 'Hur stor ska tillbyggnaden vara (ange i m²)?', type: 'number', required: true },
    { id: 'integration', question: 'Vilka installationer behöver integreras (kök, badrum, el, VVS)?', type: 'multi-select', options: ['Kök', 'Badrum', 'El', 'VVS', 'Inget av detta'] },
    { id: 'foundation', question: 'Behövs grundläggning eller markarbete?', type: 'select', options: ['Ja', 'Nej', 'Osäker'] },
    { id: 'facade', question: 'Ska tillbyggnaden matcha husets stil eller avvika?', type: 'select', options: ['Matcha husets stil', 'Avvika från befintlig stil'] },
    { id: 'permit', question: 'Vad är status på bygglovet?', type: 'select', options: ['Bygglov är klart', 'Bygglov behövs', 'Bygglov är på gång'] },
    { id: 'insulation', question: 'Ska isolering, fönster och dörrar ingå?', type: 'select', options: ['Ja, inkludera', 'Nej, inte aktuellt'] }
  ],
  nyproduktion: [
    { id: 'type', question: 'Vilken typ av nyproduktion planerar ni?', type: 'select', options: ['Villa', 'Attefall', 'Garage', 'Förråd', 'Annat'], required: true },
    { id: 'size', question: 'Hur stor ska byggnaden vara (ange i m²)?', type: 'number', required: true },
    { id: 'floors', question: 'Hur många våningar ska byggnaden ha?', type: 'number', required: true },
    { id: 'drawings', question: 'Har ni redan ritningar för projektet?', type: 'select', options: ['Ja, ritningar finns', 'Nej, behöver hjälp med ritningar'], required: true },
    { id: 'permit', question: 'Vad är status på bygglovet?', type: 'select', options: ['Bygglov är klart', 'Bygglov är inskickat', 'Bygglov är inte påbörjat'], required: true },
    { id: 'frame', question: 'Vilken typ av stomme föredrar ni?', type: 'select', options: ['Trä', 'Betong', 'Stål', 'Vet inte/osäker'] },
    { id: 'groundwork', question: 'Ska mark- och grundarbete ingå i projektet?', type: 'select', options: ['Ja, inkludera', 'Nej, inte aktuellt'] },
    { id: 'energy', question: 'Vilken energilösning föredrar ni?', type: 'select', options: ['Värmepump', 'Solceller', 'Fjärrvärme', 'Vet inte/osäker'] }
  ],
  altan: [
    { id: 'type', question: 'Vilken typ av konstruktion planerar ni?', type: 'select', options: ['Altan', 'Uterum', 'Terrass', 'Balkong'], required: true },
    { id: 'size', question: 'Hur stor ska konstruktionen vara (ange i m²)?', type: 'number', required: true },
    { id: 'design', question: 'Hur ska konstruktionen utformas?', type: 'select', options: ['Öppen konstruktion', 'Inglasad', 'Med tak'] },
    { id: 'flooring', question: 'Vilket golvmaterial föredrar ni?', type: 'select', options: ['Trä', 'Komposit', 'Sten', 'Vet inte/osäker'] },
    { id: 'foundation', question: 'Behövs grundläggning eller stolpar?', type: 'select', options: ['Ja', 'Nej', 'Osäker'] },
    { id: 'railings', question: 'Ska räcken och trappor ingå?', type: 'select', options: ['Ja, inkludera', 'Nej, inte aktuellt'] },
    { id: 'electrical', question: 'Behövs el och belysning?', type: 'select', options: ['Ja', 'Nej'] }
  ],
  finsnickeri: [
    { id: 'type', question: 'Vilken typ av finsnickeri handlar det om?', type: 'select', options: ['Trappa', 'Platsbyggd möbel', 'Garderob', 'Panelvägg', 'Annat'], required: true },
    { id: 'drawings', question: 'Finns det ritning eller skiss?', type: 'select', options: ['Ja, ritning finns', 'Nej, behöver hjälp'] },
    { id: 'material', question: 'Vilka material föredrar ni?', type: 'select', options: ['Specifikt träslag', 'Lack', 'Färg', 'Vet inte/osäker'] },
    { id: 'measurements', question: 'Kan ni beskriva mått och utrymme för projektet?', type: 'text' },
    { id: 'electrical', question: 'Behövs el och belysning?', type: 'select', options: ['Ja', 'Nej'] },
    { id: 'installation', question: 'Hur ska montaget ske?', type: 'select', options: ['Montage på plats', 'Endast leverans'] }
  ]
};

// Category configurations
const categories: CategoryConfig[] = [
  {
    id: 'renovering',
    name: 'Renovering',
    icon: <Home className="w-6 h-6" />
  },
  {
    id: 'nyproduktion',
    name: 'Nyproduktion',
    icon: <Building className="w-6 h-6" />
  },
  {
    id: 'tillbyggnad',
    name: 'Tillbyggnad',
    icon: <Plus className="w-6 h-6" />
  },
  {
    id: 'tak',
    name: 'Tak',
    icon: <Home className="w-6 h-6" />
  },
  {
    id: 'kok',
    name: 'Kök',
    icon: <ChefHat className="w-6 h-6" />
  },
  {
    id: 'badrum',
    name: 'Badrum',
    icon: <Bath className="w-6 h-6" />
  },
  {
    id: 'altan',
    name: 'Altan/Uterum',
    icon: <Sun className="w-6 h-6" />
  },
  {
    id: 'finsnickeri',
    name: 'Finsnickeri',
    icon: <Palette className="w-6 h-6" />
  },
  {
    id: 'annat',
    name: 'Annat',
    icon: <Hammer className="w-6 h-6" />
  }
];

const timelineOptions = ['<3 mån', '3–6 mån', '>6 mån'];
const decisionMakerOptions = ['Privat', 'BRF', 'Företag', 'Offentlig'];

interface IntakeFormProps {
  onSubmit: (data: FormData) => void;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInConversation, setIsInConversation] = useState(false);
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
  const currentCategoryQuestions = conversationQuestions[formData.category] || [];
  const currentQuestion = currentCategoryQuestions[currentQuestionIndex];
  
  const progress = isInConversation 
    ? 50 + ((currentQuestionIndex + 1) / (currentCategoryQuestions.length || 1)) * 25
    : ((currentStep + 1) / totalSteps) * 100;

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

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true; // Welcome step
      case 1:
        return formData.name && formData.phone && formData.email && formData.address && 
               formData.category && formData.description && formData.timeline && formData.decisionMaker;
      case 2:
        return true; // Conversation completed or no questions
      case 3:
        return true; // Final step
      default:
        return false;
    }
  };

  const handleStartConversation = () => {
    if (currentCategoryQuestions.length > 0) {
      setIsInConversation(true);
      setCurrentQuestionIndex(0);
    } else {
      setCurrentStep(3); // Skip to summary if no questions
    }
  };

  const handleAnswerQuestion = (answer: any) => {
    if (currentQuestion) {
      updateDynamicField(currentQuestion.id, answer);
      
      // Auto-advance to next question
      setTimeout(() => {
        if (currentQuestionIndex < currentCategoryQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // Conversation completed
          setIsInConversation(false);
          setCurrentStep(3);
        }
      }, 500);
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

  const renderConversationStart = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
        <MessageCircle className="w-10 h-10 text-primary-foreground" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Perfekt! Nu har jag några följdfrågor</h2>
        <p className="text-lg text-muted-foreground mb-6">
          För att kunna ge dig den bästa offerten kommer jag ställa några frågor om ditt {categories.find(c => c.id === formData.category)?.name.toLowerCase()}-projekt.
        </p>
        <p className="text-muted-foreground mb-8">
          Det tar bara några minuter och hjälper oss att förstå exactly vad du behöver.
        </p>
        <Button onClick={handleStartConversation} size="lg" className="gap-2">
          <Bot className="w-5 h-5" />
          Starta konversation
        </Button>
      </div>
    </div>
  );

  const renderConversation = () => {
    if (!currentQuestion) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Aidrin AI</h3>
            <p className="text-sm text-muted-foreground">
              Fråga {currentQuestionIndex + 1} av {currentCategoryQuestions.length}
            </p>
          </div>
        </div>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <p className="text-lg text-foreground mb-6">{currentQuestion.question}</p>

            {currentQuestion.type === 'select' && (
              <div className="grid gap-3">
                {currentQuestion.options?.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    onClick={() => handleAnswerQuestion(option)}
                    className="justify-start text-left h-auto p-4 hover:bg-primary/5"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multi-select' && (
              <div className="grid gap-3">
                {currentQuestion.options?.map((option) => {
                  const currentValues = formData.dynamicFields[currentQuestion.id] || [];
                  const isSelected = currentValues.includes(option);
                  
                  return (
                    <Button
                      key={option}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => {
                        const newValues = isSelected 
                          ? currentValues.filter((v: string) => v !== option)
                          : [...currentValues, option];
                        updateDynamicField(currentQuestion.id, newValues);
                      }}
                      className="justify-start text-left h-auto p-4"
                    >
                      {option}
                    </Button>
                  );
                })}
                <Button 
                  onClick={() => handleAnswerQuestion(formData.dynamicFields[currentQuestion.id] || [])}
                  className="mt-4"
                  disabled={!formData.dynamicFields[currentQuestion.id]?.length}
                >
                  Fortsätt
                </Button>
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <div className="space-y-4">
                <Textarea
                  value={formData.dynamicFields[currentQuestion.id] || ''}
                  onChange={(e) => updateDynamicField(currentQuestion.id, e.target.value)}
                  placeholder="Skriv ditt svar här..."
                  rows={3}
                />
                <Button 
                  onClick={() => handleAnswerQuestion(formData.dynamicFields[currentQuestion.id])}
                  disabled={!formData.dynamicFields[currentQuestion.id]?.trim()}
                >
                  Fortsätt
                </Button>
              </div>
            )}

            {currentQuestion.type === 'number' && (
              <div className="space-y-4">
                <Input
                  type="number"
                  value={formData.dynamicFields[currentQuestion.id] || ''}
                  onChange={(e) => updateDynamicField(currentQuestion.id, e.target.value)}
                  placeholder="Ange siffra..."
                />
                <Button 
                  onClick={() => handleAnswerQuestion(formData.dynamicFields[currentQuestion.id])}
                  disabled={!formData.dynamicFields[currentQuestion.id]}
                >
                  Fortsätt
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFinalStep = () => {
    const selectedCategory = categories.find(cat => cat.id === formData.category);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Tack för dina svar!</h2>
          <p className="text-muted-foreground mb-6">
            Du kan nu ladda upp bilder eller andra filer som kan hjälpa oss förstå ditt projekt bättre.
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
            
            {Object.keys(formData.dynamicFields).length > 0 && (
              <div>
                <p><strong>Projektspecifika svar:</strong></p>
                <div className="space-y-2 mt-2">
                  {Object.entries(formData.dynamicFields).map(([key, value]) => {
                    const question = currentCategoryQuestions.find(q => q.id === key);
                    if (!question || !value) return null;
                    
                    const displayValue = Array.isArray(value) ? value.join(', ') : value;
                    return (
                      <div key={key} className="text-sm">
                        <span className="font-medium">{question.question}</span>
                        <br />
                        <span className="text-muted-foreground">{displayValue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {isInConversation ? 'Konversation pågår' : `Steg ${currentStep + 1} av ${totalSteps}`}
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
              {currentStep === 2 && !isInConversation && renderConversationStart()}
              {currentStep === 2 && isInConversation && renderConversation()}
              {currentStep === 3 && renderFinalStep()}
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            {currentStep > 0 && !isInConversation && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Tillbaka
              </Button>
            )}

            {!isInConversation && currentStep < totalSteps - 1 && currentStep !== 2 && (
              <Button
                onClick={() => {
                  if (currentStep === 1) {
                    setCurrentStep(2);
                  } else {
                    setCurrentStep(prev => prev + 1);
                  }
                }}
                disabled={!canProceed()}
                className="gap-2"
              >
                Nästa
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {currentStep === totalSteps - 1 && (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Skicka ansökan
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeForm;