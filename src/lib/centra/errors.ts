export class UserError extends Error {
  constructor(
    public userErrors: Array<{ message: string }>,
    public traceId?: string,
  ) {
    super('User error');
    this.name = 'UserError';
  }
}

export class CentraError extends Error {
  constructor(
    public centraErrors: Array<{ message: string }>,
    public traceId?: string,
  ) {
    super('Centra error');
    this.name = 'CentraError';
  }
}
