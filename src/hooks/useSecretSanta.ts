import { useMemo, useState } from "react";
import type { Employee } from "../models/Employee";
import type { SecretSantaAssignment } from "../models/SecretSantaAssignment";
import { ExportService } from "../services/ExportService";
import { FileParserService } from "../services/FileParserService";
import { SecretSantaService } from "../services/SecretSantaService";
import { getErrorMessage } from "../utils/errors";

export function useSecretSanta() {
  const fileParserService = useMemo(() => new FileParserService(), []);
  const secretSantaService = useMemo(() => new SecretSantaService(), []);
  const exportService = useMemo(() => new ExportService(), []);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [previousAssignments, setPreviousAssignments] = useState<SecretSantaAssignment[] | null>(
    null
  );
  const [assignments, setAssignments] = useState<SecretSantaAssignment[]>([]);
  const [employeeFileName, setEmployeeFileName] = useState("");
  const [previousFileName, setPreviousFileName] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const loadEmployees = async (file: File) => {
    setIsParsing(true);
    setError("");
    setAssignments([]);

    try {
      const parsedEmployees = await fileParserService.parseEmployees(file);
      setEmployees(parsedEmployees);
      setEmployeeFileName(file.name);
    } catch (caughtError) {
      setEmployees([]);
      setEmployeeFileName("");
      setError(getErrorMessage(caughtError));
    } finally {
      setIsParsing(false);
    }
  };

  const loadPreviousAssignments = async (file: File) => {
    setIsParsing(true);
    setError("");
    setAssignments([]);

    try {
      const parsedAssignments = await fileParserService.parsePreviousAssignments(file);
      setPreviousAssignments(parsedAssignments);
      setPreviousFileName(file.name);
    } catch (caughtError) {
      setPreviousAssignments(null);
      setPreviousFileName("");
      setError(getErrorMessage(caughtError));
    } finally {
      setIsParsing(false);
    }
  };

  const generateAssignments = async () => {
    setError("");

    if (employees.length === 0) {
      setError("Upload a valid employee file before generating assignments");
      return;
    }

    setIsGenerating(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      const generatedAssignments = secretSantaService.generateAssignments(
        employees,
        previousAssignments ?? []
      );
      setAssignments(generatedAssignments);
    } catch (caughtError) {
      setAssignments([]);
      setError(getErrorMessage(caughtError));
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCsv = () => {
    try {
      exportService.downloadCsv(assignments);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    }
  };

  const reset = () => {
    setEmployees([]);
    setPreviousAssignments(null);
    setAssignments([]);
    setEmployeeFileName("");
    setPreviousFileName("");
    setError("");
  };

  return {
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
  };
}
