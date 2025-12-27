import { Link } from 'react-router-dom';
import { serviceCategories } from '@/data/mockData';
import { 
  Laptop, 
  GraduationCap, 
  BookOpen, 
  Wallet, 
  Home, 
  HelpCircle,
  ArrowRight 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const iconMap: Record<string, React.ElementType> = {
  Laptop,
  GraduationCap,
  BookOpen,
  Wallet,
  Home,
  HelpCircle
};

const ServiceCatalog = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Service Catalog</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive range of campus services. Click on any category to find FAQs or submit a support request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category, index) => {
            const Icon = iconMap[category.icon] || HelpCircle;
            return (
              <Link 
                key={category.id} 
                to={`/services/${category.id}`}
                className="block animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Card className="group h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.color} text-white shadow-soft transition-transform group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceCatalog;
