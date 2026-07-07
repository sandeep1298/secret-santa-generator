# Walkthrough

This document explains how the Secret Santa Generator works from application startup through CSV export.

## Application Startup

The browser loads `index.html`, which contains the root element used by React. `src/main.tsx` creates the React root and renders `App`.

`src/App.tsx` keeps the top-level page simple. It renders:

- `Navbar` for the sticky header and start link.
- `HeroSection` for the landing area.
- `SecretSantaGenerator` for the complete upload, generation and export workflow.

The hero banner image lives in `src/assets/banner_image.png`. `HeroSection` imports that image directly, so Vite includes it in the production asset pipeline and fingerprints it during build.

## User Flow

The application is designed around one dashboard-style flow.

1. The user opens the page and selects **Start Assignment**.
2. The user uploads an employee file. This file is required.
3. The user may upload a previous-year result file. This file is optional.
4. The user selects **Generate Secret Santa**.
5. The application displays a result table with each employee and their secret child.
6. The user downloads `secret-santa-result-current-year.csv`.

If the user only uploads the employee file, the app still generates a valid Secret Santa assignment. It enforces self-match prevention and unique child assignment.

If the user also uploads the previous-year result file, the app additionally prevents an employee from receiving the same child they received in the previous year.

## File Upload Flow

`SecretSantaGenerator` renders two `FileUploader` components:

- **Upload Employee File**: required.
- **Upload Previous Year Result (Optional)**: optional.

Both uploaders use React Dropzone and accept `.xlsx`, `.xls` and `.csv` files. When a file is dropped or selected, the uploader passes the first accepted file to `useSecretSanta`.

`useSecretSanta` then calls the correct parser method:

- `loadEmployees` calls `FileParserService.parseEmployees`.
- `loadPreviousAssignments` calls `FileParserService.parsePreviousAssignments`.

The hook stores parsed data in React state. If parsing fails, it clears the invalid state and displays a friendly error message through `ErrorMessage`.

## Employee File Requirements

The employee file must contain:

- `Employee_Name`
- `Employee_EmailID`

Each valid row becomes an `Employee` object:

```ts
{
  name: string;
  email: string;
}
```

Employee emails are trimmed and converted to lowercase so duplicate detection is reliable even when input casing differs.

## Previous-Year File Requirements

The previous-year result file is optional. When provided, it must contain:

- `Employee_Name`
- `Employee_EmailID`
- `Secret_Child_Name`
- `Secret_Child_EmailID`

Each valid row becomes a `SecretSantaAssignment` object:

```ts
{
  employee: Employee;
  secretChild: Employee;
}
```

The generator uses the employee email and secret child email from these rows to block repeated pairings.

## Excel Parsing Flow

`FileParserService` owns all spreadsheet parsing responsibility.

It performs these steps:

- Confirms a file was selected.
- Rejects empty files.
- Rejects files larger than 5 MB before parsing.
- Rejects unsupported file extensions.
- Dynamically imports `xlsx` only when parsing is needed.
- Reads the first worksheet.
- Extracts and validates the header row.
- Converts spreadsheet rows into domain objects.
- Trims names and normalizes emails.
- Rejects invalid rows and duplicate employee emails.

The `xlsx` dependency is lazy-loaded so the initial app bundle stays smaller and spreadsheet parsing code is only loaded when the user uploads a file.

## Secret Santa Generation Flow

When the user selects **Generate Secret Santa**, `useSecretSanta.generateAssignments` first checks that employees were loaded. It does not require the previous-year result file.

The hook calls:

```ts
secretSantaService.generateAssignments(
  employees,
  previousAssignments ?? []
);
```

That means:

- No previous file uploaded: generation runs with an empty previous-assignment list.
- Previous file uploaded: generation runs with repeat-pairing prevention.

## Secret Santa Algorithm

`SecretSantaService` owns the assignment algorithm.

The service enforces these rules:

- An employee cannot be assigned to themselves.
- Every employee receives exactly one secret child.
- Every secret child is assigned only once.
- If previous assignments exist, an employee cannot receive the same child again.
- If no valid assignment exists, generation fails with a user-friendly error.

The generator uses randomized backtracking:

1. Validate the employee list.
2. Normalize employee emails.
3. Build a map of previous employee email to previous child email.
4. Shuffle employees and children to keep output random.
5. Choose the employee with the fewest valid child candidates.
6. Try a valid child candidate.
7. Remove that child from the available pool.
8. Continue recursively until everyone is assigned.
9. Backtrack if a branch cannot produce a complete valid result.

Choosing the most constrained employee first makes impossible scenarios fail faster while still allowing random valid results.

## Optional Previous-Year Behavior

The previous-year file changes only one rule: whether repeat pairings are blocked.

Without previous-year data, the app prevents:

- Self assignments.
- Duplicate child assignments.

With previous-year data, the app prevents:

- Self assignments.
- Duplicate child assignments.
- Same employee-to-child pairings from the previous year.

This keeps the app usable for first-time Secret Santa runs while preserving the stricter rule when historical data is available.

## Export Flow

`ResultTable` displays generated assignments and exposes the **Download CSV** action.

When clicked, `useSecretSanta.downloadCsv` calls `ExportService.downloadCsv`.

`ExportService` creates a CSV with this exact header:

```csv
Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
```

The downloaded file is named:

```text
secret-santa-result-current-year.csv
```

CSV values are escaped when they contain commas, quotes or line breaks.

## Component Responsibility

- `Navbar`: Sticky top navigation and start CTA.
- `HeroSection`: Landing hero using the banner image from `src/assets`.
- `FileUploader`: Drag-and-drop file selection with accepted file types.
- `EmployeeTable`: Preview of parsed employees.
- `ResultTable`: Generated assignment display and CSV download action.
- `Button`: Shared button styling and variants.
- `Loader`: Animated parsing and generation feedback.
- `ErrorMessage`: User-friendly error display.
- `SecretSantaGenerator`: Feature-level screen that arranges the full workflow.

## Hook Responsibility

`useSecretSanta` is the state orchestration layer between UI and services.

It owns:

- Parsed employee state.
- Optional previous-year assignment state.
- Generated result state.
- Selected file names.
- Parsing and generation loading states.
- User-facing error messages.
- Calls to parse, generate, reset and download.

Keeping this logic in a hook prevents `App.tsx` and UI components from becoming business-logic containers.

## Service Responsibility

- `FileParserService`: Reads XLSX, XLS and CSV files, validates columns and converts rows.
- `SecretSantaService`: Generates valid assignments and validates assignment integrity.
- `ExportService`: Builds and downloads the final CSV.

The services are class-based to satisfy the OOP requirement and keep responsibilities separated.

## Error Handling

Errors are thrown by services as regular `Error` objects with friendly messages. The hook catches them and stores the message in state. The UI renders the message without crashing the page.

Handled cases include:

- Empty file.
- Invalid columns.
- Wrong file format.
- Duplicate employee email.
- Less than two employees.
- Invalid previous-year result structure.
- Impossible assignment scenarios.
- Attempting to export before assignments exist.

## Test Coverage

Tests cover:

- Employees are never assigned to themselves.
- Employees are never assigned their previous-year child.
- Every child is assigned once.
- Empty employee list validation.
- Impossible assignment detection.
- Invalid file column validation.
- Duplicate employee email validation.
- Previous-year assignment parsing.
- Required CSV header and row format.

Run tests with:

```bash
npm run test
```

## Build Verification

The production build runs TypeScript project checks and Vite bundling:

```bash
npm run build
```
