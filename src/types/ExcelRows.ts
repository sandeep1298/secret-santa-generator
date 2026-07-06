export type EmployeeRow = {
  Employee_Name?: unknown;
  Employee_EmailID?: unknown;
};

export type AssignmentRow = EmployeeRow & {
  Secret_Child_Name?: unknown;
  Secret_Child_EmailID?: unknown;
};
