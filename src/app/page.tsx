import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { CustomerLogos } from "@/components/sections/CustomerLogos";

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <Hero />
        <CustomerLogos />
      </main>
    </>
  );
}
