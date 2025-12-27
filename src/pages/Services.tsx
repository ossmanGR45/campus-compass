import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useServiceCategories, useServiceCategory } from '@/hooks/useServiceCategories';
import { useFAQs } from '@/hooks/useFAQs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Monitor, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  Home, 
  HelpCircle,
  Users,
  ArrowRight,
  ChevronRight,
  Ticket
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  GraduationCap,
  BookOpen,
  DollarSign,
  Home,
  HelpCircle,
  Users,
};

const Services = () => {
  const { categoryId } = useParams();
  const { data: categories = [], isLoading: categoriesLoading } = useServiceCategories();
  const { data: category } = useServiceCategory(categoryId);
  const { data: categoryFAQs = [], isLoading: faqsLoading } = useFAQs(categoryId);

  if (categoryId && category) {
    const Icon = iconMap[category.icon] || HelpCircle;

    return (
      <>
        <Helmet>
          <title>{category.name} - CampusHelp</title>
          <meta name="description" content={category.description || ''} />
        </Helmet>
        <Layout>
          <div className="container py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/services" className="hover:text-foreground transition-colors">Services</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{category.name}</span>
            </nav>

            {/* Header */}
            <div className="flex items-start gap-6 mb-10">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${category.color} text-white shadow-lg`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                <p className="text-muted-foreground text-lg">{category.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/chat">
                <Button variant="accent" className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Ask AI About {category.name}
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
              {faqsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : categoryFAQs.length > 0 ? (
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

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, index) => {
                const Icon = iconMap[cat.icon] || HelpCircle;
                
                return (
                  <Link 
                    key={cat.id} 
                    to={`/services/${cat.id}`}
                    className="block animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Card className="group h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50 overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cat.color} text-white shadow-soft transition-transform group-hover:scale-110`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-accent transition-colors">
                              {cat.name}
                            </CardTitle>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {cat.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Services;
