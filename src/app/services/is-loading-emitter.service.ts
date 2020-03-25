import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { Subject } from 'rxjs';

@Injectable()
export class IsPageLoading {

  constructor() {}

  isLoading = new Subject<boolean>();

}
