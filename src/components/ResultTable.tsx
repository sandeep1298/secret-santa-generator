import { motion } from "framer-motion";
import type { SecretSantaAssignment } from "../models/SecretSantaAssignment";
import { Button } from "./Button";

type ResultTableProps = {
  assignments: readonly SecretSantaAssignment[];
  onDownload: () => void;
};

export function ResultTable({ assignments, onDownload }: ResultTableProps) {
  if (assignments.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-lg p-5"
    >
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cranberry-600">
            Assignments ready
          </p>
          <h3 className="text-2xl font-black text-slate-950">Secret Santa Results</h3>
        </div>
        <Button onClick={onDownload} variant="secondary">
          Download
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white/80">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Employee Name</th>
              <th className="px-4 py-3">Employee Email</th>
              <th className="px-4 py-3">Secret Child Name</th>
              <th className="px-4 py-3">Secret Child Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assignments.map((assignment) => (
              <tr key={assignment.employee.email}>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {assignment.employee.name}
                </td>
                <td className="px-4 py-3 text-slate-600">{assignment.employee.email}</td>
                <td className="px-4 py-3 font-semibold text-evergreen-800">
                  {assignment.secretChild.name}
                </td>
                <td className="px-4 py-3 text-slate-600">{assignment.secretChild.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
