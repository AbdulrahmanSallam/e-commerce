import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent {
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}
  // properties

  isloading: boolean = false;

  forgetForm: FormGroup = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  verifyEmail(): void {
    this.isloading = true;
    if (this.forgetForm.valid) {
      this._AuthService.forgetPassword(this.forgetForm.value).subscribe({
        next: (response) => {
          this.isloading = false;
          console.log(response);
          this._Router.navigate(['/verify-code']);
        },
        error: (err) => {
          this.isloading = false;
          console.log(err);
        },
      });
    } else {
      this.isloading = false;
      this.forgetForm.markAllAsTouched();
    }
  }
}
