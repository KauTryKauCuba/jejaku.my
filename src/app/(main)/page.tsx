import { Hero } from "@/components/sections/Hero";
import { SimplestSolution } from "@/components/sections/SimplestSolution";
import { Features } from "@/components/sections/Features";

export default function Home() {
  return (
    <>
      <main className="overflow-hidden">
        <Hero />
        <SimplestSolution />
        <Features />
      </main>
    </>
  );
}
