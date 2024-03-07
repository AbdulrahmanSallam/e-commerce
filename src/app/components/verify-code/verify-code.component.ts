import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css'],
})
export class VerifyCodeComponent {
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}
  // properties

  isloading: boolean = false;
  msgError: string = '';
  verifyForm: FormGroup = this._FormBuilder.group({
    resetCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
  });

  handleVerfiyForm(): void {
    console.log(this.verifyForm.value);
    this.isloading = true;
    if (this.verifyForm.valid) {
      this._AuthService.verifyCode(this.verifyForm.value).subscribe({
        next: (response) => {
          this.isloading = false;
          console.log(response);
          this.msgError = '';
          this._Router.navigate(['/reset-password']);
        },
        error: (err) => {
          console.log(err);
          this.isloading = false;
          this.msgError = 'Code is invalid or has been expired';
        },
      });
    } else {
      console.log('error');
      this.verifyForm.markAllAsTouched();
    }
  }
}
