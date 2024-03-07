import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/user-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _HttpClient: HttpClient, private _Router: Router) {}

  getUserData(): any {
    if (localStorage.getItem('eToken') != null) {
      const token: any = localStorage.getItem('eToken');
      const userData: UserData = jwtDecode(token);
      return userData;
    }
  }

  logout(): void {
    localStorage.removeItem('eToken');
    this._Router.navigate(['/login']);
  }

  signup(userData: object): Observable<any> {
    return this._HttpClient.post(
      `https://ecommerce.routemisr.com/api/v1/auth/signup`,
      userData
    );
  }

  signin(userData: object): Observable<any> {
    return this._HttpClient.post(
      `https://ecommerce.routemisr.com/api/v1/auth/signin`,
      userData
    );
  }

  forgetPassword(email: object): Observable<any> {
    return this._HttpClient.post(
      `https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords`,
      email
    );
  }

  verifyCode(resetCode: object): Observable<any> {
    return this._HttpClient.post(
      `https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode`,
      resetCode
    );
  }

  resetPassword(resetPassForm: object): Observable<any> {
    return this._HttpClient.put(
      `https://ecommerce.routemisr.com/api/v1/auth/resetPassword`,
      resetPassForm
    );
  }
}
