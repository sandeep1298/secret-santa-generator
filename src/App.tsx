import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { SecretSantaGenerator } from "./features/secretSanta/SecretSantaGenerator";

export default function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-champagne text-slate-950">
      <Navbar />
      <main>
        <HeroSection />
        <SecretSantaGenerator />
      </main>
    </div>
  );
}
