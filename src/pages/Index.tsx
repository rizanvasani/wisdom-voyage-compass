
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import PopularDestinations from '@/components/PopularDestinations';
import CustomerReviews from '@/components/CustomerReviews';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Premium Travel Agency in Mumbai"
        description="Wisdom Travel and Tours is a premium travel agency in Santacruz, Mumbai offering domestic & international holiday packages, flight bookings, and visa services."
        path="/"
      />
      <Header />
      <Hero />
      <Services />
      <PopularDestinations />
      <CustomerReviews />
      <Footer />
    </div>
  );
};

export default Index;
