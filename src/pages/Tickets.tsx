import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets, TicketStatus } from '@/hooks/useTickets';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Clock, 
  MessageSquare,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'open': 'bg-blue-100 text-blue-700',
    'in_progress': 'bg-amber-100 text-amber-700',
    'resolved': 'bg-emerald-100 text-emerald-700',
    'closed': 'bg-slate-100 text-slate-700'
  };
  return colors[status] || 'bg-slate-100 text-slate-700';
};

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'low': 'bg-slate-100 text-slate-600',
    'medium': 'bg-blue-100 text-blue-600',
    'high': 'bg-amber-100 text-amber-600',
    'urgent': 'bg-red-100 text-red-600'
  };
  return colors[priority] || 'bg-slate-100 text-slate-600';
};

const Tickets = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: tickets = [], isLoading: ticketsLoading } = useTickets();

  if (authLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>My Tickets - CampusHelp</title>
        </Helmet>
        <Layout>
          <div className="container py-12">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="py-12">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
                <p className="text-muted-foreground mb-6">
                  Please sign in to view and manage your tickets.
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

  const filterTickets = (status: string) => {
    if (status === 'all') return tickets;
    if (status === 'active') return tickets.filter(t => ['open', 'in_progress'].includes(t.status));
    if (status === 'resolved') return tickets.filter(t => ['resolved', 'closed'].includes(t.status));
    return tickets;
  };

  const filteredTickets = filterTickets(activeTab);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const formatStatus = (status: string) => status.replace('_', ' ');

  return (
    <>
      <Helmet>
        <title>My Tickets - CampusHelp</title>
        <meta name="description" content="View and manage your support tickets" />
      </Helmet>
      <Layout>
        <div className="container py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {user?.role === 'admin' || user?.role === 'staff' ? 'All Tickets' : 'My Tickets'}
              </h1>
              <p className="text-muted-foreground">
                {user?.role === 'admin' || user?.role === 'staff'
                  ? 'Manage and respond to support tickets'
                  : 'Track the status of your support requests'}
              </p>
            </div>
            <Link to="/tickets/new">
              <Button variant="accent" className="gap-2">
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', count: tickets.length, color: 'bg-slate-100 text-slate-700' },
              { label: 'Open', count: tickets.filter(t => t.status === 'open').length, color: 'bg-blue-100 text-blue-700' },
              { label: 'In Progress', count: tickets.filter(t => t.status === 'in_progress').length, color: 'bg-amber-100 text-amber-700' },
              { label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length, color: 'bg-emerald-100 text-emerald-700' },
            ].map(stat => (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <Badge className={stat.color}>{stat.count}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tickets List */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {ticketsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredTickets.length > 0 ? (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <Card 
                      key={ticket.id}
                      className="group cursor-pointer hover:shadow-card transition-shadow"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getStatusColor(ticket.status)} variant="secondary">
                                {formatStatus(ticket.status)}
                              </Badge>
                              <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                                {ticket.priority}
                              </Badge>
                              {ticket.category && (
                                <Badge variant="outline">{ticket.category.name}</Badge>
                              )}
                            </div>
                            <h3 className="font-medium text-lg mb-1 group-hover:text-accent transition-colors truncate">
                              {ticket.subject}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {ticket.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(ticket.created_at)}
                              </span>
                              {ticket.creator_name && (
                                <span>By: {ticket.creator_name}</span>
                              )}
                              {ticket.assignee_name && (
                                <span>Assigned to: {ticket.assignee_name}</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                    <p className="text-muted-foreground mb-6">
                      {activeTab === 'all' 
                        ? "You haven't submitted any tickets yet."
                        : `No ${activeTab} tickets found.`}
                    </p>
                    <Link to="/tickets/new">
                      <Button variant="accent" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Your First Ticket
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
};

export default Tickets;
