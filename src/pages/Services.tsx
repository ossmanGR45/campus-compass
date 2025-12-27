import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { serviceCategories, mockFAQs, getCategoryInfo } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Laptop, 
  GraduationCap, 
  BookOpen, 
  Wallet, 
  Home, 
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Ticket
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const iconMap: Record<string, React.ElementType> = {
  Laptop,
  GraduationCap,
  BookOpen,
  Wallet,
  Home,
  HelpCircle
};

const Services = () => {
  const { categoryId } = useParams();
  const selectedCategory = categoryId ? getCategoryInfo(categoryId) : null;

  if (selectedCategory) {
    const categoryFAQs = mockFAQs.filter(faq => faq.category === categoryId);
    const Icon = iconMap[selectedCategory.icon] || HelpCircle;

    return (
      <>
        <Helmet>
          <title>{selectedCategory.name} - CampusHelp</title>
          <meta name="description" content={selectedCategory.description} />
        </Helmet>
        <Layout>
          <div className="container py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/services" className="hover:text-foreground transition-colors">Services</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{selectedCategory.name}</span>
            </nav>

            {/* Header */}
            <div className="flex items-start gap-6 mb-10">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${selectedCategory.color} text-white shadow-lg`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedCategory.name}</h1>
                <p className="text-muted-foreground text-lg">{selectedCategory.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/chat">
                <Button variant="accent" className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Ask AI About {selectedCategory.name}
                </Button>
              </Link>
              <Link to={`/tickets/new?category=${categoryId}`}>
                <Button variant="outline" className="gap-2">
                  <Ticket className="h-4 w-4" />
                  Submit a Ticket
                </Button>
              </Link>
            </div>

            {/* FAQs for this category */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
              {categoryFAQs.length > 0 ? (
                <div className="space-y-4">
                  {categoryFAQs.map((faq) => (
                    <Card key={faq.id} className="group hover:shadow-card transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="font-medium text-lg mb-2 group-hover:text-accent transition-colors">
                          {faq.question}
                        </h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">No FAQs available for this category yet.</p>
                    <Link to="/chat">
                      <Button variant="accent">Ask AI Assistant</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Layout>
      </>
    );
  }

  // Show all categories
  return (
    <>
      <Helmet>
        <title>Service Catalog - CampusHelp</title>
        <meta name="description" content="Browse all campus services including IT support, course registration, library services, financial aid, and more." />
      </Helmet>
      <Layout>
        <div className="container py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-4">Service Catalog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Browse our comprehensive range of campus services. Select a category to view related FAQs or submit a support request.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category, index) => {
              const Icon = iconMap[category.icon] || HelpCircle;
              const faqCount = mockFAQs.filter(f => f.category === category.id).length;
              
              return (
                <Link 
                  key={category.id} 
                  to={`/services/${category.id}`}
                  className="block animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card className="group h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50 overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.color} text-white shadow-soft transition-transform group-hover:scale-110`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-accent transition-colors">
                            {category.name}
                          </CardTitle>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {faqCount} FAQ{faqCount !== 1 ? 's' : ''} available
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Services;
