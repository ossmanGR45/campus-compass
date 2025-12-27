import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { mockFAQs, serviceCategories, getCategoryInfo } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, ThumbsUp, Eye, MessageSquare, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const FAQ = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    let results = mockFAQs;

    if (selectedCategory) {
      results = results.filter(faq => faq.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return results;
  }, [searchQuery, selectedCategory]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>FAQs - CampusHelp</title>
        <meta name="description" content="Find answers to frequently asked questions about campus services, IT support, registration, financial aid, and more." />
      </Helmet>
      <Layout>
        <div className="container py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find quick answers to common questions. Can't find what you're looking for? Ask our AI assistant.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-12 h-12 text-lg rounded-xl border-border/50 focus:border-accent"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <Button
              variant={selectedCategory === null ? 'accent' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {serviceCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'accent' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Active filters */}
          {(searchQuery || selectedCategory) && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">
                {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''}
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-3 w-3" />
                Clear filters
              </Button>
            </div>
          )}

          {/* Results */}
          <div className="max-w-3xl mx-auto">
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq) => {
                  const category = getCategoryInfo(faq.category);
                  return (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border border-border/50 rounded-xl px-6 data-[state=open]:shadow-card transition-shadow bg-card"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex flex-col items-start gap-2 text-left">
                          <Badge variant="secondary" className="text-xs">
                            {category?.name}
                          </Badge>
                          <span className="font-medium text-base">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <p className="text-muted-foreground mb-4">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {faq.helpful} found helpful
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {faq.views} views
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {faq.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <Card className="text-center">
                <CardContent className="py-12">
                  <div className="text-muted-foreground mb-6">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No results found</p>
                    <p className="text-sm">Try adjusting your search or ask our AI assistant</p>
                  </div>
                  <Link to="/chat">
                    <Button variant="accent" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Ask AI Assistant
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Didn't find what you were looking for?
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/chat">
                <Button variant="accent" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Ask AI Assistant
                </Button>
              </Link>
              <Link to="/tickets/new">
                <Button variant="outline">Submit a Ticket</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default FAQ;
