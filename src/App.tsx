import { useState, useEffect } from 'react';
import { Plan, Page } from './types';
import { LanguageProvider } from './i18n/LanguageContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PlansSection from './components/PlansSection';
import WhyChooseUs from './components/WhyChooseUs';
import Footer from './components/Footer';
import HowToBuySection from './components/HowToBuySection';
import LumiPayPage from './components/LumiPayPage';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const goToLumiPay = (plan: Plan) => {
    setSelectedPlan(plan);
    setPage('lumipay');
    window.scrollTo({ top: 0 });
  };

  // Scroll to top when entering LumiPay
  useEffect(() => {
    if (page === 'lumipay') window.scrollTo({ top: 0 });
  }, [page]);

  if (page === 'lumipay' && selectedPlan) {
    return (
      <LanguageProvider>
        <LumiPayPage plan={selectedPlan} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0a0e1a] font-inter">
        <Header />
        <main>
          <HeroSection />
          <PlansSection onSelectPlan={goToLumiPay} />
          <HowToBuySection />
          <WhyChooseUs />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
