import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { IUserData } from "src/app/interfaces/user-data";
import { FormControl, FormGroup } from "@angular/forms";
import { IReportData } from "src/app/interfaces/report-data";

@Component({
  selector: "app-project-info-dialog",
  templateUrl: "./share-with-dialog.component.html",
  styleUrls: ["./share-with-dialog.component.scss"]
})
export class ShareTaskWithDialogComponent implements OnInit {
  users: Array<IUserData>;
  shareForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ShareTaskWithDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public reportData: IReportData
  ) {}

  ngOnInit() {
    this.shareForm = new FormGroup({
      usersToShareWith: new FormControl(null)
    });
    console.log(this.reportData);

    this.users = JSON.parse(localStorage.getItem("usersData"));
    console.log(this.users);
    this.users.splice(
      this.users.indexOf(
        this.users.find(user => user.email === this.reportData.creatorEmail)
      ),
      1
    );
    console.log(this.users);
  }

  onNoClick(): void {
    let shareToUserId: Array<number> = this.shareForm.get("usersToShareWith")
      .value;
    this.dialogRef.close(shareToUserId);
  }
}
