import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IUserData } from "../../../interfaces/user-data";
import { SignInUpService } from "src/app/services/sign-in-up.service";
import { MatDialog } from "@angular/material";
// import { ErrorResponseDialogComponent } from "../error-response-dialog/error-response-dialog.component";
// import { LocalStorageService } from "src/app/services/local-storage.service";
import { IsPageLoading } from "src/app/services/is-loading-emitter.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-loginin-form",
  templateUrl: "./loginin-form.component.html",
  styleUrls: ["./loginin-form.component.scss"]
})
export class LogininFormComponent implements OnInit {
  loginInForm: FormGroup;
  error: string = null;

  constructor(
    private signInUpService: SignInUpService,
    public dialog: MatDialog,
    // private localStorageService: LocalStorageService,
    private loading: IsPageLoading,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginInForm = new FormGroup({
      userEmail: new FormControl(null, Validators.required),
      userPassword: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    this.removeRedBorders();
    if (this.loginInForm.invalid) {
      return;
    }
    const loginInData: IUserData = {
      email: this.loginInForm.get("userEmail").value,
      password: this.loginInForm.get("userPassword").value
    };

    // this.loading.isLoading.next(true);

    console.log("start login in");
    // this.signInUpService.singIn(loginInData).subscribe(
    //   responseData => {
    //     this.loading.isLoading.next(false);
    //     console.log("end");

    //     this.loginInForm.reset();
    //     this.router.navigate(["/home"]);
    //   },
    //   errorData => {
    //     this.loading.isLoading.next(false);
    //     console.log(errorData);
    //     if (errorData === "There is no email") {
    //       this.getRedBorderEmailInput();
    //     } else if (errorData === "Bad password") {
    //       this.getRedBorderPasswordInput();
    //     } else if (errorData.name === "HttpErrorResponse") {
    //       this.openErrorResponseDialog(errorData.message);
    //     }
    //   }
    // );

    this.loading.isLoading.next(true);

    const success = this.signInUpService.singIn(loginInData);
    if (success.success) {
      this.loading.isLoading.next(false);
      console.log("end");

      this.loginInForm.reset();
      this.router.navigate(["/home"]);
    } else {
      this.loading.isLoading.next(false);
      console.log(success.errorMessage);
      if (success.errorMessage === "There is no email") {
        this.getRedBorderEmailInput();
      } else if (success.errorMessage === "Bad password") {
        this.getRedBorderPasswordInput();
      }
    }
  }

  removeRedBorders() {
    const emailInput = document.getElementsByName("userEmail")[0];
    emailInput.classList.remove("red-border");

    const passwordInput = document.getElementsByName("userPassword")[0];
    passwordInput.classList.remove("red-border");
  }

  getRedBorderEmailInput() {
    this.loginInForm.get("userEmail").setErrors({ doesNotRegistered: true });

    const emailInput = document.getElementsByName("userEmail")[0];
    emailInput.classList.add("red-border");
  }

  getRedBorderPasswordInput() {
    this.loginInForm.get("userPassword").setErrors({ incorrectPassword: true });

    const passwordInput = document.getElementsByName("userPassword")[0];
    passwordInput.classList.add("red-border");
  }

  // openErrorResponseDialog(errorName: string) {
  //   const dialogRef = this.dialog.open(ErrorResponseDialogComponent, {
  //     width: "fit-content",
  //     data: errorName
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log("The dialog was closed");
  //   });
  // }
}
