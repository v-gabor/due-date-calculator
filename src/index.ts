import { InvalidReportCreationTimeError } from "./errors";
import { runInThisContext } from "vm";

class DueDateCalculator {
  issueCreatedAt: Date;
  turnaroundTime: number;

  constructor({ createdAt, turnaroundTime }: IssueData) {
    this.issueCreatedAt = new Date(createdAt);
    this.turnaroundTime = turnaroundTime;
  }

  calculateDueDate(): ResolvedIssueData {
    this.checkWeekdays();

    return {
      resolvedAt: "now!",
    };
  }

  /**
   * This method check the day. Saturday and sunday are invalid days.
   */
  checkWeekdays() {
    if (
      this.issueCreatedAt.getDay() == 0 ||
      this.issueCreatedAt.getDay() == 6
    ) {
      throw new InvalidReportCreationTimeError(
        "Saturday and sunday are not valid days!"
      );
    }
  }
}

export const CalculateDueDate = (issueData: IssueData): ResolvedIssueData => {
  const calculator = new DueDateCalculator(issueData);

  return calculator.calculateDueDate();
};
