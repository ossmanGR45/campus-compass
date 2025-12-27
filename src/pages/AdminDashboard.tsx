import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { mockTickets, mockFAQs, serviceCategories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Ticket, 
  Users, 
  MessageSquare, 
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'staff')) {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard - CampusHelp</title>
        </Helmet>
        <Layout>
          <div className="container py-12">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="py-12">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                <p className="text-muted-foreground mb-6">
                  You don't have permission to access the admin dashboard.
                </p>
                <Link to="/login">
                  <Button variant="accent">Sign In as Staff/Admin</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </>
    );
  }

  // Calculate stats
  const totalTickets = mockTickets.length;
  const openTickets = mockTickets.filter(t => t.status === 'open').length;
  const inProgressTickets = mockTickets.filter(t => t.status === 'in-progress').length;
  const resolvedTickets = mockTickets.filter(t => t.status === 'resolved').length;
  const resolutionRate = Math.round((resolvedTickets / totalTickets) * 100);

  // Category distribution
  const categoryStats = serviceCategories.map(cat => ({
    ...cat,
    count: mockTickets.filter(t => t.category === cat.id).length,
    faqCount: mockFAQs.filter(f => f.category === cat.id).length
  })).sort((a, b) => b.count - a.count);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - CampusHelp</title>
        <meta name="description" content="Admin dashboard for managing campus helpdesk" />
      </Helmet>
      <Layout>
        <div className="container py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of helpdesk performance and ticket management
              </p>
            </div>
            <Link to="/tickets">
              <Button variant="accent" className="gap-2">
                <Ticket className="h-4 w-4" />
                View All Tickets
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                title: 'Total Tickets', 
                value: totalTickets, 
                icon: Ticket, 
                color: 'bg-blue-500',
                trend: '+12% from last month'
              },
              { 
                title: 'Open Tickets', 
                value: openTickets, 
                icon: Clock, 
                color: 'bg-amber-500',
                trend: '3 need attention'
              },
              { 
                title: 'In Progress', 
                value: inProgressTickets, 
                icon: Users, 
                color: 'bg-purple-500',
                trend: 'Assigned to staff'
              },
              { 
                title: 'Resolved', 
                value: resolvedTickets, 
                icon: CheckCircle, 
                color: 'bg-emerald-500',
                trend: `${resolutionRate}% resolution rate`
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                      </div>
                      <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Category Distribution */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Tickets by Category
                  </CardTitle>
                  <CardDescription>
                    Distribution of tickets across service categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {categoryStats.map((cat) => {
                    const percentage = totalTickets > 0 ? (cat.count / totalTickets) * 100 : 0;
                    return (
                      <div key={cat.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${cat.color}`} />
                            <span className="font-medium">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {cat.faqCount} FAQs
                            </span>
                            <Badge variant="secondary">{cat.count} tickets</Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Insights */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/tickets" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      Manage Tickets
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/faq" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      Update FAQs
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-between">
                    View Analytics
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-accent" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on recent ticket patterns, consider updating FAQs for:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Wi-Fi connection issues
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Course registration deadlines
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Financial aid disbursement
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTickets.slice(0, 3).map((ticket) => (
                    <Link 
                      key={ticket.id} 
                      to={`/tickets/${ticket.id}`}
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="text-sm font-medium line-clamp-1">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.createdByName} • {ticket.status}
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AdminDashboard;
