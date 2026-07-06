import { describe, expect, it } from "vitest";
import { ExportService } from "../services/ExportService";

describe("ExportService", () => {
  it("creates the required CSV output format", () => {
    const service = new ExportService();
    const csv = service.createCsv([
      {
        employee: { name: "Ada Lovelace", email: "ada@acme.com" },
        secretChild: { name: "Grace Hopper", email: "grace@acme.com" }
      }
    ]);

    expect(csv).toBe(
      [
        "Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID",
        "Ada Lovelace,ada@acme.com,Grace Hopper,grace@acme.com"
      ].join("\n")
    );
  });
});
