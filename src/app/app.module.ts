import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatDialogModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatTableModule,
  MatPaginatorModule,
  MatInputModule,
  MatMenuModule,
  MatTooltipModule,
  MatSelectModule,
  MatButtonModule,
  MatCheckboxModule
} from "@angular/material";
import { StorageServiceModule } from "ngx-webstorage-service";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./components/app/app.component";
import { HeaderComponent } from "./components/header/header.component";
import { MainResponseComponent } from "./components/main-response/main-response.component";
import { RegistrationFormComponent } from "./components/main-response/registration-form/registration-form.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { SignInUpService } from "./services/sign-in-up.service";
import { SignInUpValidator } from "./validators/sign-in-up.validator";
import { SuccessfullyRegisteredDialogComponent } from "./components/main-response/successfully-registered-dialog/successfully-registered-dialog.component";
import { LogininFormComponent } from "./components/main-response/loginin-form/loginin-form.component";
import { HomeComponent } from "./components/main-response/home/home.component";
import { ReportsComponent } from "./components/main-response/home/reports/reports.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ReportService } from "./services/report-http.service";
import { ReportValidator } from "./validators/reports.validator";
import { IsPageLoading } from "./services/is-loading-emitter.service";
import { WelcomePageComponent } from "./components/main-response/welcome-page/welcome-page.component";
import { AuthGuard } from "./services/auth.guard";
import { ShareTaskWithDialogComponent } from "./components/main-response/home/share-with-dialog/share-with-dialog.component";
import { ScrollingModule } from "@angular/cdk/scrolling";

const appRoutes: Routes = [
  { path: "", component: WelcomePageComponent },
  { path: "login", component: LogininFormComponent },
  { path: "registration", component: RegistrationFormComponent },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [{ path: "reportslist", component: ReportsComponent }]
  },
  { path: "**", redirectTo: "/home" }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainResponseComponent,
    RegistrationFormComponent,
    LoadingSpinnerComponent,
    SuccessfullyRegisteredDialogComponent,
    LogininFormComponent,
    HomeComponent,
    ReportsComponent,
    WelcomePageComponent,
    ShareTaskWithDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    StorageServiceModule,
    RouterModule.forRoot(appRoutes),
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    ScrollingModule
  ],
  entryComponents: [
    SuccessfullyRegisteredDialogComponent,
    ShareTaskWithDialogComponent
  ],
  providers: [
    SignInUpService,
    SignInUpValidator,
    ReportService,
    ReportValidator,
    IsPageLoading
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
