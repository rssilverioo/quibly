import DownloadSection from "@/components/DownloadSection";
import FaqSection from "@/components/FaqSection";
import FeaturePreview from "@/components/FeaturePreview";
import HeroSection from "@/components/HeroSection";
import UndetectableSection from "@/components/UndetectableSection";



export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturePreview />
      <UndetectableSection />
      <FaqSection />
      <DownloadSection /> 
    </div>
  );
}
