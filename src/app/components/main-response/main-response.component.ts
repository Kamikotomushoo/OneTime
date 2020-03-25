import { Component, OnInit, AfterViewInit } from "@angular/core";
import { IsPageLoading } from 'src/app/services/is-loading-emitter.service';

@Component({
  selector: "app-main-response",
  templateUrl: "./main-response.component.html",
  styleUrls: ["./main-response.component.scss"]
})
export class MainResponseComponent implements OnInit {
  isLoading = false;
  constructor(private loading: IsPageLoading) {}

  ngOnInit() {
   this.loading.isLoading.subscribe( loading => {
    this.isLoading =  loading;
   })
  }


}
