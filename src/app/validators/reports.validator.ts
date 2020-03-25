import { FormControl, FormGroup } from "@angular/forms";
import { IReportData } from "../interfaces/report-data";

// to do
export class ReportValidator {
  startDateValidation(startDateInput: FormControl): { [s: string]: boolean } {
    let currentDate = new Date(new Date().toDateString());

    if (startDateInput.value !== null && startDateInput !== undefined) {
      let inputDate = new Date(new Date(startDateInput.value).toDateString());
      if (
        currentDate > inputDate ||
        currentDate.toDateString() === inputDate.toDateString()
      ) {
        return null;
      }
      return { incorrectStartDate: true };
    }
  }

  timePerDayValidator(
    reports: IReportData[],
    report: IReportData,
    idEdited: boolean
  ) {
    let sum: number = 0;
    const limit: number = 8;
    let overtimeSum: number = 0;
    const overtimeLimit: number = 16;

    console.log(reports);
    console.log(report);
    var oldReportTime;
    reports
      .filter(elem => elem.startDate == report.startDate)
      .forEach(r => ((sum += r.time), (overtimeSum += r.overtime)));
    if (idEdited) {
      console.log(reports.filter(elem => elem.id === report.id));
      oldReportTime = reports.filter(elem => elem.id === report.id)[0].time;
      sum -= oldReportTime;
    }

    console.log("fsadgdfgdffd  " + sum);
    return {
      enoughtTime: sum + report.time <= limit,
      time: limit - sum,
      enoughtOverTime: overtimeSum + report.overtime <= overtimeLimit,
      overtime: overtimeLimit - overtimeSum
    };
  }

  DateValidation(startDateInput: FormControl): { [s: string]: boolean } {
    const date: Date = new Date(startDateInput.value);

    console.log('This is the ' + date.getDay());
    if(date.getDay() == 6 || date.getDay() == 0) {
      return {weekendDay: true};
    }
    return null;
  }

}
