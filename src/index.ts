import { InvalidReportCreationTimeError } from "./errors";
import {
  DAY_HOURS,
  WORK_DAY_HOURS,
  MINUTES,
  SECONDS,
  MILLISECONDS,
  TIME_FORMAT,
  WEEKHOURS,
} from "./constants";

class DueDateCalculator {
  /**
   * Issue creation time
   */
  issueCreatedAt: string;
  /**
   * The turnaroundtime
   */
  turnaroundTime: number;
  /**
   * Remaining turnaroundtime, used at calculation
   */
  remainingTurnaroundTimeMilliseconds = 0;
  /**
   * the deadline, used in calculation
   */
  dueDateMiliseconds = 0;

  constructor({ createdAt, turnaroundTime }: IssueData) {
    this.issueCreatedAt = createdAt;
    this.turnaroundTime = turnaroundTime;
  }

  calculateDueDate(): ResolvedIssueData {
    this.checkWeekdays();

    this.checkIssueCreationTime();

    return {
      resolvedAt: this.calcDueDate(),
    };
  }

  /**
   * This method check the day. Saturday and sunday are invalid days.
   */
  checkWeekdays() {
    const createdAt = new Date(this.issueCreatedAt);
    if (createdAt.getDay() == 0 || createdAt.getDay() == 6) {
      throw new InvalidReportCreationTimeError(
        "Saturday and sunday are not valid days!"
      );
    }
  }

  /**
   * This method checks if the given time is between 9AM and 5PM.
   */
  checkIssueCreationTime() {
    const hours = +this.getHours();

    if (hours < 9 || hours >= 17) {
      throw new InvalidReportCreationTimeError(
        "The report time should be bethween 9AM to 5PM"
      );
    }
  }

  calcDueDate() {
    this.dueDateMiliseconds = new Date(this.issueCreatedAt).getTime();

    this.remainingTurnaroundTimeMilliseconds =
      this.turnaroundTime * this.getMinutesInHour();

    // Calculate whole weeks
    let wholeWeeks = Math.floor(this.turnaroundTime / WEEKHOURS);

    // Increase due date with whole weeks count
    this.dueDateMiliseconds +=
      wholeWeeks * 7 * DAY_HOURS * this.getMinutesInHour();
    // Decrease turnaround time with whole weeks count
    this.remainingTurnaroundTimeMilliseconds -=
      wholeWeeks * 5 * WORK_DAY_HOURS * this.getMinutesInHour();

    // Calculate hours to fill current day
    let millisecondsToWholeWorkDay =
      (16 - +this.getHours()) * this.getMinutesInHour();

    if (millisecondsToWholeWorkDay < this.remainingTurnaroundTimeMilliseconds) {
      this.dueDateMiliseconds += millisecondsToWholeWorkDay;
      this.remainingTurnaroundTimeMilliseconds -= millisecondsToWholeWorkDay;
    }

    // Calculate minutes to fill current day
    let millisecondsToWholeHour =
      (60 - +this.getMinutes()) * SECONDS * MILLISECONDS;
    if (millisecondsToWholeHour < this.remainingTurnaroundTimeMilliseconds) {
      this.dueDateMiliseconds += millisecondsToWholeHour;
      this.remainingTurnaroundTimeMilliseconds -= millisecondsToWholeHour;
    }

    // If we have more time
    if (this.remainingTurnaroundTimeMilliseconds > 0) {
      this.dueDateMiliseconds += 16 * this.getMinutesInHour();

      // If the day is saturday then increase a date with two days
      if (new Date(this.dueDateMiliseconds).getDay() == 6) {
        this.dueDateMiliseconds += 2 * DAY_HOURS * this.getMinutesInHour();
      }
    }

    let remainingDaysToWeekend = 6 - new Date(this.dueDateMiliseconds).getDay();
    let remainingWorkDays = Math.floor(
      this.remainingTurnaroundTimeMilliseconds /
        this.getMinutesInHour() /
        WORK_DAY_HOURS
    );

    if (remainingDaysToWeekend > remainingWorkDays) {
      this.dueDateMiliseconds +=
        remainingWorkDays * DAY_HOURS * this.getMinutesInHour();

      this.remainingTurnaroundTimeMilliseconds -=
        remainingWorkDays * WORK_DAY_HOURS * this.getMinutesInHour();

      this.dueDateMiliseconds += this.remainingTurnaroundTimeMilliseconds;
      this.remainingTurnaroundTimeMilliseconds = 0;
    } else {
    }

    return new Date(this.dueDateMiliseconds).toLocaleString(
      "hu-HU",
      TIME_FORMAT
    );
  }

  /**
   * Return the hours of issue creation time.
   */
  getHours() {
    return this.issueCreatedAt.split(" ")[1].split(":")[0];
  }

  /**
   * Return the minutes of issue creation time.
   */
  getMinutes() {
    return this.issueCreatedAt.split(" ")[1].split(":")[1];
  }

  /**
   * Return the miliseconds count in an hour
   */
  getMinutesInHour() {
    return MINUTES * SECONDS * MILLISECONDS;
  }
}

export const CalculateDueDate = (issueData: IssueData): ResolvedIssueData => {
  const calculator = new DueDateCalculator(issueData);

  return calculator.calculateDueDate();
};
