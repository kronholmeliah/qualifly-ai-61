import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  content: string;
  options?: string[];
}

export interface DetailedLeadData {
  // Kunduppgifter
  kund_namn: string;
  kontakt: string;
  adress: string;
  
  // Projekttyp & Status
  projekttyp: string;
  status: string;
  
  // Beskrivning
  kort_beskrivning: string;
  
  // Tekniska detaljer
  elinstallation: string;
  vvs_installation: string;
  golvvärme: string;
  rivning: string;
  barande_ingrepp: string;
  bygglov_status: string;
  markarbete: string;
  ovriga_tekniska_krav: string;
  
  // Material och stil
  materialansvar: string;
  materialpreferenser: string;
  stilpreferens: string;
  inspirationsbilder: string;
  tillval: string;
  specialonskemal: string;
  
  // Planering
  ritning_bifogad: string;
  onskad_start: string;
  deadline: string;
}

interface EnhancedLeadChatWidgetProps {
  onLeadSubmitted: (leadData: { lead: DetailedLeadData }) => void;
}

const CHAT_STEPS = {
  GREETING: "greeting",
  KUND_NAMN: "kund_namn",
  KONTAKT: "kontakt", 
  ADRESS: "adress",
  PROJEKTTYP: "projekttyp",
  STATUS: "status",
  KORT_BESKRIVNING: "kort_beskrivning",
  ELINSTALLATION: "elinstallation",
  VVS_INSTALLATION: "vvs_installation",
  GOLVVÄRME: "golvvärme",
  RIVNING: "rivning",
  BARANDE_INGREPP: "barande_ingrepp",
  BYGGLOV_STATUS: "bygglov_status",
  MARKARBETE: "markarbete",
  OVRIGA_TEKNISKA_KRAV: "ovriga_tekniska_krav",
  MATERIALANSVAR: "materialansvar",
  MATERIALPREFERENSER: "materialpreferenser",
  STILPREFERENS: "stilpreferens",
  INSPIRATIONSBILDER: "inspirationsbilder",
  TILLVAL: "tillval",
  SPECIALONSKEMAL: "specialonskemal",
  RITNING_BIFOGAD: "ritning_bifogad",
  ONSKAD_START: "onskad_start",
  DEADLINE: "deadline",
  SUMMARY: "summary"
};

const projekttyper = [
  "Badrum",
  "Kök", 
  "Altan",
  "Målning",
  "Golvläggning",
  "Elinstallation",
  "VVS-arbeten",
  "Helrenovering",
  "Annat"
];

const statusAlternativ = [
  "Renovering",
  "Nybyggnation"
];

export const EnhancedLeadChatWidget: React.FC<EnhancedLeadChatWidgetProps> = ({ onLeadSubmitted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(CHAT_STEPS.GREETING);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content: "Hej! Jag hjälper dig att skapa ett detaljerat ärende för ditt byggprojekt. Låt oss börja med dina kontaktuppgifter. Vad heter du?"
    }
  ]);
  
  const [leadData, setLeadData] = useState<DetailedLeadData>({
    kund_namn: "",
    kontakt: "",
    adress: "",
    projekttyp: "",
    status: "",
    kort_beskrivning: "",
    elinstallation: "",
    vvs_installation: "",
    golvvärme: "",
    rivning: "",
    barande_ingrepp: "",
    bygglov_status: "",
    markarbete: "",
    ovriga_tekniska_krav: "",
    materialansvar: "",
    materialpreferenser: "",
    stilpreferens: "",
    inspirationsbilder: "",
    tillval: "",
    specialonskemal: "",
    ritning_bifogad: "",
    onskad_start: "",
    deadline: ""
  });

  const [inputValue, setInputValue] = useState("");

  const askAI = async (hint: string, context: DetailedLeadData, chatHistory: ChatMessage[]) => {
    try {
      const response = await fetch('https://zbtgwopsqyicoxnwabsq.functions.supabase.co/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatHistory,
          context,
          hint
        }),
      });

      const data = await response.json();
      
      if (data.reply) {
        return data.reply;
      } else {
        return data.fallback || hint;
      }
    } catch (error) {
      console.error('AI chat error:', error);
      return hint; // Fallback to original question
    }
  };

  const addMessage = (content: string, type: "bot" | "user", options?: string[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const nextStep = () => {
    const steps = Object.values(CHAT_STEPS);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleTextInput = async (field: keyof DetailedLeadData, nextMessage: string) => {
    if (!inputValue.trim()) return;
    
    // Save user's answer
    const updatedLeadData = { ...leadData, [field]: inputValue };
    setLeadData(updatedLeadData);
    addMessage(inputValue, "user");
    
    // Get AI response
    setIsThinking(true);
    const chatHistory = [...messages, { id: Date.now().toString(), type: "user" as const, content: inputValue }];
    const aiResponse = await askAI(nextMessage, updatedLeadData, chatHistory);
    setIsThinking(false);
    
    addMessage(aiResponse, "bot");
    nextStep();
    setInputValue("");
  };

  const handleOptionSelect = async (field: keyof DetailedLeadData, value: string, nextMessage: string, options?: string[]) => {
    // Save user's selection
    const updatedLeadData = { ...leadData, [field]: value };
    setLeadData(updatedLeadData);
    addMessage(value, "user");
    
    // Get AI response
    setIsThinking(true);
    const chatHistory = [...messages, { id: Date.now().toString(), type: "user" as const, content: value }];
    const aiResponse = await askAI(nextMessage, updatedLeadData, chatHistory);
    setIsThinking(false);
    
    addMessage(aiResponse, "bot", options);
    nextStep();
  };

  const skipField = (nextMessage: string) => {
    addMessage("Hoppar över", "user");
    addMessage(nextMessage, "bot");
    nextStep();
  };

  const generateSummary = () => {
    const data = leadData;
    let summary = `${data.kund_namn} vill ${data.status.toLowerCase() === 'renovering' ? 'renovera' : 'bygga nytt'} ${data.projekttyp.toLowerCase()}`;
    
    if (data.adress) {
      summary += ` på ${data.adress}`;
    }
    
    if (data.kort_beskrivning) {
      summary += `. ${data.kort_beskrivning}`;
    }
    
    const tekniskaDetaljer = [];
    if (data.elinstallation && data.elinstallation.toLowerCase().includes('ja')) tekniskaDetaljer.push('el');
    if (data.vvs_installation && data.vvs_installation.toLowerCase().includes('ja')) tekniskaDetaljer.push('VVS');
    if (data.golvvärme && data.golvvärme.toLowerCase().includes('ja')) tekniskaDetaljer.push('golvvärme');
    if (data.barande_ingrepp && data.barande_ingrepp.toLowerCase().includes('ja')) tekniskaDetaljer.push('bärande ingrepp');
    
    if (tekniskaDetaljer.length > 0) {
      summary += ` Projektet omfattar ${tekniskaDetaljer.join(', ')}`;
    }
    
    if (data.onskad_start) {
      summary += `, med start ${data.onskad_start}`;
    }
    
    if (data.deadline) {
      summary += ` och deadline ${data.deadline}`;
    }
    
    summary += '.';
    
    return summary;
  };

  const completeChat = () => {
    const summary = generateSummary();
    addMessage(summary, "bot");
    addMessage("Tack! Ditt ärende har skapats och skickats till huvuddashboarden.", "bot");
    
    setCurrentStep(CHAT_STEPS.SUMMARY);
    
    // Export lead data
    onLeadSubmitted({ lead: leadData });
  };

  const renderChatInput = () => {
    switch (currentStep) {
      case CHAT_STEPS.GREETING:
        return (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ditt namn..."
              onKeyPress={(e) => e.key === "Enter" && handleTextInput("kund_namn", "Tack! Vad är din e-post eller telefonnummer?")}
            />
            <Button onClick={() => handleTextInput("kund_namn", "Tack! Vad är din e-post eller telefonnummer?")} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );

      case CHAT_STEPS.KUND_NAMN:
        return (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Din kontaktinformation..."
              onKeyPress={(e) => e.key === "Enter" && handleTextInput("kontakt", "Perfekt! Vad är adressen för projektet?")}
            />
            <Button onClick={() => handleTextInput("kontakt", "Perfekt! Vad är adressen för projektet?")} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );

      case CHAT_STEPS.KONTAKT:
        return (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Projektadress..."
              onKeyPress={(e) => e.key === "Enter" && handleTextInput("adress", "Nu till projektdetaljerna. Vad för typ av projekt är det?")}
            />
            <Button onClick={() => handleTextInput("adress", "Nu till projektdetaljerna. Vad för typ av projekt är det?")} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );

      case CHAT_STEPS.ADRESS:
        return (
          <div className="grid grid-cols-2 gap-2">
            {projekttyper.map((typ) => (
              <Button
                key={typ}
                variant="outline"
                size="sm"
                onClick={() => handleOptionSelect("projekttyp", typ, "Är det en renovering eller nybyggnation?")}
                className="text-left justify-start h-auto py-2 px-3"
              >
                {typ}
              </Button>
            ))}
          </div>
        );

      case CHAT_STEPS.PROJEKTTYP:
        return (
          <div className="grid grid-cols-1 gap-2">
            {statusAlternativ.map((status) => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                onClick={() => handleOptionSelect("status", status, "Kan du ge en kort beskrivning av projektet?")}
                className="justify-start"
              >
                {status}
              </Button>
            ))}
          </div>
        );

      case CHAT_STEPS.STATUS:
        return (
          <div className="space-y-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Beskriv projektet kort..."
              rows={3}
            />
            <Button onClick={() => handleTextInput("kort_beskrivning", "Behöver projektet ny elinstallation?")} className="w-full">
              Fortsätt
            </Button>
          </div>
        );

      case CHAT_STEPS.KORT_BESKRIVNING:
      case CHAT_STEPS.ELINSTALLATION:
      case CHAT_STEPS.VVS_INSTALLATION:
      case CHAT_STEPS.GOLVVÄRME:
      case CHAT_STEPS.RIVNING:
      case CHAT_STEPS.BARANDE_INGREPP:
      case CHAT_STEPS.BYGGLOV_STATUS:
      case CHAT_STEPS.MARKARBETE:
      case CHAT_STEPS.OVRIGA_TEKNISKA_KRAV:
      case CHAT_STEPS.MATERIALANSVAR:
      case CHAT_STEPS.MATERIALPREFERENSER:
      case CHAT_STEPS.STILPREFERENS:
      case CHAT_STEPS.INSPIRATIONSBILDER:
      case CHAT_STEPS.TILLVAL:
      case CHAT_STEPS.SPECIALONSKEMAL:
      case CHAT_STEPS.RITNING_BIFOGAD:
      case CHAT_STEPS.ONSKAD_START:
      case CHAT_STEPS.DEADLINE:
        return renderGenericInput();

      default:
        return null;
    }
  };

  const renderGenericInput = () => {
    const stepQuestions: Record<string, { field: keyof DetailedLeadData, nextQuestion: string }> = {
      [CHAT_STEPS.ELINSTALLATION]: { field: "elinstallation", nextQuestion: "Behöver projektet VVS-installation?" },
      [CHAT_STEPS.VVS_INSTALLATION]: { field: "vvs_installation", nextQuestion: "Ska det installeras golvvärme?" },
      [CHAT_STEPS.GOLVVÄRME]: { field: "golvvärme", nextQuestion: "Behöver något rivas?" },
      [CHAT_STEPS.RIVNING]: { field: "rivning", nextQuestion: "Innebär projektet bärande ingrepp?" },
      [CHAT_STEPS.BARANDE_INGREPP]: { field: "barande_ingrepp", nextQuestion: "Vad är status för bygglov?" },
      [CHAT_STEPS.BYGGLOV_STATUS]: { field: "bygglov_status", nextQuestion: "Behövs markarbete?" },
      [CHAT_STEPS.MARKARBETE]: { field: "markarbete", nextQuestion: "Finns det andra tekniska krav?" },
      [CHAT_STEPS.OVRIGA_TEKNISKA_KRAV]: { field: "ovriga_tekniska_krav", nextQuestion: "Vem ansvarar för material?" },
      [CHAT_STEPS.MATERIALANSVAR]: { field: "materialansvar", nextQuestion: "Har du några materialpreferenser?" },
      [CHAT_STEPS.MATERIALPREFERENSER]: { field: "materialpreferenser", nextQuestion: "Vilken stil önskar du?" },
      [CHAT_STEPS.STILPREFERENS]: { field: "stilpreferens", nextQuestion: "Har du inspirationsbilder?" },
      [CHAT_STEPS.INSPIRATIONSBILDER]: { field: "inspirationsbilder", nextQuestion: "Finns det tillval du önskar?" },
      [CHAT_STEPS.TILLVAL]: { field: "tillval", nextQuestion: "Har du några speciella önskemål?" },
      [CHAT_STEPS.SPECIALONSKEMAL]: { field: "specialonskemal", nextQuestion: "Har du ritningar bifogade?" },
      [CHAT_STEPS.RITNING_BIFOGAD]: { field: "ritning_bifogad", nextQuestion: "När önskar du start?" },
      [CHAT_STEPS.ONSKAD_START]: { field: "onskad_start", nextQuestion: "Finns det en deadline?" },
      [CHAT_STEPS.DEADLINE]: { field: "deadline", nextQuestion: "" }
    };

    const stepData = stepQuestions[currentStep];
    if (!stepData) return null;

    const isLastStep = currentStep === CHAT_STEPS.DEADLINE;

    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ditt svar..."
            onKeyPress={(e) => e.key === "Enter" && (isLastStep ? completeChat() : handleTextInput(stepData.field, stepData.nextQuestion))}
          />
          <Button onClick={isLastStep ? completeChat : () => handleTextInput(stepData.field, stepData.nextQuestion)} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => isLastStep ? completeChat() : skipField(stepData.nextQuestion)}
          className="w-full"
        >
          Hoppa över
        </Button>
      </div>
    );
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
              Skapa Lead
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
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground px-3 py-2 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  AI skriver...
                </div>
              </div>
            </div>
          )}
          
          {currentStep !== CHAT_STEPS.SUMMARY && !isThinking && (
            <div className="pt-2 border-t">
              {renderChatInput()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};