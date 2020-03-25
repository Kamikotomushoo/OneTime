import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { IUserData, IPassword } from "../interfaces/user-data";
import { environment } from "../../environments/environment";
import { catchError, tap, concat } from "rxjs/operators";
import { throwError, BehaviorSubject } from "rxjs";
import { User } from "../interfaces/user-class.model";
import { Router } from "@angular/router";
import { BCryptService } from "./bcrypt.service";

@Injectable()
export class SignInUpService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private bCryptService: BCryptService
  ) {}

  // signUp(userSignUpData: IUserData) {
  //   return this.http
  //     .post<IUserData>(environment.apiUrl + "/Account/SignUp", userSignUpData)
  //     .pipe(
  //       catchError(this.errorHandling),
  //       tap(responseData => {
  //         this.authHandling(
  //           responseData.email,
  //           responseData.firstName,
  //           responseData.secondName,
  //           responseData.id,
  //           responseData.positionId
  //         );
  //       })
  //     );
  // }

  signUp(userSignUpData: IUserData) {
    // localStorage.removeItem("usersData");
    // localStorage.removeItem("passwords");

    let usersData: Array<IUserData> = JSON.parse(
      localStorage.getItem("usersData")
    );
    console.log(usersData);
    if (usersData === null) {
      console.warn("NULL");
      usersData = [];
    } else {
      const emeilExist = this.doesEmailExist(userSignUpData.email);
      if (emeilExist) {
        return { success: false, errorMessage: "Email is in use." };
      }
    }

    let newUser: IUserData = this.newUserCreate(userSignUpData);
    delete newUser.password;
    usersData.push(newUser);
    console.log("------------");
    console.log(usersData);
    console.log("------------");
    localStorage.setItem("usersData", JSON.stringify(usersData));
    this.authHandling(
      newUser.email,
      newUser.firstName,
      newUser.secondName,
      newUser.id
    );

    return { success: true, userName: newUser.firstName };
  }

  // singIn(userLoginInData: IUserData) {
  //   console.log(userLoginInData);
  //   return this.http
  //     .post<IUserData>(environment.apiUrl + "/Account/SignIn", userLoginInData)
  //     .pipe(
  //       catchError(this.errorHandling),
  //       tap(responseData => {
  //         this.authHandling(
  //           responseData.email,
  //           responseData.firstName,
  //           responseData.secondName,
  //           responseData.id
  //         );
  //       })
  //     );
  // }

  singIn(userLoginInData: IUserData) {
    const usersData: Array<IUserData> = JSON.parse(
      localStorage.getItem("usersData")
    );
    if (usersData === null) {
      return { success: false, errorMessage: "There is no email" };
    }
    const userToLogin = usersData.find(
      user => user.email === userLoginInData.email
    );
    if (userToLogin === undefined) {
      return { success: false, errorMessage: "There is no email" };
    }
    if (this.bCryptService.compare(userLoginInData.password, userToLogin.id)) {
      this.authHandling(
        userToLogin.email,
        userToLogin.firstName,
        userToLogin.secondName,
        userToLogin.id
      );
      return { success: true };
    } else {
      return { success: false, errorMessage: "Bad password" };
    }
  }

  private newUserCreate(userData: IUserData) {
    let usersData: Array<IUserData> = JSON.parse(
      localStorage.getItem("usersData")
    );
    userData.id = usersData ? usersData[usersData.length - 1].id + 1 : 0;
    userData.passwordId = this.hashingPassword(userData.password);
    console.log(userData);
    return userData;
  }

  private hashingPassword(passwordToHash: string) {
    let passwords: Array<IPassword> = JSON.parse(
      localStorage.getItem("passwords")
    )
      ? JSON.parse(localStorage.getItem("passwords"))
      : [];

    const hashedPassword: IPassword = {
      id: passwords.length !== 0 ? passwords[passwords.length - 1].id + 1 : 0,
      passwordHash: this.bCryptService.hash(passwordToHash)
    };
    console.log(hashedPassword);
    passwords.push(hashedPassword);
    localStorage.setItem("passwords", JSON.stringify(passwords));
    return hashedPassword.id;
  }

  private doesEmailExist(userEmail: string) {
    const usersData: Array<IUserData> = JSON.parse(
      localStorage.getItem("usersData")
    );
    for (let i = 0; i < usersData.length; ++i) {
      if (usersData[i].email === userEmail) {
        console.error("Email exist");
        return true;
      }
    }

    return false;
  }

  // getUserInfoById() {
  //   console.log("we r here!!!");
  //   return this.http.get<IFullUserData>(
  //     environment.apiUrl +
  //       "/user/GetInfo/" +
  //       JSON.parse(localStorage.getItem("userData")).id
  //   );
  // }

  autoLogin() {
    const userData: User = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.firstName,
      userData.secondName,
      userData.id
    );

    this.user.next(loadedUser);
    this.autoLogout();
  }

  logout() {
    this.user.next(null);
    console.log(JSON.parse(localStorage.getItem("userData")).id);

    this.http
      .get(
        environment.apiUrl +
          "/Account/Logout/" +
          JSON.parse(localStorage.getItem("userData")).id
      )
      .subscribe(responseData => {});
    this.router.navigate(["/login"]);
    localStorage.removeItem("userData");
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  autoLogout() {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, 3600000);
  }

  private authHandling(
    email: string,
    name: string,
    surname: string,
    id: number
  ) {
    const user = new User(email, name, surname, id);
    this.user.next(user);
    this.autoLogout();
    localStorage.setItem("userData", JSON.stringify(user));
  }

  private errorHandling(errorResponse: HttpErrorResponse) {
    console.log(errorResponse);

    switch (errorResponse.error) {
      case "Bad password": {
        return throwError(errorResponse.error);
      }
      case "Email is in use.": {
        return throwError(errorResponse.error);
      }
      case "There is no email": {
        return throwError(errorResponse.error);
      }
    }

    return throwError({
      name: errorResponse.name,
      message: errorResponse.message
    });
  }
}
