import Banner from "@/components/home/Banner";
import FeaturedStudios from "@/components/home/FeaturedStudios";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <FeaturedStudios />
    </div>
  );
};

export default Home;
