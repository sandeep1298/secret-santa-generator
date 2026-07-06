import { motion } from "framer-motion";

type LoaderProps = {
  label?: string;
};

export function Loader({ label = "Generating magical assignments" }: LoaderProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700">
      <motion.span
        aria-hidden="true"
        className="h-5 w-5 rounded-full border-2 border-cranberry-200 border-t-cranberry-600"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <span>{label}</span>
    </div>
  );
}
