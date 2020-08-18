export class InvalidReportCreationTimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidTurnaroundTimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
