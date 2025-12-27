import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, User, Briefcase, Shield, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: 'student' | 'staff' | 'admin') => {
    login(role);
    navigate('/');
  };

  const roles = [
    {
      role: 'student' as const,
      icon: User,
      title: 'Student',
      description: 'Access student services, submit tickets, and get AI assistance',
      color: 'bg-blue-500'
    },
    {
      role: 'staff' as const,
      icon: Briefcase,
      title: 'Staff',
      description: 'Manage tickets, respond to student inquiries, and update FAQs',
      color: 'bg-emerald-500'
    },
    {
      role: 'admin' as const,
      icon: Shield,
      title: 'Administrator',
      description: 'Full access to admin dashboard, analytics, and system settings',
      color: 'bg-purple-500'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sign In - CampusHelp</title>
        <meta name="description" content="Sign in to access campus helpdesk services" />
      </Helmet>
      <Layout>
        <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12">
          <div className="container max-w-4xl">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome to CampusHelp</h1>
              <p className="text-muted-foreground">
                Select a demo account to explore the helpdesk portal
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {roles.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={item.role}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleLogin(item.role)}
                  >
                    <CardHeader className="text-center pb-2">
                      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl ${item.color} text-white shadow-soft mb-4 transition-transform group-hover:scale-110`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="mb-6">
                        {item.description}
                      </CardDescription>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Login as {item.title}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              This is a demo application. In a real system, you would authenticate with your campus credentials.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
