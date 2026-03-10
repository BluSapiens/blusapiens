import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import ServicesOverview from "@/components/home/ServicesOverview";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ProcessSection from "@/components/home/ProcessSection";
import IndustriesSection from "@/components/home/IndustriesSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <ServicesOverview />
      <WhyChooseUs />
      <ProcessSection />
      <IndustriesSection />
      <CTASection />
    </PageLayout>
  );
};

export default Index;
