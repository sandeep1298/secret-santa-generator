export const EMPLOYEE_COLUMNS = ["Employee_Name", "Employee_EmailID"] as const;

export const ASSIGNMENT_COLUMNS = [
  "Employee_Name",
  "Employee_EmailID",
  "Secret_Child_Name",
  "Secret_Child_EmailID"
] as const;

export const OUTPUT_FILE_NAME = "secret-santa-result-current-year.xlsx";
