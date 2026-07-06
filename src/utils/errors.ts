export class SecretSantaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecretSantaError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while generating assignments";
}
