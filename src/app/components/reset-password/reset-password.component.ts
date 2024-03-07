import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}
  // properties
  isloading: boolean = false;

  resetForm: FormGroup = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    newPassword: [
      '',
      [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,9}$/)],
    ],
  });

  resetPassword(): void {
    console.log(this.resetForm.value);
    this.isloading = true;
    if (this.resetForm.valid) {
      this._AuthService.resetPassword(this.resetForm.value).subscribe({
        next: (response) => {
          this.isloading = false;
          this._Router.navigate(['/login']);
          console.log(response);
        },
        error: (err) => {
          this.isloading = false;
          console.log(err);
        },
      });
    } else {
      this.isloading = false;
      this.resetForm.markAllAsTouched();
    }
  }
}
