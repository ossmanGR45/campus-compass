import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { mockTickets, getStatusColor, getPriorityColor, getCategoryInfo } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  CheckCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const TicketDetail = () => {
  const { ticketId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const ticket = mockTickets.find(t => t.id === ticketId);
  const [replyContent, setReplyContent] = useState('');
  const [status, setStatus] = useState<string>(ticket?.status || 'open');

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
                <Link to="/login">
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

  const category = getCategoryInfo(ticket.category);
  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleReply = () => {
    if (!replyContent.trim()) return;
    
    toast({
      title: "Reply Sent",
      description: "Your reply has been added to the ticket."
    });
    setReplyContent('');
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${newStatus.replace('-', ' ')}.`
    });
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
            <span className="text-foreground">#{ticket.id.split('-')[1]}</span>
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
                        <Badge className={getStatusColor(status)} variant="secondary">
                          {status.replace('-', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                          {ticket.priority}
                        </Badge>
                        <Badge variant="outline">{category?.name}</Badge>
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
                      {ticket.createdByName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(ticket.createdAt)}
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
                  {ticket.replies.length > 0 ? (
                    ticket.replies.map((reply, index) => (
                      <div key={reply.id}>
                        {index > 0 && <Separator className="mb-6" />}
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.authorName}`} />
                            <AvatarFallback>{reply.authorName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{reply.authorName}</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {reply.authorRole}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{reply.content}</p>
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
                        disabled={!replyContent.trim()}
                      >
                        <Send className="h-4 w-4" />
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
                      <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="success" className="w-full gap-2">
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
                    <span className="font-medium">#{ticket.id.split('-')[1]}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{category?.name}</span>
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
                    <span className="font-medium">{formatDate(ticket.createdAt)}</span>
                  </div>
                  {ticket.assignedToName && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assigned To</span>
                        <span className="font-medium">{ticket.assignedToName}</span>
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
