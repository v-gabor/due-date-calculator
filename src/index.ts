class DueDateCalculator {
  calculateDueDate({
    createdAt,
    turnaroundTime,
  }: IssueData): ResolvedIssueData {
    return {
      resolvedAt: "now",
    };
  }
}

export const CalculateDueDate = (issueData: IssueData): ResolvedIssueData => {
  const calculator = new DueDateCalculator();

  return calculator.calculateDueDate(issueData);
};
