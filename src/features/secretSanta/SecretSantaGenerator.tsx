import { motion } from "framer-motion";
import { Button } from "../../components/Button";
import { EmployeeTable } from "../../components/EmployeeTable";
import { ErrorMessage } from "../../components/ErrorMessage";
import { FileUploader } from "../../components/FileUploader";
import { Loader } from "../../components/Loader";
import { ResultTable } from "../../components/ResultTable";
import { useSecretSanta } from "../../hooks/useSecretSanta";

const stepCards = [
  "Upload Employee XLSX/CSV",
  "Optionally upload previous year result",
  "Generate Secret Santa",
  "Download generated CSV"
];

export function SecretSantaGenerator() {
  const {
    assignments,
    downloadCsv,
    employeeFileName,
    employees,
    error,
    generateAssignments,
    isGenerating,
    isParsing,
    loadEmployees,
    loadPreviousAssignments,
    previousFileName,
    reset
  } = useSecretSanta();

  const canGenerate = employees.length > 0 && !isGenerating && !isParsing;

  return (
    <section id="generator" className="section-shell py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="mb-10"
      >
        <p className="text-sm font-bold uppercase tracking-wide text-cranberry-600">
          Assignment flow
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Upload files, generate fair matches, and export a ready-to-share result.
          </h2>
          <Button onClick={reset} variant="ghost">
            Reset
          </Button>
        </div>
      </motion.div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stepCards.map((step, index) => (
          <div key={step} className="rounded-lg border border-white/70 bg-white/60 p-4">
            <span className="text-xs font-black uppercase tracking-wide text-cranberry-600">
              Step {index + 1}
            </span>
            <p className="mt-2 text-sm font-bold text-slate-800">{step}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FileUploader
          description="Expected columns: Employee_Name and Employee_EmailID."
          disabled={isParsing || isGenerating}
          fileName={employeeFileName}
          onFileAccepted={loadEmployees}
          title="Upload Employee File"
        />
        <FileUploader
          description="Optional. If uploaded, expected columns are Employee_Name, Employee_EmailID, Secret_Child_Name and Secret_Child_EmailID."
          disabled={isParsing || isGenerating}
          fileName={previousFileName}
          onFileAccepted={loadPreviousAssignments}
          title="Upload Previous Year Result (Optional)"
        />
      </div>

      <div className="mt-6 grid gap-6">
        <ErrorMessage message={error} />
        {isParsing ? <Loader label="Reading and validating file" /> : null}
        <EmployeeTable employees={employees} />
        <div className="glass-panel flex flex-col gap-4 rounded-lg p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">Generate Secret Santa</h3>
            <p className="mt-1 text-sm text-slate-600">
              The generator prevents self matches and duplicate children. If a previous-year file is
              uploaded, it also prevents repeated pairings from last year.
            </p>
          </div>
          <Button disabled={!canGenerate} onClick={generateAssignments}>
            Generate Secret Santa
          </Button>
        </div>
        {isGenerating ? <Loader /> : null}
        <ResultTable assignments={assignments} onDownload={downloadCsv} />
      </div>
    </section>
  );
}
