import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";

type FileUploaderProps = {
  description: string;
  disabled?: boolean;
  fileName: string;
  onFileAccepted: (file: File) => void;
  title: string;
};

export function FileUploader({
  description,
  disabled = false,
  fileName,
  onFileAccepted,
  title
}: FileUploaderProps) {
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"]
    },
    disabled,
    maxFiles: 1,
    multiple: false,
    onDrop: (acceptedFiles) => {
      const [file] = acceptedFiles;

      if (file) {
        onFileAccepted(file);
      }
    }
  });

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
      <div
        {...getRootProps()}
        className={`glass-panel min-h-64 cursor-pointer rounded-lg p-6 transition ${
          isDragActive ? "border-evergreen-500 bg-evergreen-50/90" : "hover:border-cranberry-200"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex h-full flex-col justify-between gap-8">
          <div>
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-lg bg-cranberry-100 text-2xl">
              <span aria-hidden="true">+</span>
            </div>
            <h3 className="text-xl font-black text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-4 text-sm">
            <p className="font-semibold text-slate-800">
              {fileName || (isDragActive ? "Drop the file here" : "Drop file or browse")}
            </p>
            <p className="mt-1 text-xs text-slate-500">XLSX, XLS or CSV</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
