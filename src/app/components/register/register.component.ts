import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControlOptions,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnDestroy {
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}
  // properties
  msgError: string = '';
  isloading: boolean = false;
  registerSubscribe!: Subscription;

  registerForm: FormGroup = this._FormBuilder.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.pattern(/^^[A-Za-z0-9]{6,9}$/)],
      ],
      rePassword: [''],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
    },
    { validators: [this.repassValidators] } as FormControlOptions
  );

  repassValidators(fGroup: FormGroup): void {
    const pass = fGroup.get('password');
    const rePass = fGroup.get('rePassword');
    if (rePass?.value == '') {
      rePass?.setErrors({ required: true });
    } else if (rePass?.value != pass?.value) {
      rePass?.setErrors({ misMatch: true });
    }
  }

  handleRegisterationForm() {
    this.isloading = true;
    if (this.registerForm.valid) {
      this.registerSubscribe = this._AuthService
        .signup(this.registerForm.value)
        .subscribe({
          next: (response: any) => {
            if (response.message == 'success') {
              this.isloading = false;
              this._Router.navigate(['/login']);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.isloading = false;
            console.log(err);
            this.msgError = err.error.message;
          },
        });
    } else {
      this.isloading = false;
      this.registerForm.markAllAsTouched();
      this.msgError = 'All inputs required';
    }
  }

  goLoginPage() {
    this._Router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.registerSubscribe?.unsubscribe();
  }
}
