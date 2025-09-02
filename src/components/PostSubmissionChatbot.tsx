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
  "Tack Anna 🙌 Jag har tagit emot din beskrivning om badrummet på Tallvägen 14. Jag ställer några korta frågor så vi kan förtydliga detaljerna.",
  "Du nämnde att du vill sätta in en ny toalett och duschhörna. Vill du behålla samma placering, eller behöver de flyttas?",
  "Bra att veta 👍 När det gäller golvvärme – vill du ha elgolvvärme eller vattenburen golvvärme?",
  "Perfekt. Vet du om golvbrunnen är gammal och behöver bytas ut i samband med renoveringen?",
  "Tack 🙌 och en sista sag: har du märkt några fuktproblem eller tidigare vattenskador i badrummet?"
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
        const summaryMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Perfekt! Nu har jag en bra bild av ditt badrumsprojekt. Sammanfattning:
          
📍 Adress: ${customerData.address || 'Ej angivet'}
🏠 Rum: Badrum (ca 7 m²)
🚿 Dusch flyttas till andra sidan
🚽 Toalett behålls på nuvarande plats
⚡ Elgolvvärme
🔧 Ny golvbrunn
✅ Inga kända fuktproblem

Vill du att vi bokar en kostnadsfri platsbesök för en exakt offert, eller ska vi skicka en preliminär offert baserat på dessa uppgifter?`,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted/50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <Bot className="w-3 h-3 mr-1" />
            AI-assistent
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Fortsätt med AI-assistenten
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vårt AI hjälper dig att förtydliga detaljerna för en mer exakt offert.
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Bot className="w-6 h-6" />
              Chattkonversation med AI
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'ai' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      {message.sender === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {!isCompleted && questionIndex < AI_QUESTIONS.length && (
              <div className="border-t border-border/50 p-4">
                <div className="flex gap-2">
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Skriv ditt svar här..."
                    className="flex-1"
                    disabled={questionIndex >= AI_QUESTIONS.length}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || questionIndex >= AI_QUESTIONS.length}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="border-t border-border/50 p-6">
                <div className="flex gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Boka platsbesök
                  </Button>
                  <Button variant="outline">
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