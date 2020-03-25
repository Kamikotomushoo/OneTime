import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  IReportData,
  // IReports,
  IReportOfUser
} from "../interfaces/report-data";
import { environment } from "../../environments/environment";
// import { Observable } from "rxjs";
import { ShareTaskWithDialogComponent } from "../components/main-response/home/share-with-dialog/share-with-dialog.component";
import { MatDialog } from "@angular/material";

@Injectable()
export class ReportService {
  constructor(
    private dialog: MatDialog
  ) {}

  apiUrl: string = environment.apiUrl + "/report";


  postData(reportData: IReportData) {
    const reports: Array<IReportData> =
      JSON.parse(localStorage.getItem("reportsData")) || [];

    reportData.id = reports.length > 0 ? reports[reports.length - 1].id + 1 : 0;
    reportData.creatorEmail = JSON.parse(
      localStorage.getItem("userData")
    ).email;
    reports.push(reportData);
    localStorage.setItem("reportsData", JSON.stringify(reports));

    const reportsOfUsers: Array<IReportOfUser> =
      JSON.parse(localStorage.getItem("reportsOfUsers")) || [];

    reportsOfUsers.push({
      reportId: reportData.id,
      userId: JSON.parse(localStorage.getItem("userData")).id
    });
    localStorage.setItem("reportsOfUsers", JSON.stringify(reportsOfUsers));

    return reportData;
  }


  getData(userId: number) {

    let reportsForUser: Array<IReportData> = [];
    const reportsOfUsers: Array<IReportOfUser> = JSON.parse(
      localStorage.getItem("reportsOfUsers")
    );
    if (reportsOfUsers !== null) {
      let reports: Array<IReportData> = JSON.parse(
        localStorage.getItem("reportsData")
      );
      for (let i = 0; i < reportsOfUsers.length; ++i) {
        if (reportsOfUsers[i].userId === userId) {
          reportsForUser.push(
            reports.find(report => report.id === reportsOfUsers[i].reportId)
          );
        }
      }
    }
    console.log(reportsForUser);
    return reportsForUser;
  }


  putData(report: IReportData, id: number) {
    const reports: Array<IReportData> = JSON.parse(
      localStorage.getItem("reportsData")
    );
    console.log(reports);
    const currentReport: IReportData = reports.find(report => report.id === id);
    const index: number = reports.indexOf(currentReport);
    currentReport.name = report.name;
    currentReport.description = report.description;
    reports.splice(index, 1, currentReport);
    localStorage.setItem("reportsData", JSON.stringify(reports));

    return currentReport;
  }

  shareReport(report: IReportData) {
    const dialogRef = this.dialog.open(ShareTaskWithDialogComponent, {
      width: "fit-content",
      data: report
    });
    dialogRef.afterClosed().subscribe((result: Array<number>) => {
      console.log("The dialog was closed!!! arr: " + result);
      const reportsOfUsers: Array<IReportOfUser> = JSON.parse(
        localStorage.getItem("reportsOfUsers")
      );

      for (const res of result) {
        const NotExistedReport = reportsOfUsers.find(
          reportOfUser =>
            reportOfUser.reportId === report.id && reportOfUser.userId === res
        );
        if (NotExistedReport === undefined) {
          console.log("yeah!!! userID: " + res);
          reportsOfUsers.push({
            reportId: report.id,
            userId: res
          });
        }
      }
      console.log(reportsOfUsers);

      localStorage.setItem("reportsOfUsers", JSON.stringify(reportsOfUsers));
    });
  }

  deleteData(reportToDelete: IReportData) {
    const reports: Array<IReportData> = JSON.parse(
      localStorage.getItem("reportsData")
    );
    let reportsOfUsers: Array<IReportOfUser> = JSON.parse(
      localStorage.getItem("reportsOfUsers")
    );

    for (let i = 0; i < reportsOfUsers.length; ++i) {
      if (reportsOfUsers[i].reportId === reportToDelete.id) {
        reportsOfUsers.splice(i, 1);
      }
    }

    for (let report of reports) {
      if (report.id === reportToDelete.id) {
        reports.splice(
          reports.indexOf(
            report
          ),
          1
        );
        break;
      }
    }

    if (reports.length === 0) {
      reportsOfUsers = [];
    }
    localStorage.setItem("reportsData", JSON.stringify(reports));
    localStorage.setItem("reportsOfUsers", JSON.stringify(reportsOfUsers));

    return this.getData(JSON.parse(localStorage.getItem("userData")).id);
  }
}
