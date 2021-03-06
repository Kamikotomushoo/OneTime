import { Component, OnInit } from "@angular/core";
import { SignInUpService } from "src/app/services/sign-in-up.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  name: string;
  userEmail: string;

  constructor(
    private signInUp: SignInUpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.navigate(["reportslist"], { relativeTo: this.route });

    this.name =
      JSON.parse(localStorage.getItem("userData")).firstName +
      " " +
      JSON.parse(localStorage.getItem("userData")).secondName;
    this.userEmail = JSON.parse(localStorage.getItem("userData")).email;
  }
  onLogout() {
    this.signInUp.logout();
  }
}
