import { describe, expect, it } from "vitest";
import type { Employee } from "../models/Employee";
import type { SecretSantaAssignment } from "../models/SecretSantaAssignment";
import { SecretSantaService } from "../services/SecretSantaService";

const employees: Employee[] = [
  { name: "Ada Lovelace", email: "ada@acme.com" },
  { name: "Grace Hopper", email: "grace@acme.com" },
  { name: "Katherine Johnson", email: "katherine@acme.com" },
  { name: "Mary Jackson", email: "mary@acme.com" }
];

const previousAssignments: SecretSantaAssignment[] = [
  { employee: employees[0], secretChild: employees[1] },
  { employee: employees[1], secretChild: employees[2] },
  { employee: employees[2], secretChild: employees[3] },
  { employee: employees[3], secretChild: employees[0] }
];

describe("SecretSantaService", () => {
  it("never assigns an employee to themselves", () => {
    const service = new SecretSantaService();
    const assignments = service.generateAssignments(employees);

    for (const assignment of assignments) {
      expect(assignment.employee.email).not.toBe(assignment.secretChild.email);
    }
  });

  it("never assigns the previous year's child to the same employee", () => {
    const service = new SecretSantaService();
    const assignments = service.generateAssignments(employees, previousAssignments);

    for (const assignment of assignments) {
      const previous = previousAssignments.find(
        (previousAssignment) =>
          previousAssignment.employee.email === assignment.employee.email
      );

      expect(assignment.secretChild.email).not.toBe(previous?.secretChild.email);
    }
  });

  it("assigns every child exactly once", () => {
    const service = new SecretSantaService();
    const assignments = service.generateAssignments(employees, previousAssignments);
    const childEmails = assignments.map((assignment) => assignment.secretChild.email);

    expect(new Set(childEmails).size).toBe(employees.length);
    expect(assignments).toHaveLength(employees.length);
  });

  it("rejects empty employee lists", () => {
    const service = new SecretSantaService();

    expect(() => service.generateAssignments([])).toThrow("No employees found");
  });

  it("rejects impossible assignment scenarios", () => {
    const service = new SecretSantaService();
    const twoEmployees = employees.slice(0, 2);
    const impossiblePreviousAssignments: SecretSantaAssignment[] = [
      { employee: twoEmployees[0], secretChild: twoEmployees[1] },
      { employee: twoEmployees[1], secretChild: twoEmployees[0] }
    ];

    expect(() =>
      service.generateAssignments(twoEmployees, impossiblePreviousAssignments)
    ).toThrow("Employee cannot be assigned because no valid Secret Santa combination exists");
  });
});
