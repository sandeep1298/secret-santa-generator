import { ASSIGNMENT_COLUMNS, EMPLOYEE_COLUMNS } from "../constants/columns";
import type { Employee } from "../models/Employee";
import type { SecretSantaAssignment } from "../models/SecretSantaAssignment";
import type { AssignmentRow, EmployeeRow } from "../types/ExcelRows";
import { SecretSantaError } from "../utils/errors";
import {
  assertRequiredColumns,
  normalizeCell,
  normalizeEmail,
  validateEmployees,
  validatePreviousAssignments
} from "../utils/validators";

type WorksheetRows = {
  header: string[];
  rows: Record<string, unknown>[];
};

export class FileParserService {
  private readonly maxFileSizeBytes = 5 * 1024 * 1024;

  /**
   * Reads an uploaded employee spreadsheet and converts valid rows into Employee objects.
   */
  async parseEmployees(file: File): Promise<Employee[]> {
    const { header, rows } = await this.readFirstWorksheet(file);

    assertRequiredColumns(header, EMPLOYEE_COLUMNS, "Invalid employee file format");

    const employees = rows
      .filter((row) => !this.isBlankRow(row, EMPLOYEE_COLUMNS))
      .map((row: EmployeeRow) => ({
        name: normalizeCell(row.Employee_Name),
        email: normalizeEmail(normalizeCell(row.Employee_EmailID))
      }));

    validateEmployees(employees);

    return employees;
  }

  /**
   * Reads an uploaded previous-year result spreadsheet and converts rows into assignment objects.
   */
  async parsePreviousAssignments(file: File): Promise<SecretSantaAssignment[]> {
    const { header, rows } = await this.readFirstWorksheet(file);

    assertRequiredColumns(header, ASSIGNMENT_COLUMNS, "Invalid previous year result file format");

    const assignments = rows
      .filter((row) => !this.isBlankRow(row, ASSIGNMENT_COLUMNS))
      .map((row: AssignmentRow) => ({
        employee: {
          name: normalizeCell(row.Employee_Name),
          email: normalizeEmail(normalizeCell(row.Employee_EmailID))
        },
        secretChild: {
          name: normalizeCell(row.Secret_Child_Name),
          email: normalizeEmail(normalizeCell(row.Secret_Child_EmailID))
        }
      }));

    validatePreviousAssignments(assignments);

    return assignments;
  }

  /**
   * Validates the file, loads the first worksheet, and returns both headers and row objects.
   */
  private async readFirstWorksheet(file: File): Promise<WorksheetRows> {
    this.validateFile(file);

    const XLSX = await import("xlsx");
    const data = await this.readFileAsArrayBuffer(file);
    const workbook = XLSX.read(data, { type: "array", raw: false });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new SecretSantaError("Invalid file format");
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rowsAsArrays = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
      header: 1,
      blankrows: false,
      defval: ""
    });
    const header = (rowsAsArrays[0] ?? []).map((value) => normalizeCell(value));

    if (header.length === 0) {
      throw new SecretSantaError("Invalid file format");
    }

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: "",
      raw: false
    });

    return { header, rows };
  }

  /**
   * Checks upload constraints before parsing so bad files fail with clear messages.
   */
  private validateFile(file: File) {
    if (!file) {
      throw new SecretSantaError("No file selected");
    }

    if (file.size === 0) {
      throw new SecretSantaError("Empty file uploaded");
    }

    if (file.size > this.maxFileSizeBytes) {
      throw new SecretSantaError("File is too large. Upload a file under 5 MB.");
    }

    const allowedExtensions = [".xlsx", ".xls", ".csv"];
    const fileName = file.name.toLowerCase();
    const isSupported = allowedExtensions.some((extension) => fileName.endsWith(extension));

    if (!isSupported) {
      throw new SecretSantaError("Wrong file format. Upload an XLSX, XLS or CSV file.");
    }
  }

  /**
   * Detects rows where every required column is empty so they can be ignored safely.
   */
  private isBlankRow(row: Record<string, unknown>, columns: readonly string[]) {
    return columns.every((column) => normalizeCell(row[column]).length === 0);
  }

  /**
   * Reads a browser File into an ArrayBuffer, with FileReader fallback for older environments.
   */
  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    const arrayBufferReader = (file as Blob & { arrayBuffer?: () => Promise<ArrayBuffer> })
      .arrayBuffer;

    if (typeof arrayBufferReader === "function") {
      return arrayBufferReader.call(file);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
          return;
        }

        reject(new SecretSantaError("Invalid file format"));
      };
      reader.onerror = () => reject(new SecretSantaError("Invalid file format"));
      reader.readAsArrayBuffer(file);
    });
  }
}
