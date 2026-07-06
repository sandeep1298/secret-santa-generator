import type { Employee } from "../models/Employee";
import type { SecretSantaAssignment } from "../models/SecretSantaAssignment";
import { SecretSantaError } from "../utils/errors";
import { shuffle } from "../utils/shuffle";
import { normalizeEmail, validateEmployees } from "../utils/validators";

type AssignmentMap = Map<string, SecretSantaAssignment>;

export class SecretSantaService {
  /**
   * Generates a complete Secret Santa assignment list that satisfies all active business rules.
   */
  generateAssignments(
    employees: readonly Employee[],
    previousAssignments: readonly SecretSantaAssignment[] = []
  ): SecretSantaAssignment[] {
    validateEmployees(employees);

    const normalizedEmployees = employees.map((employee) => ({
      name: employee.name.trim(),
      email: normalizeEmail(employee.email)
    }));
    const previousChildByEmployee = this.createPreviousChildMap(previousAssignments);
    const possibleAssignments = this.findAssignments(normalizedEmployees, previousChildByEmployee);

    if (!possibleAssignments) {
      throw new SecretSantaError(
        "Employee cannot be assigned because no valid Secret Santa combination exists"
      );
    }

    return normalizedEmployees.map((employee) => {
      const assignment = possibleAssignments.get(employee.email);

      if (!assignment) {
        throw new SecretSantaError(
          "Employee cannot be assigned because no valid Secret Santa combination exists"
        );
      }

      return assignment;
    });
  }

  /**
   * Verifies that an assignment list has no self matches, duplicate children, or repeated pairs.
   */
  validateAssignments(
    assignments: readonly SecretSantaAssignment[],
    previousAssignments: readonly SecretSantaAssignment[] = []
  ): boolean {
    const previousChildByEmployee = this.createPreviousChildMap(previousAssignments);
    const assignedChildren = new Set<string>();

    for (const assignment of assignments) {
      const employeeEmail = normalizeEmail(assignment.employee.email);
      const childEmail = normalizeEmail(assignment.secretChild.email);

      if (employeeEmail === childEmail) {
        return false;
      }

      if (previousChildByEmployee.get(employeeEmail) === childEmail) {
        return false;
      }

      if (assignedChildren.has(childEmail)) {
        return false;
      }

      assignedChildren.add(childEmail);
    }

    return assignedChildren.size === assignments.length;
  }

  /**
   * Starts the randomized backtracking search and returns a map of employee email to assignment.
   */
  private findAssignments(
    employees: readonly Employee[],
    previousChildByEmployee: Map<string, string>
  ): AssignmentMap | null {
    const assignments: AssignmentMap = new Map();
    const remainingEmployees = shuffle(employees);
    const remainingChildren = shuffle(employees);

    const assigned = this.assignNext(
      remainingEmployees,
      remainingChildren,
      assignments,
      previousChildByEmployee
    );

    return assigned ? assignments : null;
  }

  /**
   * Recursively assigns one child at a time, backtracking when a partial assignment gets stuck.
   */
  private assignNext(
    remainingEmployees: readonly Employee[],
    availableChildren: readonly Employee[],
    assignments: AssignmentMap,
    previousChildByEmployee: Map<string, string>
  ): boolean {
    if (remainingEmployees.length === 0) {
      return true;
    }

    const employee = this.pickMostConstrainedEmployee(
      remainingEmployees,
      availableChildren,
      previousChildByEmployee
    );
    const candidates = shuffle(
      availableChildren.filter((child) =>
        this.canAssign(employee, child, previousChildByEmployee)
      )
    );

    if (candidates.length === 0) {
      return false;
    }

    for (const child of candidates) {
      assignments.set(employee.email, { employee, secretChild: child });

      const nextEmployees = remainingEmployees.filter(
        (remainingEmployee) => remainingEmployee.email !== employee.email
      );
      const nextChildren = availableChildren.filter(
        (availableChild) => availableChild.email !== child.email
      );

      if (this.assignNext(nextEmployees, nextChildren, assignments, previousChildByEmployee)) {
        return true;
      }

      assignments.delete(employee.email);
    }

    return false;
  }

  /**
   * Selects the employee with the fewest valid child options to reduce failed search branches.
   */
  private pickMostConstrainedEmployee(
    employees: readonly Employee[],
    availableChildren: readonly Employee[],
    previousChildByEmployee: Map<string, string>
  ): Employee {
    return [...employees].sort((first, second) => {
      const firstCandidateCount = this.countCandidates(first, availableChildren, previousChildByEmployee);
      const secondCandidateCount = this.countCandidates(
        second,
        availableChildren,
        previousChildByEmployee
      );

      return firstCandidateCount - secondCandidateCount;
    })[0];
  }

  /**
   * Counts how many currently available children can be assigned to a specific employee.
   */
  private countCandidates(
    employee: Employee,
    availableChildren: readonly Employee[],
    previousChildByEmployee: Map<string, string>
  ) {
    return availableChildren.filter((child) =>
      this.canAssign(employee, child, previousChildByEmployee)
    ).length;
  }

  /**
   * Checks whether one employee-child pairing is allowed by self-match and previous-year rules.
   */
  private canAssign(
    employee: Employee,
    child: Employee,
    previousChildByEmployee: Map<string, string>
  ) {
    const employeeEmail = normalizeEmail(employee.email);
    const childEmail = normalizeEmail(child.email);

    return employeeEmail !== childEmail && previousChildByEmployee.get(employeeEmail) !== childEmail;
  }

  /**
   * Builds a lookup of previous child email by employee email for fast repeat-pair checks.
   */
  private createPreviousChildMap(previousAssignments: readonly SecretSantaAssignment[]) {
    return new Map(
      previousAssignments.map((assignment) => [
        normalizeEmail(assignment.employee.email),
        normalizeEmail(assignment.secretChild.email)
      ])
    );
  }
}
