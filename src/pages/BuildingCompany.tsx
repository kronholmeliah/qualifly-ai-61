import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  CheckCircle, 
  Award,
  Users,
  Calendar,
  Hammer,
  Home,
  Wrench,
  Paintbrush
} from 'lucide-react';

// Declare global Voiceflow types
declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: any) => void;
      };
    };
  }
}

const BuildingCompany = () => {
  useEffect(() => {
    // Load Voiceflow chat widget
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {
      if (window.voiceflow) {
        window.voiceflow.chat.load({
          verify: { projectID: '68a89a73618fdb717f47cb84' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          voice: {
            url: "https://runtime-api.voiceflow.com"
          },
          render: {
            mode: 'embedded',
            target: document.getElementById('voiceflow-chat')
          }
        });
      }
    };
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    
    // Add script to head
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  const services = [
    {
      icon: <Home className="w-6 h-6" />,
      title: "Köksrenovering",
      description: "Kompletta kökslösningar från planering till färdig installation"
    },
    {
      icon: <Paintbrush className="w-6 h-6" />,
      title: "Badrumsrenovering", 
      description: "Moderna badrum med kvalitetsinstallationer och design"
    },
    {
      icon: <Hammer className="w-6 h-6" />,
      title: "Tillbyggnader",
      description: "Utöka ditt hem med professionella tillbyggnadslösningar"
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Allmän renovering",
      description: "Totalrenovering och större ombyggnadsprojekt"
    }
  ];

  const stats = [
    { number: "500+", label: "Nöjda kunder" },
    { number: "15", label: "År i branschen" },
    { number: "98%", label: "Rekommenderar oss" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Nord Bygggruppen</h1>
                <p className="text-sm text-muted-foreground">Professionell byggpartner</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-current" />
                4.9/5
              </Badge>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Ring oss
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Award className="w-3 h-3 mr-1" />
            Certifierat byggföretag
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Ditt drömhem<br />börjar här
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Vi hjälper dig att förverkliga dina byggdrömmar med kvalitet, 
            pålitlighet och professionalism i varje projekt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white">
              Få gratis offert
            </Button>
            <Button variant="outline" size="lg">
              Se våra projekt
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Wrench className="w-3 h-3 mr-1" />
              Våra tjänster
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Komplett byggservice
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Från små renoveringar till stora ombyggnationer - vi har expertis 
              inom alla områden av byggbranschen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300 border-border/50 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white mb-4 group-hover:shadow-glow transition-all duration-300">
                    {service.icon}
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    {service.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <CheckCircle className="w-3 h-3 mr-1" />
                Varför välja oss
              </Badge>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Kvalitet du kan lita på
              </h3>
              <div className="space-y-4">
                {[
                  "15 års erfarenhet av byggprojekt i Stockholmsområdet",
                  "Certifierade hantverkare och projektledare", 
                  "Transparent prissättning utan dolda kostnader",
                  "Fullständig försäkring och garantier på allt arbete",
                  "Miljömedvetet arbetssätt och hållbara material"
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-subtle rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h4 className="text-2xl font-bold mb-2">Professionellt team</h4>
                  <p className="text-muted-foreground">
                    Vårt erfarna team ser till att ditt projekt genomförs 
                    enligt plan och budget.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              AI-assistent
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Prata med vår AI-assistent
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Få svar på dina frågor direkt! Vår AI kan hjälpa dig med information 
              om våra tjänster, priser och bokningar.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50 shadow-elegant bg-card">
              <CardContent className="p-8">
                <div 
                  id="voiceflow-chat" 
                  className="min-h-[500px] w-full rounded-lg bg-background/50"
                >
                  {/* Voiceflow widget will be embedded here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-primary text-white overflow-hidden relative">
            <CardContent className="p-12 text-center relative z-10">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Redo att komma igång?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Kontakta oss idag för en kostnadsfri konsultation. 
                Vi hjälper dig att planera och genomföra ditt drömproject.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                  Boka kostnadsfri konsultation
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Phone className="w-4 h-4 mr-2" />
                  Ring direkt: 08-123 456 78
                </Button>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-glow/90"></div>
          </Card>
        </div>
      </section>

      {/* Contact Info */}
      <footer className="py-12 px-4 border-t bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold mb-3 flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4" />
                Adress
              </h4>
              <p className="text-muted-foreground">
                Byggargatan 123<br />
                123 45 Stockholm
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4" />
                Telefon
              </h4>
              <p className="text-muted-foreground">
                08-123 456 78<br />
                Vardagar 07:00-17:00
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                E-post
              </h4>
              <p className="text-muted-foreground">
                info@nordbygggruppen.se<br />
                offert@nordbygggruppen.se
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default BuildingCompany;