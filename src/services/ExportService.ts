import { ASSIGNMENT_COLUMNS, OUTPUT_FILE_NAME } from "../constants/columns";
import type { SecretSantaAssignment } from "../models/SecretSantaAssignment";
import { SecretSantaError } from "../utils/errors";
import * as XLSX from "xlsx";

export class ExportService {
  /**
   * Converts generated Secret Santa assignments into Excel worksheet data.
   */
  private createWorksheet(assignments: readonly SecretSantaAssignment[]) {
    if (assignments.length === 0) {
      throw new SecretSantaError(
        "No Secret Santa assignments available to export"
      );
    }

    const rows = assignments.map((assignment) => [
      assignment.employee.name,
      assignment.employee.email,
      assignment.secretChild.name,
      assignment.secretChild.email,
    ]);

    return XLSX.utils.aoa_to_sheet([
      ASSIGNMENT_COLUMNS,
      ...rows,
    ]);
  }

  /**
   * Creates a browser download for the generated XLSX file.
   */
  downloadCsv(
    assignments: readonly SecretSantaAssignment[],
    fileName = OUTPUT_FILE_NAME.replace(".csv", ".xlsx")
  ) {
    const worksheet = this.createWorksheet(assignments);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Secret Santa"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = fileName;

    document.body.append(link);
    link.click();

    link.remove();
    URL.revokeObjectURL(url);
  }
}