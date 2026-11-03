import Banner from "@/components/home/Banner";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import StudioCategories from "@/components/home/StudioCategories";
import HowBookingWorks from "@/components/home/HowBookingWorks";
import HostGuarantee from "@/components/home/HostGuarantee";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <FeaturedStudios />
      <StudioCategories />
      <HowBookingWorks />
      <HostGuarantee />
    </div>
  );
};

export default Home;
