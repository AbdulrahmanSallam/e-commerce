import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  constructor(
    private _FormBuilder: FormBuilder,
    private _CartService: CartService,
    private _ActivatedRoute: ActivatedRoute,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}
  // properties
  cartId: string = '';
  msgError: string = '';
  // form
  checkoutForm: FormGroup = this._FormBuilder.group({
    details: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ],
    ],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
    ],
    city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s\-']+$/)]],
  });

  ngOnInit(): void {
    this.getCartId();
  }

  // get cart id from url
  getCartId(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params: any) => {
        this.cartId = params.get('id');
      },
    });
  }

  checkoutSubmit(): void {
    this._NgxSpinnerService.show();
    if (this.checkoutForm.valid) {
      this._CartService
        .checkoutSession(this.cartId, this.checkoutForm.value)
        .subscribe({
          next: (response) => {
            this._NgxSpinnerService.hide();
            if ((response.status = 'success')) {
              window.open(response.session.url, '_self');
            }
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
          },
        });
    } else {
      this._NgxSpinnerService.hide();
      this.checkoutForm.markAllAsTouched();
      this.msgError = 'All inputs required';
    }
  }
}
