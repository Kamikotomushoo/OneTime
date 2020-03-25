import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IUserData } from "../../../interfaces/user-data";
import { SignInUpService } from "src/app/services/sign-in-up.service";
import { SignInUpValidator } from "src/app/validators/sign-in-up.validator";
import { SuccessfullyRegisteredDialogComponent } from "../successfully-registered-dialog/successfully-registered-dialog.component";
import { MatDialog } from "@angular/material";
// import { ErrorResponseDialogComponent } from "../error-response-dialog/error-response-dialog.component";
// import { LocalStorageService } from "src/app/services/local-storage.service";
import { IsPageLoading } from "src/app/services/is-loading-emitter.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-registration-form",
  templateUrl: "./registration-form.component.html",
  styleUrls: ["./registration-form.component.scss"]
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  emailAlreadyRegistered: boolean = false;
  positions: Array<{ positionId: number; positionName: string }> = [
    { positionId: 1, positionName: "Developer" },
    { positionId: 2, positionName: "Project Manager" }
  ];

  constructor(
    private signInUpService: SignInUpService,
    private singInUpValidator: SignInUpValidator,
    public dialog: MatDialog,
    private loading: IsPageLoading,
    private router: Router
  ) {}

  ngOnInit() {
    this.registrationForm = new FormGroup({
      userName: new FormControl(null, [
        Validators.required,
        this.singInUpValidator.nameValidator
      ]),
      userSurname: new FormControl(null, [
        Validators.required,
        this.singInUpValidator.surnameValidator
      ]),
      userEmail: new FormControl(null, [
        Validators.required,
        this.singInUpValidator.emailValidator
      ]),
      passwords: new FormGroup(
        {
          userPassword: new FormControl(null, [
            Validators.required,
            this.singInUpValidator.passwordValidator
          ]),
          userConfirmPassword: new FormControl(null, [Validators.required])
        },
        [Validators.required, this.singInUpValidator.matchPasswordsValidator]
      )
    });
  }

  onSubmit() {
    this.removeRedBorders();
    if (this.registrationForm.invalid) {
      return;
    }
    // const inputData: IUserData = {
    //   firstName: this.registrationForm.get("userName").value,
    //   secondName: this.registrationForm.get("userSurname").value,
    //   email: this.registrationForm.get("userEmail").value,
    //   password: this.registrationForm.get("passwords").get("userPassword")
    //     .value,
    //   positionId: 1
    // };
    const inputData: IUserData = {
      firstName: this.registrationForm.get("userName").value,
      secondName: this.registrationForm.get("userSurname").value,
      email: this.registrationForm.get("userEmail").value,
      password: this.registrationForm.get("passwords").get("userPassword").value
    };

    // this.isLoading = true;
    // this.loading.isLoading.next(true);

    // this.signInUpService.signUp(inputData).subscribe(
    //   responseUserData => {
    //     this.loading.isLoading.next(false);

    //     this.openSuccessfullyRegisteredDialog(responseUserData.firstName);

    //     // TODO доробити

    //     this.registrationForm.reset();

    //     this.router.navigate(["/home"]);
    //   },
    //   errorData => {
    //     this.loading.isLoading.next(false);
    //     console.log(errorData);

    //     // TODO сюди треба додати обробку помилки, якщо ще щось сталось, хоча, тут єдиний трабл
    //     // це як раз або ВЖЕ ЗАРЕЄСТРОВАНИЙ емейл, або ж трабл з підключенням до сервака ;)

    //     if (errorData === "Email is in use.") {
    //       this.getRedBorderEmailInput();
    //     } else if (errorData.name === "HttpErrorResponse") {
    //       this.openErrorResponseDialog(errorData.message);
    //     }
    //   }
    // );
    this.loading.isLoading.next(true);
    const response = this.signInUpService.signUp(inputData);
    if (response.success) {
      this.loading.isLoading.next(false);
      this.openSuccessfullyRegisteredDialog(response.userName);

      this.registrationForm.reset();

      this.router.navigate(["/home"]);
    } else if (response.errorMessage === "Email is in use.") {
      this.loading.isLoading.next(false);
      this.getRedBorderEmailInput();
    }

    // console.log(inputData);
  }

  removeRedBorders() {
    const emailInput = document.getElementsByName("userEmail")[0];
    emailInput.classList.remove("red-border");
  }

  getRedBorderEmailInput() {
    this.registrationForm
      .get("userEmail")
      .setErrors({ alreadyRegistered: true });

    const emailInput = document.getElementsByName("userEmail")[0];
    emailInput.classList.add("red-border");
  }

  openSuccessfullyRegisteredDialog(userName: string) {
    const dialogRef = this.dialog.open(SuccessfullyRegisteredDialogComponent, {
      width: "fit-content",
      data: userName
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
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
