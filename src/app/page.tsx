import HeroSlider from "@/components/home/HeroSlider";
import BicycleScrollExperience from "../components/scrollytelling/BicycleScrollExperience";
import AboutSection from "@/components/home/Aboutsection";
import Collections from "@/components/home/Collections";
import HeroMarqueeSlider from "@/components/home/Heromarqueeslider";
import HomeRideShowcase from "@/components/home/HomeRideShowcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSlider />
      <BicycleScrollExperience />
      <AboutSection />
      <HomeRideShowcase />
      <HeroMarqueeSlider />
       <Collections />
    </main>
  );
}
