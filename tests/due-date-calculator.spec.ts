import { CalculateDueDate } from "../src/index";
import { expect } from "chai";
import "mocha";

describe("Due date calculator test", () => {
  it("Sunday and saturday should throw 'InvalidReportCreationDateTime'", () => {
    expect(() =>
      CalculateDueDate({
        createdAt: "2020-08-15T09:19:00",
        turnaroundTime: 2,
      })
    ).to.throw("Saturday and sunday are not valid days!");

    expect(() =>
      CalculateDueDate({
        createdAt: "2020-08-16T09:19:00",
        turnaroundTime: 2,
      })
    ).to.throw("Saturday and sunday are not valid days!");
  });

  it("Issue reporting time should be bethween 9AM to 5PM", () => {
    expect(() =>
      CalculateDueDate({
        createdAt: "2020-08-17T08:59:00",
        turnaroundTime: 2,
      })
    ).to.throw("The report time should be bethween 9AM to 5PM");

    expect(() =>
      CalculateDueDate({
        createdAt: "2020-08-17T17:00:00",
        turnaroundTime: 2,
      })
    ).to.throw("The report time should be bethween 9AM to 5PM");
  });

  it("Valid input", () => {
    let result = CalculateDueDate({
      createdAt: "2020-08-17T09:19:00",
      turnaroundTime: 2,
    });

    expect(result.resolvedAt).to.be.equal("2020-08-17T11:19:00");

    result = CalculateDueDate({
      createdAt: "2020-08-17T14:12:00",
      turnaroundTime: 16,
    });

    expect(result.resolvedAt).to.be.equal("2020-08-17T14:19:00");

    result = CalculateDueDate({
      createdAt: "2020-08-15T16:59:00",
      turnaroundTime: 2,
    });

    expect(result.resolvedAt).to.be.equal("2020-08-17T10:59:00");
  });
});
