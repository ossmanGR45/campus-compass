import { Link } from 'react-router-dom';
import { mockFAQs, getCategoryInfo } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp, Eye, ArrowRight, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PopularFAQs = () => {
  // Sort by most helpful and take top 4
  const popularFAQs = [...mockFAQs]
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, 4);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Popular Questions</h2>
            <p className="text-muted-foreground max-w-xl">
              Quick answers to the most commonly asked questions from students.
            </p>
          </div>
          <Link to="/faq" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              View All FAQs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularFAQs.map((faq, index) => {
            const category = getCategoryInfo(faq.category);
            return (
              <Link 
                key={faq.id} 
                to={`/faq?q=${encodeURIComponent(faq.question)}`}
                className="block animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Card className="group h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <Badge variant="secondary" className="shrink-0">
                        {category?.name}
                      </Badge>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {faq.helpful}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {faq.views}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-medium text-lg mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {faq.answer}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Read answer
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/faq">
            <Button variant="outline" className="gap-2">
              View All FAQs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularFAQs;
