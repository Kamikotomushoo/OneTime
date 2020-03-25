import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-successfully-registered-dialog',
  templateUrl: './successfully-registered-dialog.component.html',
  styleUrls: ['./successfully-registered-dialog.component.scss']
})
export class SuccessfullyRegisteredDialogComponent  {

  constructor(
    public dialogRef: MatDialogRef<SuccessfullyRegisteredDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userName: string) {}



  onNoClick(): void {
    this.dialogRef.close();
  }

}
