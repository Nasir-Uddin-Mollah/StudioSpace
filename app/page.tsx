import Banner from "@/components/home/Banner";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import StudioCategories from "@/components/home/StudioCategories";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <FeaturedStudios />
      <StudioCategories />
    </div>
  );
};

export default Home;
