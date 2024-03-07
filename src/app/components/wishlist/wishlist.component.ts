import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product';
import { CartService } from 'src/app/shared/services/cart.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  constructor(
    private _WishlistService: WishlistService,
    private _CartService: CartService,
    private _ToastrService: ToastrService,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}
  // properties
  products: Product[] = [];
  getSubscribe!: Subscription;
  addSubscribe!: Subscription;
  removeSubscribe!: Subscription;

  ngOnInit(): void {
    this.getWishlistItems();
  }

  getWishlistItems(): void {
    this._NgxSpinnerService.show();
    this.getSubscribe = this._WishlistService.getWishListItems().subscribe({
      next: (response) => {
        this._NgxSpinnerService.hide();
        this.products = response.data;
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
        console.log(err);
      },
    });
  }

  addToCart(productId: string): void {
    this._NgxSpinnerService.show();
    this.addSubscribe = this._CartService
      .addProductToCart(productId)
      .subscribe({
        next: (response) => {
          this._NgxSpinnerService.hide();
          this._ToastrService.success(response.message);
        },
        error: (err) => {
          this._NgxSpinnerService.hide();
          this._ToastrService.success(err.message);
        },
      });
  }

  removeProduct(productId: string): void {
    this._NgxSpinnerService.show();
    this.removeSubscribe = this._WishlistService
      .removeItem(productId)
      .subscribe({
        next: (response) => {
          this._ToastrService.success(response.message);
          this.getWishlistItems();
          this._NgxSpinnerService.hide();
        },
        error: (err) => {
          this._NgxSpinnerService.hide();
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.getSubscribe?.unsubscribe();
    this.addSubscribe?.unsubscribe();
    this.removeSubscribe?.unsubscribe();
  }
}
