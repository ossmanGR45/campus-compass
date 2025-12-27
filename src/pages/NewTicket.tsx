import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { useCreateTicket, TicketPriority } from '@/hooks/useTickets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  AlertCircle,
  Lightbulb,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const NewTicket = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const { data: categories = [], isLoading: categoriesLoading } = useServiceCategories();
  const createTicket = useCreateTicket();

  const initialCategory = searchParams.get('category') || '';
  
  const [formData, setFormData] = useState({
    subject: '',
    category_id: initialCategory,
    priority: 'medium' as TicketPriority,
    description: ''
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Submit a Ticket - CampusHelp</title>
        </Helmet>
        <Layout>
          <div className="container py-12">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="py-12">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
                <p className="text-muted-foreground mb-6">
                  Please sign in to submit a support ticket.
                </p>
                <Link to="/auth">
                  <Button variant="accent">Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.category_id || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createTicket.mutateAsync({
        subject: formData.subject,
        description: formData.description,
        category_id: formData.category_id,
        priority: formData.priority,
      });

      toast({
        title: "Ticket Submitted!",
        description: "Your support ticket has been created. We'll get back to you soon.",
      });

      navigate('/tickets');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Submit a Ticket - CampusHelp</title>
        <meta name="description" content="Submit a support ticket to get help from our team" />
      </Helmet>
      <Layout>
        <div className="container py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/tickets" className="hover:text-foreground transition-colors">Tickets</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">New Ticket</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Ticket</CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        {categoriesLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Select
                            value={formData.category_id}
                            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => setFormData({ ...formData, priority: value as TicketPriority })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Please provide as much detail as possible about your issue..."
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        variant="accent" 
                        className="gap-2"
                        disabled={createTicket.isPending}
                      >
                        {createTicket.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Ticket
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate('/tickets')}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-2">Before you submit</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Have you tried our AI assistant? Many questions can be answered instantly!
                      </p>
                      <Link to="/chat">
                        <Button variant="accent" size="sm" className="w-full">
                          Ask AI Assistant
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { priority: 'Urgent', time: '< 2 hours', color: 'bg-red-100 text-red-700' },
                    { priority: 'High', time: '< 4 hours', color: 'bg-amber-100 text-amber-700' },
                    { priority: 'Medium', time: '< 24 hours', color: 'bg-blue-100 text-blue-700' },
                    { priority: 'Low', time: '< 48 hours', color: 'bg-slate-100 text-slate-700' },
                  ].map(item => (
                    <div key={item.priority} className="flex items-center justify-between text-sm">
                      <Badge className={item.color} variant="secondary">{item.priority}</Badge>
                      <span className="text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    For emergencies, contact Campus Security directly:
                  </p>
                  <p className="font-medium">(555) 123-4567</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NewTicket;
