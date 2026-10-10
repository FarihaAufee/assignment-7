import Hero from "@/components/Hero";
import RisingProducts from "@/components/RisingProducts";
import FallingProducts from "@/components/FallingProducts";
import AllProducts from "@/components/AllProducts";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f8f5]">
      <Hero />
      <RisingProducts />
      <FallingProducts />
      <AllProducts />
      <Footer />
    </main>
  );
}