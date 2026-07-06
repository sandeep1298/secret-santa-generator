import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { FileParserService } from "../services/FileParserService";

function createWorkbookFile(rows: unknown[][], fileName = "employees.xlsx") {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  return new File([buffer], fileName, {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}

describe("FileParserService", () => {
  it("parses a valid employee file", async () => {
    const service = new FileParserService();
    const file = createWorkbookFile([
      ["Employee_Name", "Employee_EmailID"],
      ["Ada Lovelace", "ada@acme.com"],
      ["Grace Hopper", "grace@acme.com"]
    ]);

    await expect(service.parseEmployees(file)).resolves.toEqual([
      { name: "Ada Lovelace", email: "ada@acme.com" },
      { name: "Grace Hopper", email: "grace@acme.com" }
    ]);
  });

  it("rejects invalid employee columns", async () => {
    const service = new FileParserService();
    const file = createWorkbookFile([
      ["Name", "Email"],
      ["Ada Lovelace", "ada@acme.com"]
    ]);

    await expect(service.parseEmployees(file)).rejects.toThrow("Invalid employee file format");
  });

  it("rejects duplicate employee emails", async () => {
    const service = new FileParserService();
    const file = createWorkbookFile([
      ["Employee_Name", "Employee_EmailID"],
      ["Ada Lovelace", "ada@acme.com"],
      ["Ada L.", "ADA@acme.com"]
    ]);

    await expect(service.parseEmployees(file)).rejects.toThrow(
      "Duplicate employee email detected"
    );
  });

  it("parses previous year assignments", async () => {
    const service = new FileParserService();
    const file = createWorkbookFile(
      [
        ["Employee_Name", "Employee_EmailID", "Secret_Child_Name", "Secret_Child_EmailID"],
        ["Ada Lovelace", "ada@acme.com", "Grace Hopper", "grace@acme.com"]
      ],
      "previous.xlsx"
    );

    await expect(service.parsePreviousAssignments(file)).resolves.toEqual([
      {
        employee: { name: "Ada Lovelace", email: "ada@acme.com" },
        secretChild: { name: "Grace Hopper", email: "grace@acme.com" }
      }
    ]);
  });
});
