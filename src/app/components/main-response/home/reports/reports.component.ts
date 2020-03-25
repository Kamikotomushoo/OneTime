import { Component, OnInit, ViewChild } from "@angular/core";
import { IReportData } from "src/app/interfaces/report-data";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ReportService } from "src/app/services/report-http.service";
import "bootstrap/dist/js/bootstrap.bundle";
import { MatTableDataSource, MatPaginator, MatDialog } from "@angular/material";
import { IsPageLoading } from "src/app/services/is-loading-emitter.service";
import { IUserData } from "src/app/interfaces/user-data";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"]
})
export class ReportsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  isEdited = false;
  currentReportId: number;
  currentReportIndex: number;
  applyBtnDisabled: boolean = false;

  // Displayed columns in the main table
  displayedColumns: string[] = ["creator", "name", "description", "actions"];

  reports: Array<IReportData> = new Array<IReportData>();

  user: IUserData;

  dataSource = new MatTableDataSource<IReportData>(this.reports);

  reportForm: FormGroup;
  filterForm: FormGroup;
  filterDateForm: FormGroup;

  constructor(
    private reportService: ReportService,
    private pageLoading: IsPageLoading
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.pageLoading.isLoading.next(true);

    this.createReportForm();

    this.reportForm.reset();

    this.onGet();
    this.dataSource._updateChangeSubscription();
    this.pageLoading.isLoading.next(false);
  }

  createReportForm() {
    this.reportForm = new FormGroup({
      nameControl: new FormControl(null, [
        Validators.required,
        Validators.maxLength(24)
      ]),
      descriptionControl: new FormControl(null, [
        Validators.required,
        Validators.maxLength(64)
      ])
    });
  }

  onClearFilters() {
    this.dataSource.data = this.reports;
    this.applyBtnDisabled = false;
  }

  // pushing new report to array
  onSubmit() {
    this.pageLoading.isLoading.next(true);

    const reportData: IReportData = {
      name: this.reportForm.get("nameControl").value,
      description: this.reportForm.get("descriptionControl").value,
      creatorEmail: JSON.parse(localStorage.getItem("userData")).email
    };

    if (this.isEdited) {
      reportData.id = this.currentReportId;
    }

    if (this.isEdited) {
      this.isEdited = false;
      reportData.id = this.currentReportId;

      const currReport = this.reportService.putData(
        reportData,
        this.currentReportId
      );
      this.pageLoading.isLoading.next(false);
      this.dataSource.data[this.currentReportIndex] = currReport;
      this.dataSource._updateChangeSubscription();
    } else {
      // CHANGE TO GET ID FROM POST RESPONSE

      const report = this.reportService.postData(reportData);
      this.pageLoading.isLoading.next(false);
      this.dataSource.data.push(report);
      this.dataSource._updateChangeSubscription();
    }
    // reseting form
    this.reportForm.reset();
  }

  // LATER CHANGE
  // delete current report from array, set its values on form
  onEdit(report: IReportData) {
    this.isEdited = true;
    this.currentReportId = report.id;

    this.reportForm.reset();

    this.reportForm.patchValue({ nameControl: report.name });
    this.reportForm.patchValue({ descriptionControl: report.description });
    const index: number = this.dataSource.data.indexOf(report);
    if (index !== -1) {
      this.currentReportIndex = index;
    } else {
      console.log("onEdit: cant find index of report in dataSource");
    }
  }

  onCancel() {
    this.isEdited = false;
    this.currentReportIndex = -1;
    this.currentReportId = -1;

    this.reportForm.reset();
  }

  // change report status CHANGE
  onNotify(report: IReportData) {
    this.pageLoading.isLoading.next(true);

    this.reportService.shareReport(report);
    this.pageLoading.isLoading.next(false);
  }

  onGet() {
    this.pageLoading.isLoading.next(true);

    this.user = JSON.parse(localStorage.getItem("userData"));
    this.reports = this.reportService.getData(this.user.id);
    this.dataSource.data = this.reports;
    console.log(this.dataSource.data);
    this.dataSource._updateChangeSubscription();
  }

  onDelete(report: IReportData) {
    this.dataSource.data = this.reportService.deleteData(report);
    this.pageLoading.isLoading.next(false);
    this.dataSource._updateChangeSubscription();
  }

  getCreatorEmail(email: string) {
    return email === this.user.email ? "Me" : email;
  }
}
