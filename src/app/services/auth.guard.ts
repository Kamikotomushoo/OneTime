import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SignInUpService } from "./sign-in-up.service";
import { map, tap, take } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private signInUpService: SignInUpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.signInUpService.user.pipe(
      take(1),
      map(user => {
        return !!user;
      }),
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigate(["/login"]);
        }
      })
    );
  }
}



// @Injectable({ providedIn: "root" })
// export class ProjectListGuard implements CanActivate {
//   constructor(
//     private signInUpService: SignInUpService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     router: RouterStateSnapshot
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     return this.signInUpService.user.pipe(
//       take(1),
//       map(user => {
//         return !!user;
//       }),
//       tap(isAuth => {
//         if (!isAuth) {
//           this.router.navigate(["/login"]);
//         } else if (JSON.parse(localStorage.getItem('userData')).positionId !== 3) {
//           console.log('TU NE PM');
//           this.router.navigate(["/home"]);
//         }

//       })
//     );
//   }
// }

// @Injectable({ providedIn: "root" })
// export class NotifiedListGuard implements CanActivate {
//   constructor(
//     private signInUpService: SignInUpService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     router: RouterStateSnapshot
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     return this.signInUpService.user.pipe(
//       take(1),
//       map(user => {
//         return !!user;
//       }),
//       tap(isAuth => {
//         if (!isAuth) {
//           this.router.navigate(["/login"]);
//         } else if (JSON.parse(localStorage.getItem('userData')).positionId === 1) {
//           console.log('TU DEV');
//           this.router.navigate(["/home"]);
//         }

//       })
//     );
//   }
// }
