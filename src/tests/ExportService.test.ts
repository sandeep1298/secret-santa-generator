import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { ASSIGNMENT_COLUMNS } from "../constants/columns";
import type { SecretSantaAssignment } from "../models/SecretSantaAssignment";
import { ExportService } from "../services/ExportService";
import { SecretSantaError } from "../utils/errors";

describe("ExportService", () => {
  const assignments: SecretSantaAssignment[] = [
    {
      employee: { name: "Ada Lovelace", email: "ada@acme.com" },
      secretChild: { name: "Grace Hopper", email: "grace@acme.com" },
    },
  ];

  it("creates a worksheet with the expected assignment columns and values", () => {
    const service = new ExportService();

    const worksheet = (
      service as unknown as {
        createWorksheet: (
          assignments: readonly SecretSantaAssignment[]
        ) => XLSX.WorkSheet;
      }
    ).createWorksheet(assignments);

    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    expect(rows[0]).toEqual(ASSIGNMENT_COLUMNS);
    expect(rows[1]).toEqual([
      "Ada Lovelace",
      "ada@acme.com",
      "Grace Hopper",
      "grace@acme.com",
    ]);
  });

  it("throws when no assignments are available to export", () => {
    const service = new ExportService();

    expect(() =>
      (
        service as unknown as {
          createWorksheet: (
            assignments: readonly SecretSantaAssignment[]
          ) => XLSX.WorkSheet;
        }
      ).createWorksheet([])
    ).toThrowError(SecretSantaError);
    expect(() =>
      (
        service as unknown as {
          createWorksheet: (
            assignments: readonly SecretSantaAssignment[]
          ) => XLSX.WorkSheet;
        }
      ).createWorksheet([])
    ).toThrow("No Secret Santa assignments available to export");
  });
});
