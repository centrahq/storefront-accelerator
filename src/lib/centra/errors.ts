export class UserError extends Error {
  constructor(
    public userErrors: Array<{ message: string }>,
    public traceId?: string,
  ) {
    super(JSON.stringify(userErrors));
    this.name = 'UserError';
  }
}

export class CentraError extends Error {
  constructor(
    public centraErrors: Array<{ message: string }>,
    public traceId?: string,
  ) {
    super(JSON.stringify(centraErrors));
    this.name = 'CentraError';
  }
}
