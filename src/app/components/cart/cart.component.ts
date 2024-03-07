import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  constructor(
    private _CartService: CartService,
    private _Router: Router,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}
  // properties
  cartData: any = {};
  getSubscription!: Subscription;
  removeSubscription!: Subscription;
  updateSubscription!: Subscription;
  clearAllSubscription!: Subscription;

  ngOnInit(): void {
    this.getCartProducts();
  }

  getCartProducts(): void {
    this._NgxSpinnerService.show();
    this.getSubscription = this._CartService.getCartProducts().subscribe({
      next: (response: any) => {
        this.cartData = response.data;
        this._NgxSpinnerService.hide();
      },
      error: (err: any) => {
        console.log(err);
        this._NgxSpinnerService.hide();
      },
    });
  }

  removeProduct(productId: string): void {
    this._NgxSpinnerService.show();
    this.removeSubscription = this._CartService
      .removeProduct(productId)
      .subscribe({
        next: (response: any) => {
          this.cartData = response.data;
          this._NgxSpinnerService.hide();
        },
        error: (err: any) => {
          console.log('error', err);
          this._NgxSpinnerService.hide();
        },
      });
  }

  updateProductQuantity(productId: string, count: number): void {
    if (count > 0) {
      this._NgxSpinnerService.show();
      this.updateSubscription = this._CartService
        .updateProductQuantity(productId, count)
        .subscribe({
          next: (response: any) => {
            this.cartData = response.data;
            this._NgxSpinnerService.hide();
          },
          error: (err: any) => {
            console.log(err);
            this._NgxSpinnerService.hide();
          },
        });
    } else {
      this.removeProduct(productId);
    }
  }

  clearCart(): void {
    this._NgxSpinnerService.show();
    this.clearAllSubscription = this._CartService.clearCart().subscribe({
      next: (response: any) => {
        this._NgxSpinnerService.hide();
        this._Router.navigate(['/home']);
      },
      error: (err: any) => {
        console.log(err);
        this._NgxSpinnerService.hide();
      },
    });
  }

  ngOnDestroy(): void {
    this.getSubscription?.unsubscribe();
    this.removeSubscription?.unsubscribe();
    this.updateSubscription?.unsubscribe();
    this.clearAllSubscription?.unsubscribe();
  }
}
