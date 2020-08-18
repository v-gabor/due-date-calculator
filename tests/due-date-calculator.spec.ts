import { CalculateDueDate } from "../src/index";
import { expect } from "chai";
import "mocha";

describe("Due date calculator test", () => {
  it("Sunday and saturday should throw 'InvalidReportCreationDateTime'", () => {
    expect(() =>
      CalculateDueDate({
        createdAt: "2020-08-15 09:19",
        turnaroundTime: 2,
      })
    ).to.throw("Saturday and sunday are not valid days!");

    expect(() =>
      CalculateDueDate({
        createdAt: "2020-08-16 09:19",
        turnaroundTime: 2,
      })
    ).to.throw("Saturday and sunday are not valid days!");
  });

  it("Issue reporting time should be bethween 9AM to 5PM", () => {
    expect(() =>
      CalculateDueDate({
        createdAt: "2020-08-17 08:59",
        turnaroundTime: 2,
      })
    ).to.throw("The report time should be bethween 9AM to 5PM");

    expect(() =>
      CalculateDueDate({
        createdAt: "2020-08-17 17:00",
        turnaroundTime: 2,
      })
    ).to.throw("The report time should be bethween 9AM to 5PM");
  });

  it("Check result with valid inputs", () => {
    let result = CalculateDueDate({
      createdAt: "2020-08-17 09:19",
      turnaroundTime: 8,
    });

    expect(result.resolvedAt).to.be.equal("2020-08-18 09:19");

    result = CalculateDueDate({
      createdAt: "2020-08-17 14:12",
      turnaroundTime: 16,
    });

    expect(result.resolvedAt).to.be.equal("2020-08-19 14:12");

    result = CalculateDueDate({
      createdAt: "2020-08-11 16:59",
      turnaroundTime: 49,
    });

    expect(result.resolvedAt).to.be.equal("2020-08-20 09:59");

    // result = CalculateDueDate({
    //   createdAt: "2020-08-14 16:59",
    //   turnaroundTime: 1,
    // });

    // expect(result.resolvedAt).to.be.equal("2020-08-17 08:59");
  });
});
