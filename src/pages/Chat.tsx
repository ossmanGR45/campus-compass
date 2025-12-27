import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Ticket, 
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { ChatMessage, FAQ } from '@/types';
import { mockFAQs } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Simple RAG-like search function
const searchFAQs = (query: string): FAQ[] => {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(' ').filter(w => w.length > 2);
  
  return mockFAQs
    .map(faq => {
      let score = 0;
      const content = `${faq.question} ${faq.answer} ${faq.tags.join(' ')}`.toLowerCase();
      
      keywords.forEach(keyword => {
        if (content.includes(keyword)) score += 1;
        if (faq.question.toLowerCase().includes(keyword)) score += 2;
        if (faq.tags.some(tag => tag.includes(keyword))) score += 1.5;
      });
      
      return { faq, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.faq);
};

const generateResponse = (query: string, relevantFAQs: FAQ[]): string => {
  if (relevantFAQs.length === 0) {
    return "I couldn't find a specific answer to your question in our knowledge base. However, I'd be happy to help you create a support ticket so our team can assist you directly. Would you like me to do that?";
  }

  const bestMatch = relevantFAQs[0];
  let response = `Based on your question, here's what I found:\n\n**${bestMatch.question}**\n\n${bestMatch.answer}`;

  if (relevantFAQs.length > 1) {
    response += "\n\n---\n\n*You might also find these helpful:*\n";
    relevantFAQs.slice(1).forEach(faq => {
      response += `\n• ${faq.question}`;
    });
  }

  return response;
};

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your CampusHelp AI assistant. 👋\n\nI can help you with questions about:\n• IT & Wi-Fi support\n• Course registration\n• Library services\n• Financial aid\n• Housing & more\n\nWhat can I help you with today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const relevantFAQs = searchFAQs(inputValue);
    const response = generateResponse(inputValue, relevantFAQs);

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      sources: relevantFAQs.length > 0 ? relevantFAQs : undefined,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "How do I connect to campus Wi-Fi?",
    "How do I add or drop a course?",
    "What are the library hours?",
    "How do I apply for financial aid?"
  ];

  return (
    <>
      <Helmet>
        <title>AI Assistant - CampusHelp</title>
        <meta name="description" content="Get instant answers to your campus questions with our AI-powered assistant." />
      </Helmet>
      <Layout>
        <div className="container py-6 h-[calc(100vh-8rem)]">
          <div className="grid lg:grid-cols-4 gap-6 h-full">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <Card className="h-full">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Quick Questions
                  </h3>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(question)}
                        className="w-full text-left text-sm p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="font-semibold mb-4">Need More Help?</h3>
                    <Link to="/tickets/new">
                      <Button variant="outline" className="w-full gap-2">
                        <Ticket className="h-4 w-4" />
                        Submit a Ticket
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 flex flex-col h-full">
              <Card className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-semibold">AI Assistant</h2>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Online • Powered by RAG
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4 text-accent" />
                          </div>
                        )}
                        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-md'
                                : 'bg-muted rounded-tl-md'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {message.sources.map((source, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {source.category}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {message.role === 'assistant' && message.id !== 'welcome' && (
                            <div className="mt-2 flex items-center gap-2">
                              <button className="p-1 rounded hover:bg-muted transition-colors">
                                <ThumbsUp className="h-3 w-3 text-muted-foreground hover:text-accent" />
                              </button>
                              <button className="p-1 rounded hover:bg-muted transition-colors">
                                <ThumbsDown className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                              </button>
                              <button className="p-1 rounded hover:bg-muted transition-colors">
                                <RefreshCw className="h-3 w-3 text-muted-foreground hover:text-accent" />
                              </button>
                            </div>
                          )}
                        </div>
                        {message.role === 'user' && (
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <Bot className="h-4 w-4 text-accent" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-3">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your question..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={handleSend} 
                      disabled={!inputValue.trim() || isTyping}
                      variant="accent"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    AI responses are generated based on our FAQ database. For complex issues, please submit a ticket.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Chat;
