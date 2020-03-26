import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { SignInUpService } from "src/app/services/sign-in-up.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  title = "OneTime";

  constructor(
    private signInUpService: SignInUpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.signInUpService.autoLogin();
    // localStorage.setItem("redirectPath", JSON.stringify(this.route.pathFromRoot));
  }

  ngOnDestroy() {
    this.signInUpService.logout();
  }
}
