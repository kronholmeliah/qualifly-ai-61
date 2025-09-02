import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Upload, FileImage, X, CheckCircle, Phone, Mail, MapPin, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Namn måste vara minst 2 tecken'),
  phone: z.string().min(10, 'Telefonnummer måste vara minst 10 siffror'),
  email: z.string().email('Ogiltig e-postadress'),
  address: z.string().min(5, 'Adress måste vara minst 5 tecken'),
  services: z.array(z.string()).min(1, 'Välj minst en tjänst'),
  description: z.string().min(10, 'Beskrivning måste vara minst 10 tecken')
});
type FormData = z.infer<typeof formSchema>;

// Available services
const services = [{
  id: 'badrum',
  label: 'Badrum/Våtrum'
}, {
  id: 'kok',
  label: 'Kök'
}, {
  id: 'tak',
  label: 'Tak'
}, {
  id: 'tillagg',
  label: 'Tillägg/Tillbyggnad'
}, {
  id: 'altan',
  label: 'Altan/Uterum'
}, {
  id: 'malning',
  label: 'Målning'
}, {
  id: 'golv',
  label: 'Golv'
}, {
  id: 'el',
  label: 'El'
}, {
  id: 'vvs',
  label: 'VVS'
}, {
  id: 'finsnickeri',
  label: 'Finsnickeri'
}, {
  id: 'fonsterbyte',
  label: 'Fönsterbyte'
}, {
  id: 'annat',
  label: 'Annat'
}];
interface TraditionalIntakeFormProps {
  onSubmit?: (data: FormData & {
    files: File[];
  }) => void;
}
const TraditionalIntakeForm: React.FC<TraditionalIntakeFormProps> = ({
  onSubmit
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    toast
  } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      services: [],
      description: ''
    }
  });
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    if (files.length + newFiles.length > 5) {
      toast({
        title: "För många filer",
        description: "Du kan ladda upp max 5 filer",
        variant: "destructive"
      });
      return;
    }
    setFiles(prev => [...prev, ...newFiles]);
  };
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  const handleServiceChange = (serviceId: string, checked: boolean) => {
    const currentServices = form.getValues('services');
    if (checked) {
      form.setValue('services', [...currentServices, serviceId]);
    } else {
      form.setValue('services', currentServices.filter(id => id !== serviceId));
    }
  };
  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save to localStorage (same as existing form)
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
        onSubmit({
          ...data,
          files
        });
      }
      setIsSubmitted(true);
      toast({
        title: "Förfrågan skickad!",
        description: "Vi kommer att kontakta dig inom 24 timmar."
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
  if (isSubmitted) {
    return <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted/50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-success/20 to-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Tack för din förfrågan!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Vi har mottagit din offertförfrågan och kommer att kontakta dig inom 24 timmar.
              </p>
              <p className="text-muted-foreground">
                Du kan förvänta dig att höra från oss snart med en personlig offert.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted/50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <User className="w-3 h-3 mr-1" />
            Offertförfrågan
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Be om offert
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Beskriv ditt projekt så kontaktar vi dig med en skräddarsydd offert inom 24 timmar.
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50">
            <CardTitle className="text-2xl text-center">Offertförfrågan</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground border-b border-border/50 pb-2">
                    Kontaktuppgifter
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Namn *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ditt fullständiga namn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="phone" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Telefon *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="070-123 45 67" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            E-post *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="din@email.se" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="address" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Adress *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Gatuadress, Stad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground border-b border-border/50 pb-2">
                    Vilka tjänster är du intresserad av? *
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map(service => <div key={service.id} className="flex items-center space-x-3">
                        <Checkbox id={service.id} onCheckedChange={checked => handleServiceChange(service.id, checked === true)} />
                        <Label htmlFor={service.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                          {service.label}
                        </Label>
                      </div>)}
                  </div>
                  {form.formState.errors.services && <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.services.message}
                    </p>}
                </div>

                {/* Project Description */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground border-b border-border/50 pb-2">
                    Projektbeskrivning
                  </h3>
                  <FormField control={form.control} name="description" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Beskriv ditt projekt *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Berätta mer om ditt projekt, dina önskemål och vad du vill uppnå..." className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>

                {/* File Upload */}
                

                {/* Submit Button */}
                <div className="pt-6 border-t border-border/50">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light">
                    {isSubmitting ? <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Skickar förfrågan...
                      </> : 'SKICKA FÖRFRÅGAN'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default TraditionalIntakeForm;