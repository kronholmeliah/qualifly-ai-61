import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

interface PostSubmissionChatbotProps {
  customerData: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    services?: string[];
    description?: string;
  };
}

const AI_QUESTIONS = [
  "Hej Mats, tack för din förfrågan om badrumsrenovering på Björkvägen 7. Jag ser att du vill ta bort badkaret och sätta in duschväggar – stämmer det?",
  "Förstår. Vill du behålla toaletten och handfatet på samma plats, eller ska de flyttas?",
  "Noterat. När det gäller ventilationen – vill du ha en ny fläkt installerad, eller är det förbättring av befintlig du tänker på?",
  "Bra. Och hur är det med golvvärme – vill du lägga in det i samband med renoveringen?",
  "Perfekt. Vet du om golvbrunnen behöver bytas, eller är den relativt ny?"
];

const PostSubmissionChatbot: React.FC<PostSubmissionChatbotProps> = ({ customerData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add first AI message after a short delay
    const timer = setTimeout(() => {
      if (questionIndex < AI_QUESTIONS.length) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: AI_QUESTIONS[questionIndex],
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [questionIndex]);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');

    // Move to next question or complete
    if (questionIndex < AI_QUESTIONS.length - 1) {
      setTimeout(() => {
        setQuestionIndex(prev => prev + 1);
      }, 1500);
    } else {
      // Show final summary
      setTimeout(() => {
        // Generate structured summary using AI service
        const { generateStructuredProjectSummary } = require('@/utils/aiSummaryService');
        
        // Create mock lead data from customer data and conversation
        const mockLeadData = {
          kund_namn: customerData.name || 'Kund',
          kontakt: customerData.phone || customerData.email || '',
          adress: customerData.address || '',
          projekttyp: 'Badrum',
          status: 'Renovering',
          kort_beskrivning: 'Totalrenovering av badrum med duschväggar',
          elinstallation: 'ja',
          vvs_installation: 'ja',
          golvvärme: 'ja, elgolvvärme',
          rivning: 'ja',
          barande_ingrepp: 'nej',
          bygglov_status: 'ej behövs',
          markarbete: 'nej',
          ovriga_tekniska_krav: 'ny golvbrunn, ventilationsfläkt',
          materialansvar: '',
          materialpreferenser: '',
          stilpreferens: '',
          inspirationsbilder: '',
          tillval: '',
          specialonskemal: '',
          ritning_bifogad: '',
          onskad_start: '',
          deadline: ''
        };
        
        const structuredSummary = generateStructuredProjectSummary(mockLeadData);
        
        let summaryText = "Tack för all information. Vi återkommer till dig inom 24 timmar för att bekräfta projektet och föreslå en tid för platsbesiktning.\n\n";
        
        summaryText += "**Projektinnehåll:**\n";
        structuredSummary.projektinnehall.forEach((punkt, index) => {
          summaryText += `${index + 1}. ${punkt}\n`;
        });
        
        summaryText += "\n**Tekniska krav:**\n";
        Object.entries(structuredSummary.tekniska_krav).forEach(([kategori, status]) => {
          summaryText += `${status} ${kategori}\n`;
        });
        
        summaryText += "\nVill du att vi bokar en kostnadsfri platsbesök för en exakt offert, eller ska vi skicka en preliminär offert baserat på dessa uppgifter?";
        
        const summaryMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: summaryText,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, summaryMessage]);
        setIsCompleted(true);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 py-8 px-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <Badge variant="outline" className="mb-4 bg-background/80 backdrop-blur-sm border-primary/20 text-primary hover:bg-primary/10 transition-all duration-300">
            <Bot className="w-3 h-3 mr-1" />
            AI-assistent
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
            Fortsätt med AI-assistenten
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Vårt AI hjälper dig att förtydliga detaljerna för en mer exakt offert.
          </p>
        </div>

        <Card className="border-border/20 shadow-2xl backdrop-blur-sm bg-background/95 animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border-b border-border/20 backdrop-blur-sm">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary to-secondary">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Chattkonversation med AI
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[28rem] overflow-y-auto p-6 space-y-6 scroll-smooth bg-gradient-to-b from-background/50 to-muted/20">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border border-primary/20 ml-12'
                        : 'bg-gradient-to-r from-background to-muted/50 text-foreground border border-border/20 mr-12'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full flex-shrink-0 ${
                          message.sender === 'ai' 
                            ? 'bg-gradient-to-r from-secondary to-accent' 
                            : 'bg-gradient-to-r from-primary-foreground/20 to-primary-foreground/10'
                        }`}>
                          {message.sender === 'ai' && <Bot className="w-4 h-4 text-secondary-foreground" />}
                          {message.sender === 'user' && <User className="w-4 h-4 text-primary-foreground" />}
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-line font-medium">{message.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {!isCompleted && questionIndex < AI_QUESTIONS.length && (
              <div className="border-t border-border/20 p-6 bg-gradient-to-r from-background/80 to-muted/30 backdrop-blur-sm">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Skriv ditt svar här..."
                      className="pr-4 bg-background/80 backdrop-blur-sm border-border/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 shadow-lg"
                      disabled={questionIndex >= AI_QUESTIONS.length}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || questionIndex >= AI_QUESTIONS.length}
                    size="icon"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="border-t border-border/20 p-8 bg-gradient-to-r from-background/80 to-muted/30 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button className="bg-gradient-to-r from-primary via-secondary to-primary hover:from-primary/90 hover:via-secondary/90 hover:to-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-6 py-3 text-base font-semibold">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Boka platsbesök
                  </Button>
                  <Button variant="outline" className="bg-background/80 backdrop-blur-sm border-border/30 hover:bg-muted/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-3 text-base font-semibold">
                    Skicka preliminär offert
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostSubmissionChatbot;