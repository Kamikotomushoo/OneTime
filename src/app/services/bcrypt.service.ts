import { Injectable } from "@angular/core";
import * as md5 from "md5";
import { IPassword } from "../interfaces/user-data";

@Injectable({ providedIn: "root" })
export class BCryptService {
  hash(rawPassword: string) {
    const salt = new Date(2000, 0, 20).getTime();
    const rounds = 10423;

    let hashed = md5(rawPassword + salt);
    for (let i = 0; i <= rounds; i++) {
      hashed = md5(hashed);
    }
    return `${salt}$${rounds}$${hashed}`;
  }

  compare(rawPassword: string, hashedPasswordId: number) {
    try {
      const hashedRawPassword = this.hash(rawPassword);
      const passwords: Array<IPassword> = JSON.parse(
        localStorage.getItem("passwords")
      );
      const hashedPassword = passwords.find(
        pass => pass.id === hashedPasswordId
      ).passwordHash;
      return hashedPassword === hashedRawPassword;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
