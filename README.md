# Secret Santa Generator

A production-style React application for generating fair Secret Santa assignments for Acme. It accepts an employee file and an optional previous-year result file, validates the data, generates assignments that follow the business rules, and exports the result as `secret-santa-result-current-year.csv`.

## Features

- Upload employee XLSX, XLS or CSV files.
- Optionally upload previous-year Secret Santa result XLSX, XLS or CSV files.
- Validate required columns, duplicate emails, empty files, invalid formats and impossible scenarios.
- Generate assignments where employees never receive themselves.
- Prevent last year's repeated child pairing when a previous-year result file is uploaded.
- Ensure every secret child is assigned exactly once.
- Export the generated result as CSV.
- Responsive Christmas-inspired dashboard UI with Framer Motion animations.

## Tech Stack

- React + Vite
- TypeScript strict mode
- Tailwind CSS
- Framer Motion
- React Dropzone
- XLSX
- Vitest and React Testing Library

## Architecture

The application keeps UI, orchestration and business logic separated.

- `src/components`: Reusable UI pieces such as uploaders, tables, buttons and loaders.
- `src/features/secretSanta`: The main feature screen that wires the flow together.
- `src/hooks`: React state orchestration for parsing, generating and exporting.
- `src/services`: OOP service classes for file parsing, assignment generation and CSV export.
- `src/models`: Shared domain models.
- `src/utils`: Validation, errors and shuffle helpers.
- `src/tests`: Unit tests for core business rules and file parsing.

## Secret Santa Algorithm

`SecretSantaService` validates the employee list, builds a map of previous-year employee-to-child assignments when previous data is available, then uses randomized backtracking to assign one child to each employee. At each step it chooses the employee with the fewest valid remaining children, which helps detect impossible scenarios quickly while still producing random valid allocations.

Rules enforced:

- An employee cannot be assigned to themselves.
- An employee cannot receive the same child as the previous year when previous-year data is uploaded.
- Each employee receives exactly one child.
- Each child is assigned only once.
- Impossible combinations throw a friendly error.

## Folder Structure

```text
src/
  components/
  constants/
  features/
    secretSanta/
  hooks/
  models/
  services/
  tests/
  types/
  utils/
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Testing

```bash
npm run test
```

## Usage Walkthrough

1. Open the app and select **Start Assignment**.
2. Upload the employee list file with `Employee_Name` and `Employee_EmailID`.
3. Optionally upload the previous-year result file with `Employee_Name`, `Employee_EmailID`, `Secret_Child_Name` and `Secret_Child_EmailID`.
4. Select **Generate Secret Santa**.
5. Review the result table.
6. Download `secret-santa-result-current-year.csv`.

## Error Handling

The app catches parsing and generation failures and displays user-friendly messages such as:

- `Invalid employee file format`
- `Duplicate employee email detected`
- `No employees found`
- `Wrong file format. Upload an XLSX, XLS or CSV file.`
- `File is too large. Upload a file under 5 MB.`
- `Employee cannot be assigned because no valid Secret Santa combination exists`
