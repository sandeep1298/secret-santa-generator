import { motion } from "framer-motion";

type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-cranberry-100 bg-cranberry-50 px-4 py-3 text-sm font-medium text-cranberry-700"
      role="alert"
    >
      {message}
    </motion.div>
  );
}
