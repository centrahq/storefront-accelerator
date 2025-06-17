export class UserError extends Error {
  constructor(
    public userErrors: Array<{ message: string }>,
    public traceId?: string,
  ) {
    super(JSON.stringify(userErrors, null, 2));
    this.name = 'UserError';
  }
}

export class CentraError extends Error {
  constructor(
    public centraErrors: Array<{ message: string }>,
    public traceId?: string,
  ) {
    super(JSON.stringify(centraErrors, null, 2));
    this.name = 'CentraError';
  }
}
