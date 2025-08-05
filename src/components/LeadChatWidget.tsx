import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Upload, X, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  content: string;
  options?: string[];
}

interface LeadData {
  serviceType: string;
  scope: string;
  location: string;
  timeframe: string;
  attachments: File[];
  notes: string;
}

interface LeadChatWidgetProps {
  onLeadSubmitted: (leadData: LeadData & { estimatedCost: number }) => void;
}

const CHAT_STEPS = {
  GREETING: "greeting",
  SERVICE_TYPE: "serviceType",
  SCOPE: "scope", 
  LOCATION: "location",
  TIMEFRAME: "timeframe",
  ATTACHMENTS: "attachments",
  NOTES: "notes",
  SUMMARY: "summary"
};

const serviceTypes = [
  "Badrumsrenovering",
  "Köksrenovering", 
  "Helrenovering",
  "Målning & tapetsering",
  "Golvläggning",
  "Elektriker",
  "VVS-arbeten",
  "Annat"
];

const timeframes = [
  "Inom 1 vecka",
  "Inom 2 veckor", 
  "Inom 1 månad",
  "Inom 3 månader",
  "Flexibel/Inget stressade"
];

const costEstimates: Record<string, { min: number; max: number }> = {
  "Badrumsrenovering": { min: 170000, max: 250000 },
  "Köksrenovering": { min: 200000, max: 400000 },
  "Helrenovering": { min: 500000, max: 1200000 },
  "Målning & tapetsering": { min: 15000, max: 40000 },
  "Golvläggning": { min: 25000, max: 80000 },
  "Elektriker": { min: 8000, max: 25000 },
  "VVS-arbeten": { min: 12000, max: 35000 },
  "Annat": { min: 10000, max: 100000 }
};

export const LeadChatWidget: React.FC<LeadChatWidgetProps> = ({ onLeadSubmitted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(CHAT_STEPS.GREETING);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content: "Hej! Jag hjälper dig att få en kostnadskalkyl för ditt projekt. Vad för typ av tjänst behöver du hjälp med?"
    }
  ]);
  
  const [leadData, setLeadData] = useState<LeadData>({
    serviceType: "",
    scope: "",
    location: "",
    timeframe: "",
    attachments: [],
    notes: ""
  });

  const [inputValue, setInputValue] = useState("");

  const addMessage = (content: string, type: "bot" | "user", options?: string[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleServiceTypeSelect = (service: string) => {
    setLeadData(prev => ({ ...prev, serviceType: service }));
    addMessage(service, "user");
    addMessage("Perfekt! Kan du berätta mer om projektets omfattning? Till exempel storlek i m² eller antal rum?", "bot");
    setCurrentStep(CHAT_STEPS.SCOPE);
  };

  const handleScopeSubmit = () => {
    if (!inputValue.trim()) return;
    
    setLeadData(prev => ({ ...prev, scope: inputValue }));
    addMessage(inputValue, "user");
    addMessage("Tack! Var är projektet lokaliserat? Ange stad och gärna postnummer.", "bot");
    setCurrentStep(CHAT_STEPS.LOCATION);
    setInputValue("");
  };

  const handleLocationSubmit = () => {
    if (!inputValue.trim()) return;
    
    setLeadData(prev => ({ ...prev, location: inputValue }));
    addMessage(inputValue, "user");
    addMessage("Bra! När skulle du vilja att projektet startar?", "bot", timeframes);
    setCurrentStep(CHAT_STEPS.TIMEFRAME);
    setInputValue("");
  };

  const handleTimeframeSelect = (timeframe: string) => {
    setLeadData(prev => ({ ...prev, timeframe }));
    addMessage(timeframe, "user");
    addMessage("Har du några ritningar, bilder eller andra dokument som kan hjälpa oss förstå projektet bättre?", "bot");
    setCurrentStep(CHAT_STEPS.ATTACHMENTS);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setLeadData(prev => ({ ...prev, attachments: [...prev.attachments, ...newFiles] }));
    addMessage(`${newFiles.length} fil(er) uppladdade`, "user");
  };

  const continueToNotes = () => {
    addMessage("Slutligen, finns det något specifikt du vill tillägga om projektet?", "bot");
    setCurrentStep(CHAT_STEPS.NOTES);
  };

  const handleNotesSubmit = () => {
    setLeadData(prev => ({ ...prev, notes: inputValue }));
    if (inputValue.trim()) {
      addMessage(inputValue, "user");
    }
    
    const estimatedCost = calculateEstimatedCost();
    addMessage(`Tack för informationen! Baserat på dina uppgifter uppskattar vi kostnaden till cirka ${estimatedCost.toLocaleString("sv-SE")} kr (±10%).`, "bot");
    
    setCurrentStep(CHAT_STEPS.SUMMARY);
    setInputValue("");
    
    // Submit lead data
    onLeadSubmitted({ ...leadData, notes: inputValue, estimatedCost });
  };

  const calculateEstimatedCost = (): number => {
    const estimates = costEstimates[leadData.serviceType];
    if (!estimates) return 50000;
    
    // Calculate middle value with some variation based on scope
    const baseEstimate = (estimates.min + estimates.max) / 2;
    
    // Adjust based on scope if it contains numbers
    const scopeNumbers = leadData.scope.match(/\d+/g);
    if (scopeNumbers && scopeNumbers.length > 0) {
      const size = parseInt(scopeNumbers[0]);
      if (size > 10) {
        return Math.round(baseEstimate * 1.2);
      } else if (size < 5) {
        return Math.round(baseEstimate * 0.8);
      }
    }
    
    return Math.round(baseEstimate);
  };

  const renderChatInput = () => {
    switch (currentStep) {
      case CHAT_STEPS.GREETING:
        return (
          <div className="grid grid-cols-2 gap-2">
            {serviceTypes.map((service) => (
              <Button
                key={service}
                variant="outline"
                size="sm"
                onClick={() => handleServiceTypeSelect(service)}
                className="text-left justify-start h-auto py-2 px-3"
              >
                {service}
              </Button>
            ))}
          </div>
        );

      case CHAT_STEPS.SCOPE:
        return (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="T.ex. 5 m², 2 rum, hela lägenheten..."
              onKeyPress={(e) => e.key === "Enter" && handleScopeSubmit()}
            />
            <Button onClick={handleScopeSubmit} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );

      case CHAT_STEPS.LOCATION:
        return (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="T.ex. Stockholm 11122"
              onKeyPress={(e) => e.key === "Enter" && handleLocationSubmit()}
            />
            <Button onClick={handleLocationSubmit} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );

      case CHAT_STEPS.TIMEFRAME:
        return (
          <div className="grid grid-cols-1 gap-2">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe}
                variant="outline"
                size="sm"
                onClick={() => handleTimeframeSelect(timeframe)}
                className="justify-start"
              >
                {timeframe}
              </Button>
            ))}
          </div>
        );

      case CHAT_STEPS.ATTACHMENTS:
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.dwg"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="flex-1">
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Ladda upp filer
                  </span>
                </Button>
              </label>
            </div>
            {leadData.attachments.length > 0 && (
              <div className="space-y-1">
                {leadData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">{file.name}</Badge>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={continueToNotes} className="w-full">
              Fortsätt
            </Button>
          </div>
        );

      case CHAT_STEPS.NOTES:
        return (
          <div className="space-y-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Beskriv eventuella särskilda önskemål..."
              rows={3}
            />
            <Button onClick={handleNotesSubmit} className="w-full">
              Skicka förfrågan
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-secondary"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
      <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Kostnadskalkyl
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.type === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 rounded-lg text-sm",
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          {currentStep !== CHAT_STEPS.SUMMARY && (
            <div className="pt-2 border-t">
              {renderChatInput()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};