import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { PriceEstimator } from '@/components/ui/price-estimator';
import { 
  ArrowRight, ArrowLeft, CheckCircle, Phone, Mail, MapPin, User, 
  Building, Clock, Shield, Star, Award
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import PostSubmissionChatbot from './PostSubmissionChatbot';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Namn måste vara minst 2 tecken'),
  phone: z.string().min(10, 'Telefonnummer måste vara minst 10 siffror'),
  email: z.string().email('Ogiltig e-postadress'),
  address: z.string().min(5, 'Adress måste vara minst 5 tecken'),
  services: z.array(z.string()).min(1, 'Välj minst en tjänst'),
  description: z.string().min(10, 'Beskrivning måste vara minst 10 tecken'),
  timeline: z.string().optional(),
  budget: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

// Form steps
const steps = [
  { id: 'contact', title: 'Kontakt', description: 'Dina uppgifter' },
  { id: 'project', title: 'Projekt', description: 'Välj tjänster' },
  { id: 'details', title: 'Detaljer', description: 'Beskriv projektet' },
  { id: 'review', title: 'Granska', description: 'Kontrollera & skicka' }
];

// Available services with enhanced data
const services = [
  { id: 'badrum', label: 'Badrumsrenovering', icon: '🚿', description: 'Komplett renovering av badrum' },
  { id: 'kok', label: 'Köksrenovering', icon: '🍳', description: 'Nytt kök från grunden' },
  { id: 'tak-fasad', label: 'Tak & Fasad', icon: '🏠', description: 'Takrenovering och fasadarbeten' },
  { id: 'fonster-dorrar', label: 'Fönster & Dörrar', icon: '🚪', description: 'Byte av fönster och dörrar' },
  { id: 'altan-tillbyggnad', label: 'Altan & Tillbyggnad', icon: '🏗️', description: 'Utbyggnader och altaner' },
  { id: 'nybyggnation', label: 'Nybyggnation', icon: '🏘️', description: 'Helt nya byggnader' },
  { id: 'ovrigt', label: 'Övrigt', icon: '🔧', description: 'Andra renoveringsprojekt' }
];

const timelineOptions = [
  'Inom 1 månad',
  'Inom 3 månader', 
  'Inom 6 månader',
  'Inom 1 år',
  'Bara intresserad av pris'
];

interface ProfessionalIntakeFormProps {
  onSubmit?: (data: FormData & { files: File[] }) => void;
}

const ProfessionalIntakeForm: React.FC<ProfessionalIntakeFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      services: [],
      description: '',
      timeline: '',
      budget: ''
    }
  });

  const watchedServices = form.watch('services');
  const watchedDescription = form.watch('description');

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    const currentServices = form.getValues('services');
    if (checked) {
      form.setValue('services', [...currentServices, serviceId]);
    } else {
      form.setValue('services', currentServices.filter(id => id !== serviceId));
    }
  };

  const nextStep = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = await form.trigger(['name', 'phone', 'email', 'address']);
        break;
      case 2:
        isValid = await form.trigger(['services']);
        break;
      case 3:
        isValid = await form.trigger(['description']);
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      const newLead = {
        id: Date.now().toString(),
        ...data,
        files,
        createdAt: new Date().toISOString(),
        status: 'new',
        score: Math.floor(Math.random() * 100) + 1,
        estimatedCost: Math.floor(Math.random() * 500000) + 50000
      };
      savedLeads.push(newLead);
      localStorage.setItem('leads', JSON.stringify(savedLeads));

      if (onSubmit) {
        onSubmit({ ...data, files });
      }

      setSubmittedData(data);
      setShowChatbot(true);
      
      toast({
        title: "Förfrågan skickad!",
        description: "Vi återkommer med en personlig offert inom 24 timmar."
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Något gick fel. Försök igen senare.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showChatbot && submittedData) {
    return <PostSubmissionChatbot customerData={submittedData} />;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Kontaktuppgifter</h2>
              <p className="text-muted-foreground">Så vi kan återkomma med din personliga offert</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Fullständigt namn *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="För- och efternamn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefonnummer *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="070-123 45 67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      E-postadress *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="din@email.se" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Projektadress *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Gatuadress, Stad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>GDPR-säker hantering</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-primary" />
                <span>4.9/5 i kundbetyg</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Award className="w-4 h-4 text-primary" />
                <span>15+ års erfarenhet</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Välj tjänster</h2>
              <p className="text-muted-foreground">Vad vill du få hjälp med?</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {services.map(service => (
                <div
                  key={service.id}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    const isSelected = watchedServices.includes(service.id);
                    handleServiceChange(service.id, !isSelected);
                  }}
                >
                  <div className={`
                    p-4 rounded-lg border-2 transition-all duration-200
                    ${watchedServices.includes(service.id) 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={watchedServices.includes(service.id)}
                        onCheckedChange={(checked) => handleServiceChange(service.id, checked === true)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xl">{service.icon}</span>
                          <h3 className="font-medium text-foreground">{service.label}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {form.formState.errors.services && (
              <p className="text-sm font-medium text-destructive text-center">
                {form.formState.errors.services.message}
              </p>
            )}

            {/* Timeline selection */}
            <div className="mt-8">
              <Label className="text-base font-medium mb-4 block">När vill du starta projektet?</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {timelineOptions.map(timeline => (
                  <Button
                    key={timeline}
                    type="button"
                    variant={form.watch('timeline') === timeline ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => form.setValue('timeline', timeline)}
                    className="text-xs h-auto py-2"
                  >
                    {timeline}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Projektdetaljer</h2>
              <p className="text-muted-foreground">Berätta mer om ditt projekt</p>
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beskriv ditt projekt i detalj *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Berätta om dina önskemål, mål med projektet, specifika krav eller idéer du har..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File upload */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                Ladda upp bilder eller ritningar (valfritt)
              </Label>
              <FileUpload
                files={files}
                onFilesChange={setFiles}
                maxFiles={5}
                maxSize={10}
              />
            </div>

            {/* Price estimator */}
            {watchedServices.length > 0 && (
              <PriceEstimator
                services={watchedServices}
                description={watchedDescription}
                className="mt-6"
              />
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Granska din förfrågan</h2>
              <p className="text-muted-foreground">Kontrollera att allt ser rätt ut innan du skickar</p>
            </div>

            <div className="space-y-4">
              {/* Contact summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Kontaktuppgifter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Namn:</strong> {form.getValues('name')}</p>
                  <p><strong>Telefon:</strong> {form.getValues('phone')}</p>
                  <p><strong>E-post:</strong> {form.getValues('email')}</p>
                  <p><strong>Adress:</strong> {form.getValues('address')}</p>
                </CardContent>
              </Card>

              {/* Services summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Valda tjänster</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {watchedServices.map(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      return (
                        <Badge key={serviceId} variant="secondary">
                          {service?.icon} {service?.label}
                        </Badge>
                      );
                    })}
                  </div>
                  {form.getValues('timeline') && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Tidsram:</strong> {form.getValues('timeline')}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Description summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Projektbeskrivning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{form.getValues('description')}</p>
                  {files.length > 0 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Bifogade filer:</strong> {files.length} st
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Final price estimate */}
              {watchedServices.length > 0 && (
                <PriceEstimator
                  services={watchedServices}
                  description={watchedDescription}
                />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <Building className="w-3 h-3 mr-1" />
            Professionell offertförfrågan
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Få din personliga offert
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Följ våra enkla steg för att få en skräddarsydd offert anpassad efter ditt projekt
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <ProgressSteps
            steps={steps}
            currentStep={currentStep}
            completedSteps={Array.from({ length: currentStep - 1 }, (_, i) => i + 1)}
          />
        </div>

        {/* Main Form */}
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Föregående</span>
                  </Button>

                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center space-x-2"
                    >
                      <span>Nästa</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Skickar...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Skicka förfrågan</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalIntakeForm;