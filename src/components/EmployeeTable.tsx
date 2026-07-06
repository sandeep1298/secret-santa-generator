import type { Employee } from "../models/Employee";

type EmployeeTableProps = {
  employees: readonly Employee[];
};

export function EmployeeTable({ employees }: EmployeeTableProps) {
  if (employees.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-slate-950">Employee Preview</h3>
        <span className="rounded-full bg-evergreen-100 px-3 py-1 text-xs font-bold text-evergreen-800">
          {employees.length} employees
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-3">Employee Name</th>
              <th className="px-3 py-3">Employee Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.slice(0, 8).map((employee) => (
              <tr key={employee.email}>
                <td className="px-3 py-3 font-semibold text-slate-900">{employee.name}</td>
                <td className="px-3 py-3 text-slate-600">{employee.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {employees.length > 8 ? (
        <p className="mt-3 text-xs font-medium text-slate-500">
          Showing 8 of {employees.length} employees.
        </p>
      ) : null}
    </div>
  );
}
