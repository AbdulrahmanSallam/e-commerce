import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}
  // properties
  msgError: string = '';
  isLoading: boolean = false;
  // subscription
  loginSubscribe!: Subscription;

  loginForm: FormGroup = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,9}$/)],
    ],
  });

  handleLoginForm() {
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.loginSubscribe = this._AuthService
        .signin(this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            if (response.message == 'success') {
              this.isLoading = false;
              // token
              localStorage.setItem('eToken', response.token);
              this._Router.navigate(['/home']);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            this.msgError = err.error.message;
          },
        });
    } else {
      this.isLoading = false;
      this.loginForm.markAllAsTouched();
      this.msgError = 'Incorrect email or password';
    }
  }

  ngOnDestroy(): void {
    this.loginSubscribe?.unsubscribe();
  }
}
