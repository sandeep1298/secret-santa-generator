import { ASSIGNMENT_COLUMNS, EMPLOYEE_COLUMNS } from "../constants/columns";
import type { Employee } from "../models/Employee";
import type { SecretSantaAssignment } from "../models/SecretSantaAssignment";
import { SecretSantaError } from "./errors";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeCell(value: unknown): string {
  return String(value ?? "").trim();
}

export function assertRequiredColumns(
  actualColumns: readonly string[],
  requiredColumns: readonly string[],
  message: string
) {
  const normalizedActual = new Set(actualColumns.map((column) => column.trim()));
  const missingColumn = requiredColumns.find((column) => !normalizedActual.has(column));

  if (missingColumn) {
    throw new SecretSantaError(message);
  }
}

export function validateEmployees(employees: readonly Employee[]) {
  if (employees.length === 0) {
    throw new SecretSantaError("No employees found");
  }

  if (employees.length < 2) {
    throw new SecretSantaError("At least two employees are required");
  }

  const seenEmails = new Set<string>();

  for (const employee of employees) {
    if (!employee.name || !employee.email || !emailPattern.test(employee.email)) {
      throw new SecretSantaError("Invalid employee file format");
    }

    const normalizedEmail = normalizeEmail(employee.email);

    if (seenEmails.has(normalizedEmail)) {
      throw new SecretSantaError("Duplicate employee email detected");
    }

    seenEmails.add(normalizedEmail);
  }
}

export function validatePreviousAssignments(assignments: readonly SecretSantaAssignment[]) {
  for (const assignment of assignments) {
    if (
      !assignment.employee.name ||
      !assignment.employee.email ||
      !assignment.secretChild.name ||
      !assignment.secretChild.email ||
      !emailPattern.test(assignment.employee.email) ||
      !emailPattern.test(assignment.secretChild.email)
    ) {
      throw new SecretSantaError("Invalid previous year result file format");
    }
  }
}

export function getRequiredEmployeeColumns() {
  return [...EMPLOYEE_COLUMNS];
}

export function getRequiredAssignmentColumns() {
  return [...ASSIGNMENT_COLUMNS];
}
