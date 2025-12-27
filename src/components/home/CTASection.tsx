import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Ticket, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-12 lg:p-16">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Still Need Help?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-6">
                Our AI assistant is available 24/7, or submit a ticket to connect with our support team during business hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/chat">
                  <Button variant="accent" size="lg" className="w-full sm:w-auto group">
                    <MessageSquare className="h-5 w-5" />
                    Chat with AI
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/tickets/new">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <Ticket className="h-5 w-5" />
                    Submit a Ticket
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/30 rounded-2xl blur-xl" />
                <div className="relative bg-card rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium">AI Assistant</div>
                      <div className="text-xs text-muted-foreground">Online now</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-muted rounded-lg px-4 py-2 text-sm">
                      How can I reset my Wi-Fi password?
                    </div>
                    <div className="bg-accent/10 rounded-lg px-4 py-2 text-sm text-foreground">
                      I can help! Visit portal.campus.edu/reset and enter your student ID...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
