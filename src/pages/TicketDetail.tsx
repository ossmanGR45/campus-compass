import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTicket, useTicketMessages, useUpdateTicketStatus, useAddTicketMessage, TicketStatus } from '@/hooks/useTickets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronRight,
  Clock,
  Send,
  AlertCircle,
  User,
  CheckCircle,
  Loader2
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

const TicketDetail = () => {
  const { ticketId } = useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const { data: ticket, isLoading: ticketLoading } = useTicket(ticketId);
  const { data: messages = [], isLoading: messagesLoading } = useTicketMessages(ticketId);
  const updateStatus = useUpdateTicketStatus();
  const addMessage = useAddTicketMessage();
  
  const [replyContent, setReplyContent] = useState('');

  if (authLoading || ticketLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Ticket Details - CampusHelp</title>
        </Helmet>
        <Layout>
          <div className="container py-12">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="py-12">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
                <p className="text-muted-foreground mb-6">
                  Please sign in to view ticket details.
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

  if (!ticket) {
    return (
      <>
        <Helmet>
          <title>Ticket Not Found - CampusHelp</title>
        </Helmet>
        <Layout>
          <div className="container py-12">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="py-12">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Ticket Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  The ticket you're looking for doesn't exist or has been deleted.
                </p>
                <Link to="/tickets">
                  <Button variant="accent">Back to Tickets</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </>
    );
  }

  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const formatStatus = (status: string) => status.replace('_', ' ');

  const handleReply = async () => {
    if (!replyContent.trim() || !ticketId) return;
    
    try {
      await addMessage.mutateAsync({
        ticketId,
        content: replyContent,
      });
      
      toast({
        title: "Reply Sent",
        description: "Your reply has been added to the ticket."
      });
      setReplyContent('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticketId) return;
    
    try {
      await updateStatus.mutateAsync({
        ticketId,
        status: newStatus as TicketStatus,
      });
      
      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${formatStatus(newStatus)}.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{ticket.subject} - CampusHelp</title>
      </Helmet>
      <Layout>
        <div className="container py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/tickets" className="hover:text-foreground transition-colors">Tickets</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">#{ticket.id.slice(0, 8)}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ticket Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
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
                      <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                  <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {ticket.creator_name || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(ticket.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Replies */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {messagesLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div key={message.id}>
                        {index > 0 && <Separator className="mb-6" />}
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {(message.sender_name || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{message.sender_name || 'Unknown'}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(message.created_at)}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No replies yet. Be the first to respond!
                    </p>
                  )}

                  {/* Reply Form */}
                  <Separator />
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Write your reply..."
                      rows={4}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button 
                        variant="accent" 
                        className="gap-2"
                        onClick={handleReply}
                        disabled={!replyContent.trim() || addMessage.isPending}
                      >
                        {addMessage.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Management (Staff Only) */}
              {isStaff && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Manage Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select 
                        value={ticket.status} 
                        onValueChange={handleStatusChange}
                        disabled={updateStatus.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="success" 
                      className="w-full gap-2"
                      onClick={() => handleStatusChange('resolved')}
                      disabled={updateStatus.isPending || ticket.status === 'resolved'}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark as Resolved
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Ticket Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Ticket Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ticket ID</span>
                    <span className="font-medium">#{ticket.id.slice(0, 8)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{ticket.category?.name || 'N/A'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority</span>
                    <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">{formatDate(ticket.created_at)}</span>
                  </div>
                  {ticket.assignee_name && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assigned To</span>
                        <span className="font-medium">{ticket.assignee_name}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Need More Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/chat">
                    <Button variant="outline" className="w-full">Ask AI Assistant</Button>
                  </Link>
                  <Link to="/faq">
                    <Button variant="outline" className="w-full">Browse FAQs</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default TicketDetail;
