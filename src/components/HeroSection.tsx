import { motion } from "framer-motion";
import bannerImageUrl from "../assets/banner_image.png";

export function HeroSection() {
  return (
    <section id="top" className="relative min-h-[620px] overflow-hidden pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-cranberry-700/60 to-evergreen-800/70" />
      <div className="section-shell relative grid min-h-[560px] items-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl text-white"
        >
          <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
            Magical Christmas Gift Exchange Dashboard
          </p>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Secret Santa Generator
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/90 sm:text-xl">
            Create fair, random and magical Secret Santa assignments while avoiding repeats from
            last year.
          </p>
          <a
            href="#generator"
            className="mt-8 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-bold text-cranberry-700 shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-champagne"
          >
            Start Assignment
          </a>
        </motion.div>
      </div>
    </section>
  );
}
