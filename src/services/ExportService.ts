import { ASSIGNMENT_COLUMNS, OUTPUT_FILE_NAME } from "../constants/columns";
import type { SecretSantaAssignment } from "../models/SecretSantaAssignment";
import { SecretSantaError } from "../utils/errors";

export class ExportService {
  /**
   * Converts generated Secret Santa assignments into the required CSV file content.
   */
  createCsv(assignments: readonly SecretSantaAssignment[]): string {
    if (assignments.length === 0) {
      throw new SecretSantaError("No Secret Santa assignments available to export");
    }

    const rows = assignments.map((assignment) => [
      assignment.employee.name,
      assignment.employee.email,
      assignment.secretChild.name,
      assignment.secretChild.email
    ]);

    return [ASSIGNMENT_COLUMNS, ...rows]
      .map((row) => row.map((value) => this.escapeCsvValue(value)).join(","))
      .join("\n");
  }

  /**
   * Creates a browser download for the generated CSV using the required output filename.
   */
  downloadCsv(assignments: readonly SecretSantaAssignment[], fileName = OUTPUT_FILE_NAME) {
    const csv = this.createCsv(assignments);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  /**
   * Escapes CSV values that contain commas, quotes, or line breaks.
   */
  private escapeCsvValue(value: string) {
    if (/[",\n\r]/.test(value)) {
      return `"${value.replaceAll('"', '""')}"`;
    }

    return value;
  }
}
