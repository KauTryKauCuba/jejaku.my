import { Hero } from "@/components/sections/Hero";
import { SimplestSolution } from "@/components/sections/SimplestSolution";

export default function Home() {
  return (
    <>
      <main className="overflow-hidden">
        <Hero />
        <SimplestSolution />
      </main>
    </>
  );
}
