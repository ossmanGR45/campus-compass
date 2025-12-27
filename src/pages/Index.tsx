import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServiceCatalog from '@/components/home/ServiceCatalog';
import PopularFAQs from '@/components/home/PopularFAQs';
import CTASection from '@/components/home/CTASection';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>CampusHelp - Campus Helpdesk & Service Portal</title>
        <meta name="description" content="Get instant help with campus services. From IT support to financial aid, find answers with our AI assistant or connect with our support team." />
      </Helmet>
      <Layout>
        <HeroSection />
        <ServiceCatalog />
        <PopularFAQs />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
